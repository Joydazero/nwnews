import * as cron from 'node-cron';
import { fetchTechArticles, fetchUSNews, fetchJPNews, fetchDENews } from './fetchArticles';
import { summarizeArticles } from './summarizeArticles';
import { createNotionTechNews } from './createNotionTechNews';
import { cleanup_old_notion_pages } from './cleanupNotion';
import { pushDataToGitHub } from './utils/github';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 🚀 공통 카테고리 파이프라인 엔진
 */
export async function runCategoryPipeline(category: 'it' | 'us' | 'jp' | 'de') {
    const categoryUpper = category.toUpperCase();
    console.log(`\n[${new Date().toISOString()}] Executing ${categoryUpper} Pipeline (Volume Boost Mode)...`);
    
    try {
        let rawArticles: any[] = [];
        if (category === 'it') rawArticles = await fetchTechArticles();
        else if (category === 'us') rawArticles = await fetchUSNews();
        else if (category === 'jp') rawArticles = await fetchJPNews();
        else if (category === 'de') rawArticles = await fetchDENews();

        if (rawArticles.length > 0) {
            // 1. AI 요약 및 번역
            const summarizedArticles = await summarizeArticles(rawArticles, category);
            
            // 2. 수량 제한 (IT: 25, Global: 10)
            const limit = category === 'it' ? 25 : 10;
            const finalArticles = summarizedArticles.slice(0, limit);

            if (finalArticles.length === 0) {
                console.warn(`⚠️ Summarization returned 0 articles after slice for ${category}.`);
            }

            // #region agent log
            fetch('http://127.0.0.1:7937/ingest/db7347b1-8844-4ae1-a267-d775b365e441',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b562ca'},body:JSON.stringify({sessionId:'b562ca',runId:'pre-debug',hypothesisId:'H1_pipeline_write',location:'src/index.ts:runCategoryPipeline:beforeWrite',message:'about to write data/${category}.json',data:{category,rawArticlesLen:rawArticles.length,summarizedArticlesLen:summarizedArticles.length,finalArticlesLen:finalArticles.length,first:{korean_title:finalArticles?.[0]?.korean_title?String(finalArticles[0].korean_title).slice(0,40):null,summaryType:typeof finalArticles?.[0]?.summary,summaryPreview:typeof finalArticles?.[0]?.summary==='string'?finalArticles[0].summary.slice(0,80):null}} ,timestamp:Date.now()})}).catch(()=>{});
            // #endregion

            // 3. 로컬 JSON 저장
            const dataDir = path.join(process.cwd(), 'data');
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

            const fileName = `${category}.json`;
            const filePath = path.join(dataDir, fileName);
            const fileData = {
                category,
                dateStr: new Date().toISOString().split('T')[0],
                articles: finalArticles
            };

            fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
            console.log(`[Success] ${categoryUpper} file completed with ${finalArticles.length} articles.`);

            // #region agent log
            fetch('http://127.0.0.1:7937/ingest/db7347b1-8844-4ae1-a267-d775b365e441',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'b562ca'},body:JSON.stringify({sessionId:'b562ca',runId:'pre-debug',hypothesisId:'H1_pipeline_write',location:'src/index.ts:runCategoryPipeline:afterWrite',message:'wrote data file',data:{filePath,writtenArticlesLen:finalArticles.length,dateStr:fileData.dateStr,firstSummaryType:typeof finalArticles?.[0]?.summary},timestamp:Date.now()})}).catch(()=>{});
            // #endregion

            // 3.2. 아카이브용 로컬 저장
            const outputDir = path.join(process.cwd(), 'output');
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
            const archiveFileName = `${category}_${fileData.dateStr}.json`;
            const archiveFilePath = path.join(outputDir, archiveFileName);
            fs.writeFileSync(archiveFilePath, JSON.stringify(fileData, null, 2), 'utf8');

            // 4. Notion (IT Only)
            if (category === 'it') {
                await createNotionTechNews(finalArticles);
            }

            // 5. GitHub Push
            await pushDataToGitHub(fileData, `data/${fileName}`);

            return finalArticles;
        } else {
            console.log(`[Notice] No ${categoryUpper} articles found.`);
            return [];
        }
    } catch (error: any) {
        console.error(`[Error] ${categoryUpper} Pipeline failed:`, error.message);
        throw error;
    }
}
// (Omitted the rest of the file which is scheduler logic, keeping it as is in my thought but I must write the whole file)
export function startSchedulers() {
    cron.schedule('0 8 * * *', () => runCategoryPipeline('it'));
    cron.schedule('5 8 * * *', () => runCategoryPipeline('us'));
    cron.schedule('10 8 * * *', () => runCategoryPipeline('jp'));
    cron.schedule('0 2 * * *', () => cleanup_old_notion_pages());
}

if (require.main === module) {
    if (process.argv.includes('--run-it')) runCategoryPipeline('it');
    else if (process.argv.includes('--run-us')) runCategoryPipeline('us');
    else if (process.argv.includes('--run-jp')) runCategoryPipeline('jp');
    else if (process.argv.includes('--run-de')) runCategoryPipeline('de');
    else if (process.argv.includes('--run-now')) runCategoryPipeline('it');
    else startSchedulers();
}
