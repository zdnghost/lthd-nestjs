import { ScraperService } from './src/utils/scraper.js'; 
import { parseHtmlWithGemini } from './src/utils/gemini.js';
import 'dotenv/config';
(async () => {
  const scraper = new ScraperService();

  try {
    console.log('🟢 Bắt đầu test scraping...');
    const html = await scraper.getRawHtml('https://www.g2a.com/persona-3-reload-pc-steam-key-global-i10000500356003'); 
    const result = await parseHtmlWithGemini(html);
    console.log(result);
    
  } catch (error) {
    console.error('❌ Lỗi khi scrape:', error);
  } finally {
    //await scraper.close();
    console.log('🔴 Chrome driver đã đóng');
  }
})();
