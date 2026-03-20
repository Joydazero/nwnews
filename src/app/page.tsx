'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from '../components/ProgressBar';
import ArticleCard, { Article } from '../components/ArticleCard';
import ThemeToggle from '../components/ThemeToggle';

export default function HomePage() {
    const [data, setData] = useState<{ dateStr: string; articles: Article[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setFetching(true);
        fetch(`/api/data?category=it`)
            .then(res => res.json())
            .then(result => {
                if (result.success && result.data) {
                    setData(result.data);
                }
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ category: 'it' }),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (result.success) {
                window.location.reload();
            } else {
                alert('뉴스 분석 중 오류 발생: ' + result.error);
                setLoading(false);
            }
        } catch (err) {
            alert('서버 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
            <header className="text-center mb-12 animate-fade-in">
                <h1 className="text-[3rem] font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    NWNEWS
                </h1>

                {/* More Information Section */}
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="flex justify-center gap-3 text-sm text-text-muted mb-1 opacity-80">
                        <span>more information</span>
                        <Link href="/global" className="hover:scale-125 transition-transform">🇺🇸</Link>
                        <Link href="/global" className="hover:scale-125 transition-transform">🇯🇵</Link>
                        <Link href="/global" className="hover:scale-125 transition-transform">🇩🇪</Link>
                    </div>
                    <Link
                        href="/global"
                        className="text-xs text-accent hover:underline opacity-80"
                    >
                        세계 뉴스 보러가기 &rarr;
                    </Link>
                </div>

                <p className="text-lg text-text-main font-semibold mb-1.5 px-4">
                    실리콘밸리의 최신 웹 개발 트렌드 큐레이션
                </p>
                <p className="text-[0.9rem] text-text-muted opacity-70 mb-6">
                    {data ? `Last updated: ${data.dateStr}` : '데이터를 불러오는 중...'}
                </p>

                <ThemeToggle />

                {!loading && (
                    <div className="flex gap-4 justify-center mt-8 flex-wrap">
                        <button
                            onClick={handleGenerate}
                            className="px-8 py-3.5 text-[1.05rem] font-bold text-white bg-accent rounded-xl shadow-[0_4px_20px_var(--accent-glow)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--accent-glow)] outline-none"
                        >
                            IT 최신 소식 자동 수집 ✨
                        </button>

                        <Link
                            href="/manage"
                            className="px-8 py-3.5 text-[1.05rem] font-bold text-text-main bg-card-bg border border-card-border rounded-xl transition-all hover:bg-white/10 hover:border-text-muted flex items-center justify-center outline-none"
                        >
                            ⚙️ 관리 콘솔
                        </Link>
                    </div>
                )}

                <ProgressBar isActive={loading} />
            </header>

            <div className="relative mb-10">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-card-border to-transparent w-full"></div>
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 px-4 bg-bg text-text-muted text-sm font-bold tracking-widest uppercase">
                    Tech Articles
                </span>
            </div>

            {fetching ? (
                <div className="text-center py-20 text-text-muted animate-pulse text-lg">
                    IT 트렌드를 가져오는 중입니다...
                </div>
            ) : data && data.articles.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {data.articles.map((article, idx) => (
                        <ArticleCard key={idx} article={article} index={idx} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-16 bg-card-bg rounded-2xl border border-dashed border-card-border text-text-muted animate-fade-in shadow-sm">
                    <p className="text-lg">수집된 IT 기사가 없습니다. 수집 버튼을 눌러주세요!</p>
                </div>
            )}
        </main>
    );
}
