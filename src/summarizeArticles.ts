import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 프롬프트 템플릿 팩토리
const getPrompt = (category: 'it' | 'us' | 'jp' | 'de', chunkArticles: any[]) => {
    const articlesJson = JSON.stringify(chunkArticles.map(a => ({ title: a.title, description: a.description, url: a.url })), null, 2);

    const basePrompt = `
**[Core Goal]**
전달되는 외신 기사를 한국 독자들이 명확하게 이해할 수 있도록 초정밀 요약 및 번역을 수행해.
모든 결과는 반드시 팩트에 기반해야 하며, 모델 스스로 지어낸 정보(Hallucination)를 절대 추가하지 마.
사용자가 이탈하지 않도록 신뢰성 있고 전문적인 어조를 유지해.

**[AI Highlight Rule]**
기사의 내용이 인공지능(AI), 머신러닝, LLM, OpenAI, ChatGPT, Claude, Gemini, NVIDIA 등 AI 산업과 관련된 경우 "is_ai": true 로 표시해. 그 외에는 false야.
`;

    if (category === 'us') {
        return `
${basePrompt}
**[Role]** 수석 글로벌 에디터 (미국 특파원)
**[Task]** 미국 주요 매체 기사를 분석하여 한국 상황에 맞는 의역(Transcreation)과 요약을 수행해.

**[Output Format]**
[
  {
    "category": "us",
    "is_ai": boolean,
    "original_title": "원본 영어 제목",
    "korean_title": "신뢰성 있는 한국어 제목",
    "summary": "1. 핵심 요약\\n2. 핵심 요약\\n3. 핵심 요약",
    "source": "언론사",
    "source_url": "링크"
  }
]

JSON 데이터:
${articlesJson}
`;
    }

    if (category === 'jp') {
        return `
${basePrompt}
**[Role]** 수석 글로벌 에디터 (일본 특파원)
**[Task]** 일본어 기사(또는 영어 매체 보도)를 분석하여 한자어 오역 없이 매끄러운 한국어 능동태 문장으로 요약해.

**[Output Format]**
[
  {
    "category": "jp",
    "is_ai": boolean,
    "original_title": "원본 제목",
    "korean_title": "정확한 핵심 한국어 제목",
    "summary": "1. 요약\\n2. 요약\\n3. 요약",
    "source": "언론사",
    "source_url": "링크"
  }
]

JSON 데이터:
${articlesJson}
`;
    }

    if (category === 'de') {
        return `
${basePrompt}
**[Role]** 수석 글로벌 에디터 (유럽/독일 특파원)
**[Task]** 독일/유럽 정치 경제 이슈를 명료한 한국어 능동태로 요약해.

**[Output Format]**
[
  {
    "category": "de",
    "is_ai": boolean,
    "original_title": "원본 제목",
    "korean_title": "핵심을 관통하는 한국어 제목",
    "summary": "1. 요약\\n2. 요약\\n3. 요약",
    "source": "언론사",
    "source_url": "링크"
  }
]

JSON 데이터:
${articlesJson}
`;
    }

    // Default: IT
    return `
${basePrompt}
**[Role]** 실리콘밸리 수석 테크 에디터
**[Task]** 최신 기술 트렌드를 분석하고, 프론트엔드/백엔드 생태계 전문 용어를 사용하여 기술적으로 완성도 높은 요약을 수행해.

**[Output Format]**
[
  {
    "category": "it",
    "is_ai": boolean,
    "original_title": "원본 영어 제목",
    "korean_title": "테크니컬하고 매력적인 제목",
    "summary": "1. 기술적 요약\\n2. 기술적 요약",
    "tech_keywords": ["React", "AI", "Cloud"],
    "source": "IT 매체",
    "source_url": "링크"
  }
]

JSON 데이터:
${articlesJson}
`;
};

export async function summarizeArticles(articles: any[], category: 'it' | 'us' | 'jp' | 'de' = 'it') {
    console.log(`[Node 2] Summarizing ${category.toUpperCase()} articles (High Accuracy Volume Boost)...`);

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
                console.log(`  - Processing ${category} chunk ${i + 1}/${chunks.length} (Attempt ${attempt})...`);
                const response = await (ai as any).models.generateContent({
                    model: 'gemini-2.0-flash-lite',
                    contents: getPrompt(category, chunks[i]),
                });
                
                let text = response.text || '[]';
                text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                const jsonStart = text.indexOf('[');
                const jsonEnd = text.lastIndexOf(']');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    text = text.substring(jsonStart, jsonEnd + 1);
                }
                const parsed = JSON.parse(text);
                finalResults.push(...parsed);
                success = true;
                break;
            } catch (error: any) {
                console.error(`❌ ${category} Chunk ${i + 1} attempt ${attempt} failed:`, error.message);
                if (attempt < retries) {
                    const waitTime = attempt * 3000;
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return finalResults;
}
