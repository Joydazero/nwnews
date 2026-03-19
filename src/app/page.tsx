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
        fetch('/api/data')
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
            const response = await fetch('/api/generate', { method: 'POST' });
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

    if (fetching) return <div className="max-w-4xl mx-auto text-center mt-[15vh] text-text-main text-lg">로딩 중...</div>;

    return (
        <main className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
            <header className="text-center mb-16 animate-fade-in">
                <h1 className="text-[3rem] font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                    NW News Dispatch
                </h1>
                <p className="text-lg text-text-muted font-light mb-1.5">실리콘밸리의 최신 웹 개발 트렌드 큐레이션</p>
                <p className="text-[0.9rem] text-text-muted opacity-70 mb-6">
                    {data ? `Last updated: ${data.dateStr}` : '저장된 데이터 베이스가 없습니다.'}
                </p>

                <ThemeToggle />

                {!loading && (
                    <div className="flex gap-4 justify-center mt-8 flex-wrap">
                        <button
                            onClick={handleGenerate}
                            className="px-8 py-3.5 text-[1.05rem] font-bold text-white bg-accent rounded-xl shadow-[0_4px_20px_var(--accent-glow)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_var(--accent-glow)] outline-none"
                        >
                            오늘자 최신 트렌드 20선 자동 수집 ✨
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

            {!loading && data ? (
                <div className="flex flex-col gap-6">
                    {data.articles.map((article, idx) => (
                        <ArticleCard key={idx} article={article} index={idx} />
                    ))}
                </div>
            ) : (
                !loading && (
                    <div className="text-center p-16 bg-card-bg rounded-2xl border border-dashed border-card-border text-text-muted animate-fade-in shadow-sm">
                        <p className="text-lg">버튼을 통과시켜 AI 자동화 번역-적재 파이프라인을 가동하세요!</p>
                    </div>
                )
            )}
        </main>
    );
}
