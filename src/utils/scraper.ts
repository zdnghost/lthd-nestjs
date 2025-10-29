import { Builder, Browser, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
export class ScraperService {
  constructor() { }



  async getRawHtml(url: string): Promise<string> {
    const chromeDriverPath = process.env.CHROME_DRIVER_PATH;
    const chromeExePath = process.env.CHROME_EXE_PATH;
    if (!chromeDriverPath || !chromeExePath) {
      throw new Error('Missing Chrome configuration in environment variables');
    }
    const options = new chrome.Options();
    options.setChromeBinaryPath(chromeExePath);
    options.addArguments(
      //'--headless',
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

    const driver = new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
      .build();
    try {
      console.log(`Starting to scrape ${url}`);
      await driver.get(url);
      console.log(`Navigated to ${url}`);
      await driver.wait(async () => {
        const readyState = await driver.executeScript('return document.readyState');
        return readyState === 'complete';
      }, 100000);
      console.log(`Page loaded: ${url}`);
      const html = await driver.getPageSource();
      const $ = cheerio.load(html);
      const tagsToRemove = [
        'script', 'noscript', 'svg', 'iframe', 'head', 'style',
        'source', 'footer', 'button', 'input', 'link',
        'form', 'td', 'tr', 'table', 'meta', 'i', 'option', 'video', 'label',
        'hr', 'br', 'select', 'title', 'textarea', 'aside', 'audio'
      ];
      tagsToRemove.forEach(tag => $(tag).remove());
      const attrsToRemove = [
        'class', 'id', 'style', 'width', 'height', 'rel', 'target', 'href', 'title', 'role', 'lang',
        'prefix', 'as', 'crossorigin', 'cellspacing', 'summary', 'cel_widget_id', 'content',
        'disablepictureinpicture', 'playsinline', 'preload', 'poster', 'dir', 'tabindex', 'alt',
        'loading', 'fetchpriority', 'decoding', 'sizes', 'scrolling', 'frameborder',
        'value', 'lazy-load-status', 'name'
      ];
      $('*').each((_, el) => {
        attrsToRemove.forEach(attr => $(el).removeAttr(attr));
      });
      return $.html();
    } catch (error) {
      throw new Error('Failed to scrape page');
    }
    finally {
      await driver.close();
    }
  }    
}
