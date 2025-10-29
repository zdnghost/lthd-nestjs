// scripts/scraper-script.js
import { ScraperService } from '../src/utils/scraper.ts';
import { parseHtmlWithGemini } from '../src/utils/gemini.ts';
import 'dotenv/config';

process.on('message', async (msg) => {
  const scraper = new ScraperService();

  try {
    console.log('🟢 Bắt đầu test scraping...', msg.url);
    
    const html = await scraper.getRawHtml(msg.url);
    const result = await parseHtmlWithGemini(html);
    
    // Gửi kết quả về parent
    process.send({ success: true, data: result });
    
  } catch (error) {
    console.error('❌ Lỗi khi scrape:', error);
    process.send({ success: false, error: error.message });
  } finally {
    await scraper.close();
    console.log('🔴 Chrome driver đã đóng');
    process.exit(0);
  }
});