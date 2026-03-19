module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/src/fetchArticles.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchTechArticles",
    ()=>fetchTechArticles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rss-parser/index.js [app-route] (ecmascript)");
;
async function fetchTechArticles() {
    const allArticles = [];
    console.log('[Node 1] 🌐 다중 매체(Dev.to, HackerNews, RSS)에서 기사를 혼합하여 가져옵니다...');
    // 1. Dev.to (webdev 트렌드) 8개
    try {
        const devUrl = 'https://dev.to/api/articles?tag=webdev&per_page=8';
        const devRes = await fetch(devUrl);
        if (devRes.ok) {
            const devJSON = await devRes.json();
            devJSON.forEach((item)=>{
                allArticles.push({
                    source: 'Dev.to',
                    title: item.title,
                    description: item.description || item.title,
                    url: item.url
                });
            });
            console.log('✅ Dev.to 에서 8개 뉴스 수집 완료');
        }
    } catch (error) {
        console.error('❌ Dev.to 데이터 수집 실패하였습니다.');
    }
    // 2. Hacker News (Firebase 실시간 API) 핫이슈 8개 (병렬로 속도 개선)
    try {
        const hnIdsUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
        const hnIdsRes = await fetch(hnIdsUrl);
        if (hnIdsRes.ok) {
            const hnIds = await hnIdsRes.json();
            const top8Ids = hnIds.slice(0, 8);
            const itemPromises = top8Ids.map(async (id)=>{
                const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                const item = await itemRes.json();
                return {
                    source: 'HackerNews',
                    title: item.title,
                    description: `가장 활발한 글로벌 개발자 토론이 벌어지고 있는 해커뉴스 최상단 핫토픽.`,
                    url: item.url || `https://news.ycombinator.com/item?id=${item.id}`
                };
            });
            const hnArticles = await Promise.all(itemPromises);
            allArticles.push(...hnArticles);
            console.log('✅ Hacker News 에서 상위 8개 토픽 병렬 수집 완료');
        }
    } catch (error) {
        console.error('❌ Hacker News 수집 실패하였습니다.');
    }
    // 3. 글로벌 매체 고정 RSS 피드 (Smashing Magazine) 4개
    try {
        const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rss$2d$parser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
        const feed = await parser.parseURL('https://www.smashingmagazine.com/feed/');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 4);
            topFeeds.forEach((latestFeed)=>{
                allArticles.push({
                    source: 'Smashing Magazine',
                    title: latestFeed.title,
                    description: latestFeed.contentSnippet || latestFeed.content || '본문 내용 생략',
                    url: latestFeed.link
                });
            });
            console.log('✅ Smashing Magazine RSS 에서 최신 4개 뉴스 수집 완료');
        }
    } catch (error) {
        console.error('❌ RSS Feed 파싱 실패하였습니다.');
    }
    console.log(`[Node 1] ✨ 총 ${allArticles.length}개의 통합 글로벌 기사 큐레이팅 성공!`);
    return allArticles;
}
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/promises [external] (node:stream/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/promises", () => require("node:stream/promises"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/summarizeArticles.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "summarizeArticles",
    ()=>summarizeArticles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/node/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"]();
const ai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenAI"]({
    apiKey: process.env.GEMINI_API_KEY || ''
});
// 프롬프트 템플릿
const promptTemplate = (chunkArticles)=>`
너는 실리콘밸리의 최신 기술 트렌드를 한국어로 번역/요약하는 수석 테크 에디터야.

[Task]
다음 ${chunkArticles.length}개의 영문 기사 JSON 데이터를 분석해.

[Constraints]
1. 직역을 절대 피하고, 프론트엔드/백엔드 생태계에 맞는 전문 용어를 사용하여 매끄럽게 의역해.
2. 각 기사당 3줄 이하의 핵심 요약(Bullet points)을 반드시 작성해.
3. 무의미한 일상어/조사('있다', '대해', '어떻게', '아무도')를 철저히 배제하고, "기술 스택명, 프레임워크, 라이브러리, 아키텍처, IT 전문 용어" 위주의 순도 높은 핵심 키워드(tech_keywords)를 영어 또는 한국어 명사형으로 3~5개 뽑아내.
4. 인사말 없이 오직 순수한 JSON 객체 배열 구조 텍스트만 출력해야 해.

[Output Format]
[
  {
    "original_title": "원본 영어 제목",
    "korean_title": "클릭을 유도하는 한국어 제목",
    "summary": "1. 요약 첫 번째\\n2. 요약 두 번째",
    "tech_keywords": ["React", "메모리 누수 최적화", "V8 Engine"],
    "source_url": "원본 링크"
  }
]

JSON 데이터:
${JSON.stringify(chunkArticles.map((a)=>({
            title: a.title,
            description: a.description,
            url: a.url
        })), null, 2)}
`;
async function summarizeArticles(articles) {
    console.log('[Node 2] Summarizing articles using Google Gemini API in parallel chunks...');
    // 대기 시간을 획기적으로 줄이기 위한 청크(Chunk) 기반 병렬 처리
    const chunkSize = 5;
    const chunks = [];
    for(let i = 0; i < articles.length; i += chunkSize){
        chunks.push(articles.slice(i, i + chunkSize));
    }
    const aiPromises = chunks.map(async (chunk, index)=>{
        try {
            console.log(`- Generating chunk ${index + 1}...`);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptTemplate(chunk)
            });
            let text = response.text || '[]';
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (error) {
            console.error(`Chunk ${index + 1} processing failed:`, error.message);
            return [];
        }
    });
    const results = await Promise.all(aiPromises);
    const finalArticles = results.flat();
    console.log(`[Node 2] Successfully summarized ${finalArticles.length} articles in parallel.`);
    return finalArticles;
}
}),
"[project]/src/createNotionTechNews.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createNotionTechNews",
    ()=>createNotionTechNews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$notionhq$2f$client$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@notionhq/client/build/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"]();
const notion = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$notionhq$2f$client$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Client"]({
    auth: process.env.NOTION_API_KEY
});
const databaseId = process.env.NOTION_DATABASE_ID || '';
async function createNotionTechNews(articles) {
    if (!process.env.NOTION_API_KEY || !databaseId) {
        console.log('[Notice] Notion credentials missing. Skipping Notice DB integration.');
        return;
    }
    console.log(`[Node 3] Inserting ${articles.length} articles into Notion DB (Paralleled Execution)...`);
    // [원인 해결] 기존 for문 내 await 동기 통신으로 인한 네트워크 병목 발생 (20개 기준 10초 이상 지연)
    // [개선 반영] Promise.all을 활용해 다중 비동기 병렬 요청 처리로 노션 적재 시간을 1초 단위로 대폭 단축 
    const insertPromises = articles.map((article)=>{
        return notion.pages.create({
            parent: {
                database_id: databaseId
            },
            properties: {
                "제목": {
                    title: [
                        {
                            text: {
                                content: article.korean_title
                            }
                        }
                    ]
                },
                "원문 번역/요약": {
                    rich_text: [
                        {
                            text: {
                                content: article.summary
                            }
                        }
                    ]
                },
                "원문 링크": {
                    url: article.source_url
                },
                "영어 제목": {
                    rich_text: [
                        {
                            text: {
                                content: article.original_title
                            }
                        }
                    ]
                }
            }
        }).then(()=>{
            console.log(`- Inserted: ${article.korean_title}`);
        }).catch((error)=>{
            console.error(`- Failed to insert article: ${article.korean_title}`, error.message);
        });
    });
    await Promise.all(insertPromises);
    console.log('[Node 3] Notion Data parallel insertion completed in a blink.');
}
}),
"[project]/src/cleanupNotion.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cleanup_old_notion_pages",
    ()=>cleanup_old_notion_pages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$notionhq$2f$client$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@notionhq/client/build/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/lib/main.js [app-route] (ecmascript)");
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$lib$2f$main$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"]();
const notion = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$notionhq$2f$client$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Client"]({
    auth: process.env.NOTION_API_KEY
});
async function cleanup_old_notion_pages(dbId) {
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
        const response = await notion.databases.query({
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
        for (const page of oldPages){
            await notion.pages.update({
                page_id: page.id,
                archived: true
            });
            console.log(`- Archived Page ID: ${page.id}`);
        }
        console.log('[Garbage Collection] Cleanup completed successfully.');
    } catch (error) {
        console.error('[Garbage Collection Error] Failed to cleanup notion pages:', error.message);
    }
}
}),
"[project]/src/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "runMainPipeline",
    ()=>runMainPipeline,
    "startSchedulers",
    ()=>startSchedulers
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$node$2d$cron$29$__ = __turbopack_context__.i("[externals]/node-cron [external] (node-cron, esm_import, [project]/node_modules/node-cron)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$fetchArticles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/fetchArticles.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$summarizeArticles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/summarizeArticles.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createNotionTechNews$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/createNotionTechNews.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$cleanupNotion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/cleanupNotion.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$node$2d$cron$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$node$2d$cron$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
async function runMainPipeline() {
    console.log(`\n[${new Date().toISOString()}] Executing Main Pipeline...`);
    try {
        const rawArticles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$fetchArticles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchTechArticles"])();
        if (rawArticles.length > 0) {
            const summarizedArticles = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$summarizeArticles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["summarizeArticles"])(rawArticles);
            const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](process.cwd(), 'output');
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](outputDir)) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](outputDir);
            }
            const fileName = `tech_news_${new Date().toISOString().split('T')[0]}.json`;
            const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](outputDir, fileName);
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](filePath, JSON.stringify(summarizedArticles, null, 2), 'utf8');
            console.log(`[Success] Pipeline file completed. Output saved to ${filePath}`);
            // Node 3: Notion API Insert
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$createNotionTechNews$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotionTechNews"])(summarizedArticles);
            return summarizedArticles;
        } else {
            console.log('[Notice] No articles found.');
            return [];
        }
    } catch (error) {
        console.error('[Error] Pipeline failed:', error.message);
        throw error;
    }
}
function startSchedulers() {
    console.log('Main Pipeline Scheduler started. (cron: "0 8 * * *")');
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$node$2d$cron$29$__["schedule"]('0 8 * * *', runMainPipeline);
    console.log('Garbage Collection Scheduler started. (cron: "0 2 * * *")');
    __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$cron__$5b$external$5d$__$28$node$2d$cron$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$node$2d$cron$29$__["schedule"]('0 2 * * *', ()=>{
        console.log(`\n[${new Date().toISOString()}] Executing Garbage Collection...`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$cleanupNotion$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanup_old_notion_pages"])();
    });
}
// 스크립트 직접 실행 (--run-now)
if (process.argv.includes('--run-now')) {
    console.log('Running job immediately for testing... (--run-now flag detected)');
    (async ()=>{
        try {
            await runMainPipeline();
            console.log('\n[Preview Result Completed] Check Notion or the output folder!');
            process.exit(0);
        } catch (err) {
            console.error('[Preview Error]', err.message);
            process.exit(1);
        }
    })();
} else if (/*TURBOPACK member replacement*/ __turbopack_context__.z.main === module) {
    // PM2 또는 node src/index.ts로 실행될 때만 스케줄러 등록
    startSchedulers();
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/index.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function POST() {
    try {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runMainPipeline"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            count: data.length
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0fqsq7v._.js.map