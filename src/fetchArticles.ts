import Parser from 'rss-parser';

export async function fetchTechArticles() {
    const allArticles: any[] = [];
    console.log('[Node 1] 🌐 다중 매체(Dev.to, HackerNews, RSS)에서 기사를 확장 수집합니다 (목표: 25+)...');

    // 1. Dev.to (webdev 트렌드) 15개
    try {
        const devUrl = 'https://dev.to/api/articles?tag=webdev&per_page=15';
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
            console.log('✅ Dev.to 에서 15개 뉴스 수집 완료');
        }
    } catch (error) {
        console.error('❌ Dev.to 데이터 수집 실패하였습니다.');
    }

    // 2. Hacker News (Firebase 실시간 API) 핫이슈 15개
    try {
        const hnIdsUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
        const hnIdsRes = await fetch(hnIdsUrl);
        if (hnIdsRes.ok) {
            const hnIds = await hnIdsRes.json();
            const top15Ids = hnIds.slice(0, 15);

            const itemPromises = top15Ids.map(async (id: number) => {
                const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                const item = await itemRes.json();
                return {
                    source: 'HackerNews',
                    title: item.title,
                    description: `글로벌 테크 커뮤니티의 뜨거운 감자.`,
                    url: item.url || `https://news.ycombinator.com/item?id=${item.id}`
                };
            });

            const hnArticles = await Promise.all(itemPromises);
            allArticles.push(...hnArticles);

            console.log('✅ Hacker News 에서 상위 15개 토픽 수집 완료');
        }
    } catch (error) {
        console.error('❌ Hacker News 수집 실패하였습니다.');
    }

    // 3. 글로벌 매체 고정 RSS 피드 (Smashing Magazine) 10개
    try {
        const parser = new Parser();
        const feed = await parser.parseURL('https://www.smashingmagazine.com/feed/');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 10);
            topFeeds.forEach((latestFeed: any) => {
                allArticles.push({
                    source: 'Smashing Magazine',
                    title: latestFeed.title,
                    description: latestFeed.contentSnippet || latestFeed.content || '본문 내용 생략',
                    url: latestFeed.link
                });
            });
            console.log('✅ Smashing Magazine RSS 에서 10개 뉴스 수집 완료');
        }
    } catch (error) {
        console.error('❌ RSS Feed 파싱 실패하였습니다.');
    }

    console.log(`[Node 1] ✨ 총 ${allArticles.length}개의 통합 글로벌 기사 큐레이팅 성공!`);
    return allArticles;
}

/**
 * 🇺🇸 미국 뉴스 수집 (Fox News / AP News)
 */
export async function fetchUSNews() {
    const allArticles: any[] = [];
    console.log('[Node 1-US] 🌐 미국 주요 매체에서 기사를 확장 수집합니다 (목표: 12+)...');

    // 1. Fox News (Latest) 6개
    try {
        const parser = new Parser();
        const feed = await parser.parseURL('http://feeds.foxnews.com/foxnews/latest');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 7);
            topFeeds.forEach((item: any) => {
                allArticles.push({
                    source: 'Fox News',
                    title: item.title,
                    description: item.contentSnippet || item.content || '본문 내용 생략',
                    url: item.link
                });
            });
        }
    } catch (error) {
        console.error('❌ Fox News 수집 실패:', error);
    }

    // 2. AP News (via Yahoo RSS) 6개
    try {
        const parser = new Parser();
        const feed = await parser.parseURL('https://news.yahoo.com/rss/ap');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 7);
            topFeeds.forEach((item: any) => {
                allArticles.push({
                    source: 'AP News',
                    title: item.title,
                    description: item.contentSnippet || item.content || '본문 내용 생략',
                    url: item.link
                });
            });
        }
    } catch (error) {
        console.error('❌ AP News 수집 실패:', error);
    }

    return allArticles;
}

/**
 * 🇯🇵 일본 뉴스 수집 (요미우리 신문 / Google News JP)
 */
export async function fetchJPNews() {
    const allArticles: any[] = [];
    console.log('[Node 1-JP] 🌐 일본 주요 매체에서 기사를 확장 수집합니다...');

    // 1. 요미우리 신문 (주요 뉴스) 8개
    try {
        const parser = new Parser();
        const feed = await parser.parseURL('https://www.yomiuri.co.jp/rss/news/main.xml');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 8);
            topFeeds.forEach((item: any) => {
                allArticles.push({
                    source: 'Yomiuri',
                    title: item.title,
                    description: item.contentSnippet || item.content || '본문 내용 생략',
                    url: item.link
                });
            });
        }
    } catch (error) {
        console.error('❌ 요미우리 신문 수집 실패:', error);
    }

    // 2. Google News JP (General) 8개
    try {
        const parser = new Parser();
        const feed = await parser.parseURL('https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 8);
            topFeeds.forEach((item: any) => {
                allArticles.push({
                    source: 'Google News (JP)',
                    title: item.title,
                    description: item.contentSnippet || item.content || '본문 내용 생략',
                    url: item.link
                });
            });
        }
    } catch (error) {
        console.error('❌ Google News JP 수집 실패:', error);
    }

    return allArticles;
}

/**
 * 🇩🇪 독일 뉴스 수집 (WELT)
 */
export async function fetchDENews() {
    const allArticles: any[] = [];
    console.log('[Node 1-DE] 🌐 독일 주요 매체(WELT)에서 기사를 확장 수집합니다...');

    try {
        const parser = new Parser();
        const feed = await parser.parseURL('https://www.welt.de/feeds/topnews.rss');
        if (feed.items && feed.items.length > 0) {
            const topFeeds = feed.items.slice(0, 15);
            topFeeds.forEach((item: any) => {
                allArticles.push({
                    source: 'WELT',
                    title: item.title,
                    description: item.contentSnippet || item.content || '본문 내용 생략',
                    url: item.link
                });
            });
        }
    } catch (error) {
        console.error('❌ WELT 수집 실패:', error);
    }

    return allArticles;
}
