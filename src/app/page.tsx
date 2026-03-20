'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from '../components/ProgressBar';
import ArticleCard, { Article } from '../components/ArticleCard';
import ThemeToggle from '../components/ThemeToggle';

export default function HomePage() {
    const [activeTab, setActiveTab] = useState<'it' | 'us' | 'jp'>('it');
    const [data, setData] = useState<{ dateStr: string; articles: Article[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 탭 변경 시 데이터 다시 불러오기
    useEffect(() => {
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
            // 현재 활성화된 탭의 뉴스 수집 요청 (백엔드 지원 필요 시 추가 작업 가능)
            // 현재는 index.ts의 --run-it 등을 수동으로 하거나 전체 파이프라인 연동
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
        <main className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
            <header className="text-center mb-12 animate-fade-in">
                <h1 className="text-[3rem] font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    NW News Dispatch
                </h1>
                
                {/* More Information Section */}
                <div className="flex justify-center gap-3 text-sm text-text-muted mb-4 opacity-80">
                    <span>more information</span>
                    <button onClick={() => setActiveTab('us')} className="hover:scale-110 transition-transform">🇺🇸</button>
                    <button onClick={() => setActiveTab('jp')} className="hover:scale-110 transition-transform">🇯🇵</button>
                </div>

                <p className="text-lg text-text-muted font-light mb-1.5 px-4">
                    {activeTab === 'it' && '실리콘밸리의 최신 웹 개발 트렌드 큐레이션'}
                    {activeTab === 'us' && '미국의 정치, 경제, 사회 전반의 핵심 이슈'}
                    {activeTab === 'jp' && '일본의 정치, 경제, 사회 트렌드 현지 소식'}
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
                            {activeTab.toUpperCase()} 최신 소식 자동 수집 ✨
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

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-card-border mb-10 overflow-x-auto no-scrollbar">
                {[
                    { id: 'it', label: 'IT 메인', icon: '💻' },
                    { id: 'us', label: '세계 (미국)', icon: '🇺🇸' },
                    { id: 'jp', label: '세계 (일본)', icon: '🇯🇵' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 sm:flex-none px-8 py-3.5 text-[1.05rem] font-bold transition-all border-b-2 whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'border-accent text-accent bg-accent/5'
                                : 'border-transparent text-text-muted hover:text-text-main hover:bg-white/5'
                        }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {fetching ? (
                <div className="text-center py-20 text-text-muted animate-pulse text-lg">
                    데이터를 가져오는 중입니다...
                </div>
            ) : data && data.articles.length > 0 ? (
                <div className="flex flex-col gap-6">
                    {data.articles.map((article, idx) => (
                        <ArticleCard key={idx} article={article} index={idx} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-16 bg-card-bg rounded-2xl border border-dashed border-card-border text-text-muted animate-fade-in shadow-sm">
                    <p className="text-lg">수집된 기사가 없습니다. 수집 버튼을 눌러주세요!</p>
                </div>
            )}
        </main>
    );
}
