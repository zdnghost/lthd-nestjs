import axios from 'axios';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function callGeminiApi(prompt: string) {
  const apiKey = process.env.GOOGLE_STUDIO_API_KEY;
  try {
    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await axios.post(GEMINI_API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error('Failed to call Gemini API');
  }
}
export async function parseHtmlWithGemini(html: string) {
  const prompt = `
Bạn là bot phân tích HTML của website bán game. Dưới đây là HTML của một trang sản phẩm:
""" 
${html}
"""
Hãy trích xuất ra JSON theo mẫu:
{
  "name": "Tên game",
  "description": "Mô tả ngắn",
  "platforms": "Steam",
  "type": vi du "CD key", "gift","account"
  "offers":
  [
    {
      "shoppingPlatform": shopping Platform,
      "sellerName": business sellers name,
      "price": price,
      "promotionsPrice":promotionsPrice
      "currency": currency,
      "url": "https://...",
      "stock": 20,
      "platform": "Steam"
    }
  ]
}
Chỉ trả JSON thuần, không giải thích thêm.
    `;

  const raw = await callGeminiApi(prompt);
  const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text
    .replace(/```json\n?/, '')
    .replace(/```$/, '')
    .trim();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Gemini trả về không đúng JSON');
  }
}
