import { Injectable } from '@nestjs/common';
import { callGeminiApi } from './utils/gemini.js';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class AppService {
  async askGemini(): Promise<string> {
    const apiKey = process.env.GOOGLE_STUDIO_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY');
    }

    try {
      const result = await callGeminiApi(
        'Xin chào, tôi đang test api , hãy gửi phản hồi',
      );
      return result.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response';
    } catch (error: any) {
      console.error('Gemini API error:', error.response?.data || error.message);
      throw new Error('Gemini API call failed');
    }
  }
}