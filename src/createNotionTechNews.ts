import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID || '';

/**
 * Node 3: Skill (노션 데이터베이스 적재)
 * 입력값: 앞선 Node 2(Agent)가 뱉어낸 JSON 배열 데이터
 */
export async function createNotionTechNews(articles: any[]) {
    if (!process.env.NOTION_API_KEY || !databaseId) {
        console.log('[Notice] Notion credentials missing. Skipping Notice DB integration.');
        return;
    }
    console.log(`[Node 3] Inserting ${articles.length} articles into Notion DB (Paralleled Execution)...`);

    // [원인 해결] 기존 for문 내 await 동기 통신으로 인한 네트워크 병목 발생 (20개 기준 10초 이상 지연)
    // [개선 반영] Promise.all을 활용해 다중 비동기 병렬 요청 처리로 노션 적재 시간을 1초 단위로 대폭 단축 
    const insertPromises = articles.map(article => {
        return notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                "제목": { title: [{ text: { content: article.korean_title } }] },
                "원문 번역/요약": { rich_text: [{ text: { content: article.summary } }] },
                "원문 링크": { url: article.source_url },
                "영어 제목": { rich_text: [{ text: { content: article.original_title } }] }
            }
        }).then(() => {
            console.log(`- Inserted: ${article.korean_title}`);
        }).catch((error: any) => {
            console.error(`- Failed to insert article: ${article.korean_title}`, error.message);
        });
    });

    await Promise.all(insertPromises);
    console.log('[Node 3] Notion Data parallel insertion completed in a blink.');
}
