import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function test() {
    try {
        console.log('Testing gemini-flash-latest...');
        const response = await (ai as any).models.generateContent({
            model: 'gemini-flash-latest',
            contents: 'Hello, world!'
        });
        console.log('Success!', response.text);
    } catch (err: any) {
        console.error('Failed!', err.message);
    }
}

test();
