import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * 🗑️ 워크플로우 2: 가비지 컬렉션 파이프라인 (삭제)
 * Node 1: Skill (오래된 데이터 검색 및 삭제)
 * - 2일(48시간)이 지난 오래된 데이터를 휴지통(Archived)으로 보냅니다.
 */
export async function cleanup_old_notion_pages(dbId?: string) {
    const targetDb = dbId || process.env.NOTION_DATABASE_ID;
    if (!process.env.NOTION_API_KEY || !targetDb) {
        console.log('[Garbage Collection] Notion credentials missing. Skipping GC.');
        return;
    }

    // 2일 전 기준 시간 계산 (ISO 스트링)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const cutoffDate = twoDaysAgo.toISOString();

    console.log(`[Garbage Collection] Searching for pages created before ${cutoffDate}...`);

    try {
        // Use any cast if typescript compiler still complains about query property locally
        const response = await (notion.databases as any).query({
            database_id: targetDb,
            filter: {
                timestamp: "created_time",
                created_time: {
                    before: cutoffDate
                }
            }
        });

        const oldPages = response.results;
        if (oldPages.length === 0) {
            console.log('[Garbage Collection] No old pages found to archive.');
            return;
        }

        console.log(`[Garbage Collection] Found ${oldPages.length} old pages. Archiving...`);

        for (const page of oldPages) {
            await notion.pages.update({
                page_id: page.id,
                archived: true
            });
            console.log(`- Archived Page ID: ${page.id}`);
        }
        console.log('[Garbage Collection] Cleanup completed successfully.');
    } catch (error: any) {
        console.error('[Garbage Collection Error] Failed to cleanup notion pages:', error.message);
    }
}
