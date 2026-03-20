import Parser from '@postlight/parser';
import nlp from 'compromise';
import translate from 'google-translate-api-next';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 🔥 [DataOps] Vercel 최적화 0원 무한 엔진 (Pure Code Node)
 * @postlight/parser + compromise NLP + google-translate-api-next
 */
export async function summarizeArticles(articles: any[], category: string = 'IT') {
    const results: any[] = [];
    const limit = 10; // 정밀 가공 대상 기사 수 (Vercel 타임아웃 방지용)

    console.log(`\n🚀 [DataOps] ${category.toUpperCase()} 최적화 0원 무한 엔진 점화...`);

    // 병렬로 처리하여 속도 향상
    const targetArticles = articles.slice(0, limit);
    for (const item of targetArticles) {
        try {
            console.log(`  🔍 Parsing: ${item.url || item.link}`);

            // 1. [본문 탈취] Parser.parse (광고/껍데기 제거)
            const parsed = await Parser.parse(item.url || item.link);
            if (!parsed || !parsed.content || !parsed.textContent) {
                console.warn(`  - Skip: No content found for ${item.url || item.link}`);
                continue;
            }

            // 2. [NLP 핵심 추출] nlp (가장 중요한 첫 3문장 기반 요약)
            const doc = nlp(parsed.textContent);
            const rawSentences = doc.sentences().out('array');
            const summaryText = rawSentences.slice(0, 3).join(' ');

            // 3. [지능형 키워드] Topics 추출 (사람, 장소, 기업 등)
            // compromise의 topics feature를 사용하거나 nouns().filter(...) 방식으로 태그 3개 추출
            const rawTags = (doc as any).topics().out('array').slice(0, 3);
            if (rawTags.length === 0) {
                // 토픽이 없을 경우 빈도 높은 명사로 대체
                const nouns = doc.nouns().out('frequency').slice(0, 3).map((n: any) => n.normal);
                rawTags.push(...nouns);
            }

            // 4. [비용 0원 번역] (Google Translate)
            const [koTitle, koSummary] = await Promise.all([
                (translate as any)(parsed.title || item.title, { to: 'ko' }),
                (translate as any)(summaryText || parsed.excerpt || '', { to: 'ko' })
            ]);

            // 태그 배열 번역 (비동기)
            const koTags = await Promise.all(
                rawTags.map(async (tag: string) => {
                    try {
                        const res = await (translate as any)(tag, { to: 'ko' });
                        return res.text;
                    } catch {
                        return tag;
                    }
                })
            );

            // 5. [React/TS 최적화 데이터 조립]
            results.push({
                category: category.toUpperCase(),
                is_ai: /ai|gpt|llm|인공지능|openai|nvidia/i.test((parsed.title || '') + (parsed.textContent || '')),
                original_title: parsed.title || item.title,
                korean_title: koTitle.text,
                summary: koSummary.text || (parsed.excerpt ? (await (translate as any)(parsed.excerpt, { to: 'ko' })).text : ''),
                tech_keywords: koTags, // UI 필드명 tech_keywords에 tags 매핑
                source: parsed.domain || item.source || 'GLOBAL NEWS',
                source_url: item.url || item.link,
                thumbnail: parsed.lead_image_url || '', // 고화질 이미지
                author: parsed.author || 'Editor'
            });

            // Vercel 람다 보호를 위한 짧은 대기 (Rate Limit 방지)
            await new Promise(r => setTimeout(r, 200));

        } catch (e: any) {
            console.error(`❌ 파싱 에러 (${item.link || item.url}):`, e.message?.slice(0, 60));
        }
    }

    console.log(`✅ [DataOps] ${results.length}개의 완벽한 리포트 가공 완료! (비용 0원)`);
    return results;
}
