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
