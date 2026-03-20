'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from '../../components/ProgressBar';

export default function ManagePage() {
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('nwnews_last_update');
        setLastUpdate(stored);
    }, []);

    const handleUpdate = async (category: string) => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ category }),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (result.success) {
                const today = new Date().toISOString().split('T')[0];
                localStorage.setItem('nwnews_last_update', today);
                setLastUpdate(today);
                alert(`${category.toUpperCase()} 뉴스 수집 및 가공이 성공적으로 완료되었습니다! 🎉`);
            } else {
                alert(`오류 발생: ${result.error}`);
            }
        } catch (err) {
            alert('서버와의 통신에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-bg-main py-24 px-8">
            <div className="max-w-[1000px] mx-auto">
                <header className="mb-20 text-center">
                    <h1 className="text-[3rem] font-black bg-gradient-to-r from-accent to-pink-500 bg-clip-text text-transparent mb-4">
                        ADMIN CONSOLE
                    </h1>
                    <p className="text-text-muted text-[1.1rem] opacity-70">
                        나만 제어할 수 있는 프리미엄 뉴스 가공 센터
                    </p>
                    <Link href="/" className="mt-6 inline-block text-accent hover:underline font-bold text-sm">
                        &larr; 사용자 메인 페이지로 돌아가기
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* IT 자동화 카드 */}
                    <section className="bg-card-bg border border-card-border/50 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-accent opacity-40" />
                        <h2 className="text-[1.8rem] font-black text-text-main mb-4">IT Tech Pulse</h2>
                        <ul className="text-sm text-text-muted mb-8 space-y-2 opacity-80 font-medium">
                            <li>• Readability: 광고 없는 본문 스크래핑</li>
                            <li>• TextRank: 수학적 3문장 요약</li>
                            <li>• Metascraper: 고화질 썸네일 자동 확보</li>
                            <li>• Keyword: 태그 자동 분석</li>
                        </ul>
                        
                        <button 
                            onClick={() => handleUpdate('it')}
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-[1.1rem] transition-all shadow-lg ${
                                loading 
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                : 'bg-accent text-white hover:scale-[1.02] hover:shadow-accent/40 lg:active:scale-95'
                            }`}
                        >
                            {loading ? '가공 중...' : '☀️ IT 뉴스 수집 및 정밀 가공'}
                        </button>
                    </section>

                    {/* 글로벌 뉴스 카드 */}
                    <section className="bg-card-bg border border-card-border/50 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-pink-500 opacity-40" />
                        <h2 className="text-[1.8rem] font-black text-text-main mb-4">Global Insight</h2>
                        <ul className="text-sm text-text-muted mb-8 space-y-2 opacity-80 font-medium">
                            <li>• US Politics & Economy (🇺🇸)</li>
                            <li>• Japan News (🇯🇵)</li>
                            <li>• Europe / Germany (🇩🇪)</li>
                        </ul>
                        
                        <div className="grid grid-cols-3 gap-3">
                            {['us', 'jp', 'de'].map(lang => (
                                <button 
                                    key={lang}
                                    onClick={() => handleUpdate(lang)}
                                    disabled={loading}
                                    className="py-4 bg-zinc-900 border border-card-border/50 rounded-xl font-bold text-xs hover:border-pink-500 hover:text-pink-500 transition-all disabled:opacity-30"
                                >
                                    {lang.toUpperCase()} ⚡
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-text-muted opacity-60 font-medium">
                        최근 업데이트: {lastUpdate || '기록 없음'}
                    </p>
                    <ProgressBar isActive={loading} />
                </div>
            </div>
        </main>
    );
}
