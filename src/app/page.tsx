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
    const [isUpdated, setIsUpdated] = useState(false);
    
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setFetching(true);
        fetch('/api/data?category=it')
            .then(async (res) => {
                const result = await res.json().catch(() => ({}));
                return result as any;
            })
            .then((result) => {
                if (result.success && result.data) {
                    setArticles(result.data.articles);
                }
                setFetching(false);
            })
            .catch(() => {
                setFetching(false);
            });
    }, []);

    const isUpdatedDisplay = isUpdated;

    return (
        <main className="max-w-[1200px] mx-auto py-24 px-6 sm:px-10">
            <nav className="fixed top-8 right-10 z-50 flex items-center gap-6 p-4 bg-bg-main/60 backdrop-blur-xl rounded-2xl border border-card-border/30 shadow-2xl scale-90 origin-right">
                <Link href="/manage" className="text-[11px] font-black text-accent tracking-[0.2em] uppercase hover:scale-105 transition-all">
                    Admin Dash &rarr;
                </Link>
                <div className="w-[1px] h-3 bg-card-border/50" />
                <ThemeToggle />
            </nav>

            <header className="text-center mb-20 animate-fade-in relative pt-12">
                <h1 className="text-[4rem] font-black bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-4 tracking-tighter">
                    NWNEWS
                </h1>

                <div className="flex flex-col items-center gap-3 mb-12">
                    <p className="text-[1.1rem] font-medium text-text-muted opacity-80 tracking-tight">
                        프리미엄 리포트로 만나는 글로벌 테크 인사이트
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-text-muted opacity-50 tracking-widest font-bold">
                        <span>USA 🇺🇸</span>
                        <span>JAPAN 🇯🇵</span>
                        <span>EUROPE 🇩🇪</span>
                    </div>
                </div>
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
                    <div className="text-center py-32 bg-card-bg/50 border border-card-border/30 rounded-[3rem] shadow-2xl backdrop-blur-sm">
                        <div className="text-5xl mb-6 opacity-30 grayscale filter">⏳</div>
                        <p className="text-xl text-text-muted mb-8 font-black opacity-60 tracking-tight">수집된 IT 기사가 없습니다.</p>
                        <p className="text-sm text-accent opacity-70 font-bold mb-10">오전 8시 자동 수집을 기다리거나, 관리 어드민에서 수집을 시작하세요.</p>
                        <Link href="/manage" className="px-10 py-4 bg-accent/90 text-white rounded-full font-black text-sm shadow-xl hover:scale-105 hover:bg-accent transition-all">
                            Admin 대시보드 가기
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
