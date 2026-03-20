'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleCard from '../../components/ArticleCard';
import ProgressBar from '../../components/ProgressBar';
import ThemeToggle from '../../components/ThemeToggle';
import ArticleSkeleton from '../../components/ArticleSkeleton';

interface Article {
    original_title: string;
    korean_title: string;
    summary: string;
    source_url: string;
    tech_keywords?: string[];
    is_ai?: boolean;
}

export default function GlobalNewsPage() {
    const [activeTab, setActiveTab] = useState<'us' | 'jp' | 'de'>('us');
    const [data, setData] = useState<{ dateStr: string; articles: Article[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        setData(null);
        setFetching(true);
        fetch(`/api/data?category=${activeTab}`)
            .then(res => res.json())
            .then(result => {
                if (result.success && result.data) {
                    setData(result.data);
                }
                setFetching(false);
            })
            .catch(() => setFetching(false));
    }, [activeTab]);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ category: activeTab }),
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
                <Link href="/" className="text-sm text-accent hover:underline mb-6 inline-block opacity-80">
                    &larr; IT 뉴스 메인으로 돌아가기
                </Link>
                <h1 className="text-[3.5rem] font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    World News Dispatch
                </h1>

                <p className="text-xl text-text-main font-semibold mb-2 px-4 max-w-2xl mx-auto">
                    {activeTab === 'us' ? '미국의 정치, 경제, 사회 전반의 핵심 이슈' : 
                     activeTab === 'jp' ? '일본의 정치, 경제, 사회 트렌드 현지 소식' : 
                     '독일 및 유럽 연합(EU)의 주요 정책 및 트렌드'}
                </p>
                <p className="text-[1rem] text-text-muted opacity-70 mb-8 h-6">
                    {data ? `Last updated: ${data.dateStr}` : !fetching ? '최신 소식을 수집해 보세요.' : ''}
                </p>

                <ThemeToggle />

                {!loading && (
                    <button onClick={handleGenerate} className="mt-8 px-10 py-4 text-[1.1rem] font-bold text-white bg-accent rounded-xl shadow-[0_4px_25px_var(--accent-glow)] transition-all hover:-translate-y-1 outline-none">
                        {activeTab.toUpperCase()} 최신 소식 자동 수집 ✨
                    </button>
                )}

                <ProgressBar isActive={loading} />
            </header>

            <div className="flex border-b border-card-border mb-14 overflow-x-auto no-scrollbar justify-center">
                {[
                    { id: 'us', label: '미국 뉴스', icon: '🇺🇸' },
                    { id: 'jp', label: '일본 뉴스', icon: '🇯🇵' },
                    { id: 'de', label: '독일 뉴스', icon: '🇩🇪' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-14 py-5 text-[1.2rem] font-bold transition-all border-b-2 whitespace-nowrap min-w-[180px] ${activeTab === tab.id
                                ? 'border-accent text-accent bg-accent/5'
                                : 'border-transparent text-text-muted hover:text-text-main hover:bg-white/5'
                            }`}
                    >
                        <span className="mr-3 text-2xl">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {fetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => <ArticleSkeleton key={i} />)}
                </div>
            ) : data && data.articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                    {data.articles.map((article: Article, index: number) => (
                        <ArticleCard key={index} article={article} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-card-bg border border-card-border rounded-2xl">
                    <p className="text-xl text-text-muted mb-4 font-medium">{activeTab.toUpperCase()} 수집된 기사가 없습니다.</p>
                </div>
            )}
        </main>
    );
}
