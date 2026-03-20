import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 프롬프트 템플릿 팩토리
const getPrompt = (category: 'it' | 'us' | 'jp', chunkArticles: any[]) => {
    const articlesJson = JSON.stringify(chunkArticles.map(a => ({ title: a.title, description: a.description, url: a.url })), null, 2);

    if (category === 'us') {
        return `
**[Role]**
너는 미국의 정치, 경제, 사회 전반의 핵심 이슈를 한국 독자들에게 전달하는 수석 글로벌 에디터야.

**[Task]**
영문 기사 JSON 데이터를 분석하고, 한국인들이 맥락을 쉽게 이해할 수 있도록 자연스러운 한국어로 번역 및 요약해.

**[Constraints]**
1. 직역을 피하고, 미국의 정치/경제 용어는 한국의 상황에 맞게 매끄럽게 의역(Transcreation)해.
2. 각 기사당 3줄 이하의 핵심 요약(Bullet points)을 반드시 작성해.
3. 모델 스스로 지어낸 정보(Hallucination)를 절대 추가하지 마.
4. 인사말, 부연 설명, 마크다운 기호(json)를 절대 포함하지 마. 오직 순수한 JSON 객체 텍스트만 출력해야 해.

**[Output Format]**
[
  {
    "category": "us",
    "original_title": "원본 영어 제목",
    "korean_title": "클릭을 유도하는 매력적인 한국어 제목",
    "summary": "1. 요약 첫 번째\\n2. 요약 두 번째\\n3. 요약 세 번째",
    "source": "언론사 이름 (예: Fox News)",
    "source_url": "원본 링크"
  }
]

JSON 데이터:
${articlesJson}
`;
    }

    if (category === 'jp') {
        return `
**[Role]**
너는 일본의 정치, 경제, 사회 트렌드를 한국 독자들에게 가장 빠르고 정확하게 전달하는 수석 글로벌 에디터야.

**[Task]**
일본어 기사 JSON 데이터를 분석하고, 한국인들이 뉘앙스를 정확히 이해할 수 있도록 자연스러운 한국어로 번역 및 요약해.

**[Constraints]**
1. 일본 특유의 수동태 표현이나 번역투를 완벽한 한국어 능동태 문장으로 교정해.
2. 각 기사당 3줄 이하의 핵심 요약(Bullet points)을 반드시 작성해.
3. 한자어나 고유명사는 한국 독자가 이해하기 쉬운 표현으로 풀어서 설명해.
4. 인사말, 부연 설명, 마크다운 기호(json)를 절대 포함하지 마. 오직 순수한 JSON 객체 텍스트만 출력해.

**[Output Format]**
[
  {
    "category": "jp",
    "original_title": "원본 일본어 제목",
    "korean_title": "직관적이고 매력적인 한국어 제목",
    "summary": "1. 요약 첫 번째\\n2. 요약 두 번째\\n3. 요약 세 번째",
    "source": "언론사 이름 (예: Yomiuri)",
    "source_url": "원본 링크"
  }
]

JSON 데이터:
${articlesJson}
`;
    }

    // Default: IT
    return `
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
    "category": "it",
    "original_title": "원본 영어 제목",
    "korean_title": "클릭을 유도하는 한국어 제목",
    "summary": "1. 요약 첫 번째\\n2. 요약 두 번째",
    "tech_keywords": ["React", "메모리 누수 최적화", "V8 Engine"],
    "source": "IT 매체",
    "source_url": "원본 링크"
  }
]

JSON 데이터:
${articlesJson}
`;
};

export async function summarizeArticles(articles: any[], category: 'it' | 'us' | 'jp' = 'it') {
    console.log(`[Node 2] Summarizing ${category.toUpperCase()} articles using Google Gemini API...`);

    const chunkSize = 5;
    const chunks = [];
    for (let i = 0; i < articles.length; i += chunkSize) {
        chunks.push(articles.slice(i, i + chunkSize));
    }

    const finalResults: any[] = [];
    for (let i = 0; i < chunks.length; i++) {
        let success = false;
        let retries = 3;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`- Generating ${category} chunk ${i + 1}/${chunks.length} (Attempt ${attempt})...`);
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: getPrompt(category, chunks[i]),
                });
                
                let text = response.text || '[]';
                text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                const jsonStart = text.indexOf('[');
                const jsonEnd = text.lastIndexOf(']');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    text = text.substring(jsonStart, jsonEnd + 1);
                }
                finalResults.push(...JSON.parse(text));
                success = true;
                break;
            } catch (error: any) {
                console.error(`❌ ${category} Chunk ${i + 1} attempt ${attempt} failed:`, error.message);
                if (error.message.includes('429') || error.message.includes('RetryInfo') || error.message.includes('rate limit')) {
                    const waitTime = attempt * 10000; // 10s, 20s
                    console.log(`⏳ Rate limit detected. Waiting ${waitTime/1000}s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else {
                    console.error('Non-rate-limit error, skipping attempt.');
                    break; 
                }
            }
        }

        if (!success) {
            console.error(`🔥 Failed to process ${category} chunk ${i + 1} after ${retries} attempts.`);
        }

        // 청크 사이 기본 대기 시간 (레이트 리밋 방지)
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    console.log(`[Node 2] Successfully summarized ${finalResults.length} ${category} articles.`);
    return finalResults;
}
