import { NextResponse } from 'next/server';
import { runMainPipeline } from '../../../index';

export async function POST() {
    try {
        const data = await runMainPipeline();
        return NextResponse.json({ success: true, count: data.length });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Vercel Cron은 기본적으로 GET 요청을 보낼 수 있습니다.
export async function GET() {
    try {
        const data = await runMainPipeline();
        return NextResponse.json({ success: true, count: data.length });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
