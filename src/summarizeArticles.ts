import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 프롬프트 템플릿
const promptTemplate = (chunkArticles: any[]) => `
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
${JSON.stringify(chunkArticles.map(a => ({ title: a.title, description: a.description, url: a.url })), null, 2)}
`;

export async function summarizeArticles(articles: any[]) {
    console.log('[Node 2] Summarizing articles using Google Gemini API in parallel chunks...');

    // 대기 시간을 획기적으로 줄이기 위한 청크(Chunk) 기반 병렬 처리
    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < articles.length; i += chunkSize) {
        chunks.push(articles.slice(i, i + chunkSize));
    }

    const aiPromises = chunks.map(async (chunk, index) => {
        try {
            console.log(`- Generating chunk ${index + 1}...`);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptTemplate(chunk),
            });

            let text = response.text || '[]';
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (error: any) {
            console.error(`Chunk ${index + 1} processing failed:`, error.message);
            return [];
        }
    });

    const results = await Promise.all(aiPromises);
    const finalArticles = results.flat();

    console.log(`[Node 2] Successfully summarized ${finalArticles.length} articles in parallel.`);
    return finalArticles;
}
