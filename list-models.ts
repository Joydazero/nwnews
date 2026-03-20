import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function listModels() {
    try {
        console.log('Listing models...');
        const models = await (ai as any).models.list();
        console.log(JSON.stringify(models, null, 2));
    } catch (err: any) {
        console.error('Failed to list models!', err.message);
    }
}

listModels();
