import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || 'it'; // 기본값 'it'
        
        const fileName = `${category}.json`;
        const filePath = path.join(process.cwd(), 'data', fileName);
        
        if (!fs.existsSync(filePath)) {
            // 파일이 없는 경우 빈 데이터 반환
            return NextResponse.json({ 
                success: true, 
                data: { category, dateStr: '없음', articles: [] } 
            });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const fileData = JSON.parse(content);

        return NextResponse.json({ success: true, data: fileData });
    } catch (error) {
        return NextResponse.json({ success: false });
    }
}
