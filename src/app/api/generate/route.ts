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
