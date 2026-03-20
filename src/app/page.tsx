'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleCard from '../components/ArticleCard';
import ProgressBar from '../components/ProgressBar';
import ThemeToggle from '../components/ThemeToggle';
import ArticleSkeleton from '../components/ArticleSkeleton';

interface Article {
    original_title: string;
    korean_title: string;
    summary: string;
    source_url: string;
    tech_keywords?: string[];
    is_ai?: boolean;
}

export default function HomePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setFetching(true);
        fetch('/api/data?category=it')
            .then(res => res.json())
            .then(result => {
                if (result.success && result.data) {
                    setArticles(result.data.articles);
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
        <main className="max-w-[1200px] mx-auto py-16 px-6 sm:px-10">
            <header className="text-center mb-16 animate-fade-in relative">
                <h1 className="text-[3.5rem] font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    NWNEWS
                </h1>

                <div className="flex flex-col items-center gap-2 mb-10">
                    <div className="flex justify-center gap-4 text-sm text-text-muted mb-1 opacity-80">
                        <span>expand coverage</span>
                        <Link href="/global" className="hover:scale-125 transition-transform">🇺🇸</Link>
                        <Link href="/global" className="hover:scale-125 transition-transform">🇯🇵</Link>
                        <Link href="/global" className="hover:scale-125 transition-transform">🇩🇪</Link>
                    </div>
                    <Link href="/global" className="text-xs text-accent hover:underline opacity-80">
                        세계 뉴스 보러가기 &rarr;
                    </Link>
                </div>

                <ThemeToggle />

                {!loading && (
                    <button
                        onClick={handleGenerate}
                        className="mt-8 px-12 py-4 text-[1.2rem] font-bold text-white bg-accent rounded-xl shadow-[0_4px_25px_var(--accent-glow)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_35px_var(--accent-glow)] outline-none"
                    >
                        IT 기술 뉴스 실시간 수집 ✨
                    </button>
                )}

                <ProgressBar isActive={loading} />
            </header>

            <section className="mb-16">
                <div className="flex justify-between items-center mb-12 border-b border-card-border pb-6">
                    <h2 className="text-[1.8rem] font-bold text-text-main flex items-center gap-3">
                        <span className="w-2 h-7 bg-accent rounded-full" />
                        Today's Tech Pulse
                    </h2>
                    <span className="text-sm text-text-muted font-medium">최신 {articles.length}개의 전문 요약</span>
                </div>

                {fetching ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(9)].map((_, i) => <ArticleSkeleton key={i} />)}
                    </div>
                ) : articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                        {articles.map((article, index) => (
                            <ArticleCard key={index} article={article} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-card-bg border border-card-border rounded-2xl">
                        <p className="text-xl text-text-muted mb-4 font-medium">수집된 IT 기사가 없습니다.</p>
                        <button onClick={handleGenerate} className="text-accent underline">지금 수집하기</button>
                    </div>
                )}
            </section>
        </main>
    );
}
