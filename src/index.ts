import * as cron from 'node-cron';
import { fetchTechArticles } from './fetchArticles';
import { summarizeArticles } from './summarizeArticles';
import { createNotionTechNews } from './createNotionTechNews';
import { cleanup_old_notion_pages } from './cleanupNotion';
import * as fs from 'fs';
import * as path from 'path';

export async function runMainPipeline() {
    console.log(`\n[${new Date().toISOString()}] Executing Main Pipeline...`);
    try {
        const rawArticles = await fetchTechArticles();
        if (rawArticles.length > 0) {
            const summarizedArticles = await summarizeArticles(rawArticles);

            const outputDir = path.join(process.cwd(), 'output');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }

            const fileName = `tech_news_${new Date().toISOString().split('T')[0]}.json`;
            const filePath = path.join(outputDir, fileName);

            fs.writeFileSync(filePath, JSON.stringify(summarizedArticles, null, 2), 'utf8');
            console.log(`[Success] Pipeline file completed. Output saved to ${filePath}`);

            // Node 3: Notion API Insert
            await createNotionTechNews(summarizedArticles);

            return summarizedArticles;
        } else {
            console.log('[Notice] No articles found.');
            return [];
        }
    } catch (error: any) {
        console.error('[Error] Pipeline failed:', error.message);
        throw error;
    }
}

/**
 * 🗑️ 워크플로우 2: 가비지 컬렉션 파이프라인 (삭제)
 * Node 0: Trigger (스케줄러 0 2 * * *, 매일 새벽 2시)
 */
export function startSchedulers() {
    console.log('Main Pipeline Scheduler started. (cron: "0 8 * * *")');
    cron.schedule('0 8 * * *', runMainPipeline);

    console.log('Garbage Collection Scheduler started. (cron: "0 2 * * *")');
    cron.schedule('0 2 * * *', () => {
        console.log(`\n[${new Date().toISOString()}] Executing Garbage Collection...`);
        cleanup_old_notion_pages();
    });
}

// 스크립트 직접 실행 (--run-now)
if (process.argv.includes('--run-now')) {
    console.log('Running job immediately for testing... (--run-now flag detected)');
    (async () => {
        try {
            await runMainPipeline();
            console.log('\n[Preview Result Completed] Check Notion or the output folder!');
            process.exit(0);
        } catch (err: any) {
            console.error('[Preview Error]', err.message);
            process.exit(1);
        }
    })();
} else if (require.main === module) {
    // PM2 또는 node src/index.ts로 실행될 때만 스케줄러 등록
    startSchedulers();
}
