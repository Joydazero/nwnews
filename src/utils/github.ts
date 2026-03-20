import { Octokit } from "@octokit/rest";

// Vercel 환경 변수에서 토큰을 불러와 인증
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/**
 * AI가 생성한 JSON 데이터를 GitHub 레포지토리에 직접 커밋하는 함수
 */
export async function pushDataToGitHub(newData: any, customPath: string = "data/news.json") {
    const owner = "Joydazero"; 
    const repo = "nwnews";             
    const path = customPath; // 프론트엔드가 읽어갈 데이터 파일 경로

    console.log("🌐 [DataOps] GitHub API 통신을 시작합니다...");

    try {
        // 1. 기존 파일의 SHA(고유 해시) 가져오기 (덮어쓰기를 위해 필수)
        let fileSha = "";
        try {
            const { data } = await octokit.repos.getContent({ owner, repo, path });
            if (!Array.isArray(data) && data.type === "file") {
                fileSha = data.sha;
            }
        } catch (err: any) {
            if (err.status !== 404) throw err;
            console.log("파일이 존재하지 않아 새로 생성합니다.");
        }

        // 2. 데이터를 Base64로 인코딩 (GitHub API 필수 규격)
        // JSON.stringify(newData, null, 2)로 예쁘게 정렬해서 저장
        const content = Buffer.from(JSON.stringify(newData, null, 2), "utf8").toString("base64");
        const dateStr = new Date().toISOString().split("T")[0];

        // 3. 파일 업데이트 (이 행동이 자동으로 Commit과 Push를 발생시킴)
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: `🤖 chore: AI 에이전트 자동 뉴스 업데이트 (${dateStr})`, // 커밋 메시지
            content,
            sha: fileSha || undefined,
            committer: {
                name: "AI Agent",
                email: "agent@nwnews.local",
            },
        });

        console.log("🚀 [DataOps] GitHub에 성공적으로 커밋 완료! Vercel이 곧 리빌드를 시작합니다.");
    } catch (error) {
        console.error("❌ [DataOps] GitHub 커밋 실패:", error);
    }
}