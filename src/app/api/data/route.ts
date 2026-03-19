import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const outputDir = path.join(process.cwd(), 'output');
        if (!fs.existsSync(outputDir)) return NextResponse.json({ success: false });

        const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.json'));
        if (files.length === 0) return NextResponse.json({ success: false });

        const latestFile = files.sort().reverse()[0];
        const filePath = path.join(outputDir, latestFile);
        const content = fs.readFileSync(filePath, 'utf-8');

        const dateStr = latestFile.replace('tech_news_', '').replace('.json', '');
        return NextResponse.json({ success: true, data: { dateStr, articles: JSON.parse(content) } });
    } catch (error) {
        return NextResponse.json({ success: false });
    }
}
