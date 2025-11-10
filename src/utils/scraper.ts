import { Builder, Browser, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
export class ScraperService {
  private driver: any;
  constructor() {}
  private async initDriver(): Promise<void> {
    if (this.driver) return; // đã khởi tạo rồi thì không tạo lại

    const chromeDriverPath = process.env.CHROME_DRIVER_PATH;
    const chromeExePath = process.env.CHROME_EXE_PATH;
    if (!chromeDriverPath || !chromeExePath) {
      throw new Error('Missing Chrome configuration in environment variables');
    }

    const options = new chrome.Options();
    options.setChromeBinaryPath(chromeExePath);
    options.addArguments(
      '--log-level=3',
      '--remote-debugging-port=0',
      '--no-default-browser-check',
      '--allow-outdated-plugins',
      '--disable-logging',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-hang-monitor',
      '--disable-prompt-on-repost',
      '--disable-web-resources',
      '--safebrowsing-disable-auto-update',
      '--safebrowsing-disable-download-protection',
      '--use-mock-keychain',
      '--disable-popup-blocking',
      '--metrics-recording-only',
      '--ignore-certificate-errors',
      '--ignore-urlfetcher-cert-requests',
      '--no-first-run',
      '--disable-default-apps',
      '--silent',
      '--ignore-gpu-blacklist',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-infobars',
      '--disable-extensions',
      '--disable-dev-shm-usage',
    );

    this.driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
      .build();
  }
  async closeDriver(): Promise<void> {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }
  async getRawHtml(url: string): Promise<string> {
    await this.initDriver();
    try {
      console.log(`Starting to scrape ${url}`);
      await this.driver.get(url);
      console.log(`Navigated to ${url}`);
      await this.driver.wait(async () => {
        const readyState = await this.driver.executeScript(
          'return document.readyState',
        );
        return readyState === 'complete';
      }, 100000);
      console.log(`Page loaded: ${url}`);
      const html = await this.driver.getPageSource();
      const $ = cheerio.load(html);
      const tagsToRemove = [
        'script',
        'noscript',
        'svg',
        'iframe',
        'head',
        'style',
        'source',
        'footer',
        'button',
        'input',
        'link',
        'form',
        'td',
        'tr',
        'table',
        'meta',
        'i',
        'option',
        'video',
        'label',
        'hr',
        'br',
        'select',
        'title',
        'textarea',
        'aside',
        'audio',
      ];
      tagsToRemove.forEach((tag) => $(tag).remove());
      const attrsToRemove = [
        'class',
        'id',
        'style',
        'width',
        'height',
        'rel',
        'target',
        'href',
        'title',
        'role',
        'lang',
        'prefix',
        'as',
        'crossorigin',
        'cellspacing',
        'summary',
        'cel_widget_id',
        'content',
        'disablepictureinpicture',
        'playsinline',
        'preload',
        'poster',
        'dir',
        'tabindex',
        'alt',
        'loading',
        'fetchpriority',
        'decoding',
        'sizes',
        'scrolling',
        'frameborder',
        'value',
        'lazy-load-status',
        'name',
      ];
      $('*').each((_, el) => {
        attrsToRemove.forEach((attr) => $(el).removeAttr(attr));
      });
      return $.html();
    } catch (error) {
      throw new Error('Failed to scrape page');
    } finally {
      await this.closeDriver();
    }
  }
  async getProductLinks(query: string): Promise<string[]> {
    await this.initDriver();
    try {
      const url = `https://www.g2a.com/search?query=${encodeURIComponent(query)}`;
      await this.driver.get(url);
      await this.driver.wait(async () => {
        const readyState = await this.driver.executeScript(
          'return document.readyState',
        );
        return readyState === 'complete';
      }, 100000);
      const html = await this.driver.getPageSource();
      const $ = cheerio.load(html);
      const links: (string | null)[] = [];
      $('.inVBLd').each((_, el) => {
        const aTag = $(el).find('a').first();
        const href = aTag.attr('href');
        if (href) {
          const fullUrl = href.startsWith('http')
            ? href.replace(/^http:/, 'https:')
            : `https://www.g2a.com${href}`;
          links.push(fullUrl);
        }
      });
      const cleanLinks = [...new Set(links.filter((l): l is string => !!l))];
      return cleanLinks.slice(0, 3);
    } catch (error) {
      throw new Error('Failed to scrape page');
    } finally {
      await this.closeDriver();
    }
  }
}
