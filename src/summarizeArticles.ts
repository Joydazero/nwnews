import { GoogleGenAI } from '@google/genai';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import translate from 'google-translate-api-next';
import * as dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// JSDOM 리소스 로더 설정 삭제 (기본값 사용)

/**
 * [Step 1: Code Node Logic]
 * 본문 스크래핑 + 역피라미드 3문장 추출 + 무료 번역
 */
async function processFullArticle(item: any, category: string) {
    try {
        console.log(`  🔍 Scoping: ${item.url}`);

        // 1. 본문 전체 긁어오기 (JSDOM + Readability)
        const dom = await JSDOM.fromURL(item.url, {
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        } as any);

        // 2. 메타데이터(대표 이미지) 추출
        const ogImage = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        // 3. 본문 파싱 (Readability)
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (!article || !article.textContent) {
            throw new Error('Failed to parse article content');
        }

        // 4. 역피라미드 법칙: 본문 앞 3문장만 추출
        const cleanText = article.textContent.replace(/\s+/g, ' ').trim();
        const leadText = cleanText.split(/[.!?]\s/).slice(0, 3).join('. ') + '.';

        // 5. 0원 번역 (Google Translate)
        const [koTitle, koSummary] = await Promise.all([
            (translate as any)(article.title || item.title, { to: 'ko' }),
            (translate as any)(leadText, { to: 'ko' })
        ]);

        return {
            category,
            original_title: article.title || item.title,
            raw_ko_title: koTitle.text,
            raw_ko_summary: koSummary.text,
            source: article.siteName || item.source,
            source_url: item.url,
            thumbnail: ogImage || ''
        };
    } catch (e: any) {
        console.warn(`  ⚠️ Skip ${item.url}: ${e.message?.slice(0, 50)}`);
        // 실패 시 기본 데이터 반환 (RSS 정보 기반)
        try {
            const koTitle = await (translate as any)(item.title, { to: 'ko' });
            return {
                category,
                original_title: item.title,
                raw_ko_title: koTitle.text,
                raw_ko_summary: (await (translate as any)(item.description, { to: 'ko' })).text,
                source: item.source,
                source_url: item.url,
                thumbnail: ''
            };
        } catch {
            return null;
        }
    }
}

/**
 * [Step 2: Agent Node Logic]
 * Gemini는 한국어 문맥 교정만 담당 (토큰 극소화)
 */
async function correctKorean(chunk: any[], category: string) {
    const prompt = `
**[Role]**
너는 글로벌 뉴스 전문 '최종 데스크장'이야. 1차 번역된 한국어 기사를 읽고, 문맥을 매끄럽게 교정하여 신뢰감 있는 뉴스 카드를 완성해.

**[Task]**
1. \`raw_ko_title\`의 번역투(~이다, ~함)를 자연스러운 한국어 헤드라인으로 교정하여 \`korean_title\`에 넣어줘.
2. \`raw_ko_summary\`의 3문장이 논리적으로 연결되도록 문맥을 다듬어 \`summary\`에 넣어줘. (내용 왜곡 금지)
3. 입력된 \`category\`, \`source\`, \`source_url\`, \`thumbnail\` 필드는 그대로 유지해.
4. (IT 전용) \`tech_keywords\`를 3개 추출해 추가해줘.

**[Constraint]**
- 제미나이 너는 '번역'을 하는 게 아니라 '교정'만 하는 거야.
- 무조건 순수한 JSON 배열만 출력해. (코드블록 마크다운 제외, 인사말 금지)

**[Input]**
${JSON.stringify(chunk, null, 2)}
`;

    try {
        const response = await (ai as any).models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        let text = response.text || '[]';
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            text = text.substring(jsonStart, jsonEnd + 1);
        }
        return JSON.parse(text);
    } catch (err: any) {
        console.error('  ❌ Gemini Correction Failed:', err.message);
        // 실패 시 raw 데이터를 그대로 formatting해서 반환
        return chunk.map(c => ({
            ...c,
            korean_title: c.raw_ko_title,
            summary: c.raw_ko_summary,
            tech_keywords: []
        }));
    }
}

/**
 * 메인 파이프라인 엔진
 */
export async function summarizeArticles(articles: any[], category: string = 'it') {
    console.log(`\n[Hybrid] ⚡ ${category.toUpperCase()} 하이브리드 가공 시작...`);

    // 1. 병렬 본문 스크래핑 & 무료 번역 (10개씩 제한)
    const resultArticles: any[] = [];
    const limit = 10; // 너무 많이 긁으면 차단될 수 있으므로 10개만 정밀 가공
    const targetArticles = articles.slice(0, limit);

    for (let i = 0; i < targetArticles.length; i++) {
        const processed = await processFullArticle(targetArticles[i], category);
        if (processed) resultArticles.push(processed);
    }

    // 2. Gemini 문장 교정 (전체 청크로 한 번에)
    if (resultArticles.length > 0) {
        console.log(`[Hybrid] 🤖 Gemini가 ${resultArticles.length}개 기사를 세련되게 다듬는 중...`);
        const finalPolished = await correctKorean(resultArticles, category);
        
        console.log(`[Hybrid] ✅ ${category.toUpperCase()} 완료 — 총 ${finalPolished.length}개 정밀 가공 성공`);
        return finalPolished;
    }

    return [];
}
