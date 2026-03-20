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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/data/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
async function GET(request) {
    try {
        // #region agent log
        fetch('http://127.0.0.1:7937/ingest/db7347b1-8844-4ae1-a267-d775b365e441', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': 'b562ca'
            },
            body: JSON.stringify({
                sessionId: 'b562ca',
                runId: 'pre-debug',
                hypothesisId: 'H1_api_file_exists_check',
                location: 'src/app/api/data/route.ts:GET:start',
                message: '/api/data GET start',
                data: {
                    url: request.url,
                    category: new URL(request.url).searchParams.get('category') || 'it',
                    cwd: process.cwd()
                },
                timestamp: Date.now()
            })
        }).catch(()=>{});
        // #endregion
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || 'it'; // 기본값 'it'
        const fileName = `${category}.json`;
        const filePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data', fileName);
        // #region agent log
        fetch('http://127.0.0.1:7937/ingest/db7347b1-8844-4ae1-a267-d775b365e441', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': 'b562ca'
            },
            body: JSON.stringify({
                sessionId: 'b562ca',
                runId: 'pre-debug',
                hypothesisId: 'H1_api_file_exists_check',
                location: 'src/app/api/data/route.ts:GET:filePath',
                message: 'checking data file',
                data: {
                    category,
                    fileName,
                    filePath,
                    fileExists: __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(filePath)
                },
                timestamp: Date.now()
            })
        }).catch(()=>{});
        // #endregion
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(filePath)) {
            // 파일이 없는 경우 빈 데이터 반환
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: {
                    category,
                    dateStr: '없음',
                    articles: []
                }
            });
        }
        const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(filePath, 'utf-8');
        const fileData = JSON.parse(content);
        // #region agent log
        fetch('http://127.0.0.1:7937/ingest/db7347b1-8844-4ae1-a267-d775b365e441', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': 'b562ca'
            },
            body: JSON.stringify({
                sessionId: 'b562ca',
                runId: 'pre-debug',
                hypothesisId: 'H1_api_file_exists_check',
                location: 'src/app/api/data/route.ts:GET:afterParse',
                message: 'parsed data file',
                data: {
                    filePath,
                    articlesLen: fileData?.articles?.length,
                    firstSummaryType: typeof fileData?.articles?.[0]?.summary,
                    dateStr: fileData?.dateStr
                },
                timestamp: Date.now()
            })
        }).catch(()=>{});
        // #endregion
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: fileData
        });
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7937/ingest/db7347b1-8844-4ae1-a267-d775b365e441', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Debug-Session-Id': 'b562ca'
            },
            body: JSON.stringify({
                sessionId: 'b562ca',
                runId: 'pre-debug',
                hypothesisId: 'H1_api_file_exists_check',
                location: 'src/app/api/data/route.ts:GET:catch',
                message: 'error while reading/parsing',
                data: {
                    errorMessage: error instanceof Error ? error.message : String(error)
                },
                timestamp: Date.now()
            })
        }).catch(()=>{});
        // #endregion
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0kw~b8m._.js.map