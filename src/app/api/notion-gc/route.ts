import { NextResponse } from 'next/server';
import { cleanup_old_notion_pages } from '../../../cleanupNotion';

export async function POST() {
    try {
        await cleanup_old_notion_pages();
        return NextResponse.json({ success: true, message: 'Garbage collection completed' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await cleanup_old_notion_pages();
        return NextResponse.json({ success: true, message: 'Garbage collection completed' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
