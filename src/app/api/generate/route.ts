import { NextResponse } from 'next/server';
import { runCategoryPipeline } from '../../../index';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const category = body.category || 'it';
        
        console.log(`[API] Manual trigger for ${category} pipeline...`);
        const data = await runCategoryPipeline(category as any);
        
        return NextResponse.json({ success: true, count: data.length, category });
    } catch (error: any) {
        console.error('[API Error]', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Vercel Cron 지원용 (기본 IT 실행)
export async function GET() {
    try {
        const data = await runCategoryPipeline('it');
        return NextResponse.json({ success: true, count: data.length });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
