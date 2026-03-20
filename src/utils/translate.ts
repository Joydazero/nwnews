import translate from 'google-translate-api-next';

/**
 * 무료 Google Translate로 텍스트를 한국어로 1차 번역
 * 실패 시 원본 텍스트를 그대로 반환 (안전망)
 */
export async function translateToKorean(text: string): Promise<string> {
    if (!text || !text.trim()) return text;

    try {
        const result = await (translate as any)(text, { to: 'ko' });
        return result?.text || text;
    } catch {
        return text;
    }
}

/**
 * 기사 배열을 한국어로 1차 번역
 * title → raw_ko_title, description → raw_ko_snippet
 */
export async function preTranslateArticles(articles: any[]): Promise<any[]> {
    console.log(`[Translate] 🌐 ${articles.length}개 기사 무료 Google Translate 1차 번역 중...`);

    const results: any[] = [];
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        try {
            const [koTitle, koSnippet] = await Promise.all([
                translateToKorean(article.title || ''),
                translateToKorean(article.description || article.title || ''),
            ]);
            results.push({
                ...article,
                raw_ko_title: koTitle,
                raw_ko_snippet: koSnippet,
            });
        } catch {
            results.push({
                ...article,
                raw_ko_title: article.title || '',
                raw_ko_snippet: article.description || '',
            });
        }

        // 구글 번역 과부하 방지 (100ms 간격)
        if (i < articles.length - 1) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    console.log(`[Translate] ✅ 1차 번역 완료 (${results.length}개)`);
    return results;
}
