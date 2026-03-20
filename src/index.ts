import * as cron from 'node-cron';
import { fetchTechArticles, fetchUSNews, fetchJPNews } from './fetchArticles';
import { summarizeArticles } from './summarizeArticles';
import { createNotionTechNews } from './createNotionTechNews';
import { cleanup_old_notion_pages } from './cleanupNotion';
import { pushDataToGitHub } from './utils/github';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 🚀 공통 카테고리 파이프라인 엔진
 */
export async function runCategoryPipeline(category: 'it' | 'us' | 'jp') {
    const categoryUpper = category.toUpperCase();
    console.log(`\n[${new Date().toISOString()}] Executing ${categoryUpper} Pipeline...`);
    
    try {
        let rawArticles: any[] = [];
        if (category === 'it') rawArticles = await fetchTechArticles();
        else if (category === 'us') rawArticles = await fetchUSNews();
        else if (category === 'jp') rawArticles = await fetchJPNews();

        if (rawArticles.length > 0) {
            console.log(`[Node 1-${category.toUpperCase()}] Fetched ${rawArticles.length} raw articles.`);
            
            // 1. AI 요약 및 번역 (카테고리별 에디터 역할 부여)
            const summarizedArticles = await summarizeArticles(rawArticles, category);
            
            if (summarizedArticles.length === 0) {
                console.warn(`⚠️ Summarization returned 0 articles for ${category}.`);
            }

            // 2. 로컬 JSON 저장 (it.json, us.json, jp.json)
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

            const fileName = `${category}.json`;
            const filePath = path.join(dataDir, fileName);
            const fileData = {
                category,
                dateStr: new Date().toISOString().split('T')[0],
                articles: summarizedArticles
            };

            fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
            console.log(`[Success] ${categoryUpper} file completed: ${filePath}`);

            // 2.2. 아카이브용 로컬 저장 (output/ 폴더) - 관리자 다운로드용
            const outputDir = path.join(process.cwd(), 'output');
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
            const archiveFileName = `${category}_${fileData.dateStr}.json`;
            const archiveFilePath = path.join(outputDir, archiveFileName);
            fs.writeFileSync(archiveFilePath, JSON.stringify(fileData, null, 2), 'utf8');
            console.log(`[Archive] Saved dated copy: ${archiveFilePath}`);

            // 3. Notion API (기존 IT 기능 유지, 필요 시 US/JP 확장 가능)
            if (category === 'it') {
                await createNotionTechNews(summarizedArticles);
            }

            // 4. GitHub DataPush (실시간 웹사이트 업데이트 트리거)
            console.log(`[GitHub] ${categoryUpper} 데이터를 주입합니다.`);
            await pushDataToGitHub(fileData, `data/${fileName}`);

            return summarizedArticles;
        } else {
            console.log(`[Notice] No ${categoryUpper} articles found.`);
            return [];
        }
    } catch (error: any) {
        console.error(`[Error] ${categoryUpper} Pipeline failed:`, error.message);
        throw error;
    }
}

/**
 * ⏰ 스케줄러 등록 (순차적 릴레이 실행)
 */
export function startSchedulers() {
    // 1. IT 뉴스: 매일 오전 8시 00분
    console.log('IT Pipeline Scheduler: "0 8 * * *"');
    cron.schedule('0 8 * * *', () => runCategoryPipeline('it'));

    // 2. 미국 뉴스: 매일 오전 8시 05분
    console.log('US Pipeline Scheduler: "5 8 * * *"');
    cron.schedule('5 8 * * *', () => runCategoryPipeline('us'));

    // 3. 일본 뉴스: 매일 오전 8시 10분
    console.log('JP Pipeline Scheduler: "10 8 * * *"');
    cron.schedule('10 8 * * *', () => runCategoryPipeline('jp'));

    // 4. 가비지 컬렉션: 매일 새벽 2시
    console.log('GC Scheduler: "0 2 * * *"');
    cron.schedule('0 2 * * *', () => {
        console.log(`\n[${new Date().toISOString()}] Executing GC...`);
        cleanup_old_notion_pages();
    });
}

// 직접 실행 지원 (--run-it, --run-us, --run-jp)
if (require.main === module) {
    if (process.argv.includes('--run-it')) {
        runCategoryPipeline('it').then(() => process.exit(0)).catch(() => process.exit(1));
    } else if (process.argv.includes('--run-us')) {
        runCategoryPipeline('us').then(() => process.exit(0)).catch(() => process.exit(1));
    } else if (process.argv.includes('--run-jp')) {
        runCategoryPipeline('jp').then(() => process.exit(0)).catch(() => process.exit(1));
    } else if (process.argv.includes('--run-now')) {
        // 하위 호환성 (IT 기본 실행)
        runCategoryPipeline('it').then(() => process.exit(0)).catch(() => process.exit(1));
    } else {
        startSchedulers();
    }
}
