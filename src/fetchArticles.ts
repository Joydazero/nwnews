import Parser from 'rss-parser';

export async function fetchTechArticles() {
    const allArticles: any[] = [];
    console.log('[Node 1] 🌐 다중 매체(Dev.to, HackerNews, RSS)에서 기사를 혼합하여 가져옵니다...');

    // 1. Dev.to (webdev 트렌드) 8개
    try {
        const devUrl = 'https://dev.to/api/articles?tag=webdev&per_page=8';
        const devRes = await fetch(devUrl);
        if (devRes.ok) {
            const devJSON = await devRes.json();
            devJSON.forEach((item: any) => {
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

            const itemPromises = top8Ids.map(async id => {
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
        const parser = new Parser();
        const feed = await parser.parseURL('https://www.smashingmagazine.com/feed/');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 4);
            topFeeds.forEach(latestFeed => {
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
