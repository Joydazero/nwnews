import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const outputDir = path.join(process.cwd(), 'output');
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
