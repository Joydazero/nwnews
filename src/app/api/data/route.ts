import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'news.json');
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ success: true, data: { dateStr: '없음', articles: [] } });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const fileData = JSON.parse(content);

        return NextResponse.json({ success: true, data: fileData });
    } catch (error) {
        return NextResponse.json({ success: false });
    }
}
