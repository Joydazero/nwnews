import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const outputDir = path.join(process.cwd(), 'output');

    // 특정 파일의 내용을 요청한 경우
    if (filename) {
        const filePath = path.join(outputDir, filename);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return NextResponse.json({ success: true, content: JSON.parse(content) });
        }
        return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    // 파일 목록을 요청한 경우
    if (!fs.existsSync(outputDir)) return NextResponse.json({ success: true, files: [] });

    const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.json')).sort().reverse();
    return NextResponse.json({ success: true, files });
}

export async function DELETE(request: Request) {
    try {
        const { filename } = await request.json();
        const filePath = path.join(process.cwd(), 'output', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
