'use client';

import { useState } from 'react';

interface Article {
    original_title: string;
    korean_title: string;
    summary: string;
    source_url: string;
    tech_keywords?: string[];
    is_ai?: boolean;
    thumbnail?: string;
    author?: string;
    source?: string;
}

interface ArticleCardProps {
    article: Article;
    index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyMarkdown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const markdown = `### ${article.korean_title}\n\n${article.summary}\n\n[원문 보기](${article.source_url})`;
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <article className="group relative flex flex-col bg-card-bg border border-card-border rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] h-full">
            {/* 상단 장식 바 (AI 하이라이트) */}
            <div className={`absolute top-0 left-0 w-full h-[3px] transition-all duration-700 origin-left ${
                article.is_ai ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-100' : 'bg-transparent opacity-0'
            }`} />

            {/* 썸네일 영역 */}
            <div className="relative h-56 overflow-hidden bg-zinc-900/50">
                {article.thumbnail ? (
                    <img 
                        src={article.thumbnail} 
                        alt={article.korean_title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 flex items-center justify-center opacity-60">
                        <span className="text-5xl filter grayscale opacity-30">📰</span>
                    </div>
                )}
                
                {/* 오버레이 버튼 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button 
                        onClick={handleCopyMarkdown}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-110"
                        title="Copy Markdown"
                    >
                        {copied ? '✅' : '🔗'}
                    </button>
                </div>

                {article.is_ai && (
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-accent/90 backdrop-blur-md text-white text-[10px] font-black rounded-full shadow-2xl border border-white/20 animate-pulse tracking-tighter">
                        AI INSIGHT ⚡
                    </div>
                )}
            </div>

            {/* 컨텐츠 영역 */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black text-accent tracking-[0.2em] uppercase opacity-90">
                        {article.source || 'GLOBAL NEWS'}
                    </span>
                    <span className="text-[10px] text-text-muted font-bold opacity-50 italic">
                        {article.author ? `By ${article.author}` : 'Curated by AI'}
                    </span>
                </div>

                <h3 className="text-[1.45rem] font-black text-text-main leading-tight mb-5 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                    {article.korean_title}
                </h3>

                <p className="text-[0.98rem] text-text-muted leading-relaxed mb-8 line-clamp-4 flex-grow opacity-80 font-medium">
                    {article.summary}
                </p>

                {/* 태그 및 푸터 */}
                <div className="mt-auto pt-6 border-t border-card-border/30">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {article.tech_keywords && article.tech_keywords.map((keyword, i) => (
                            <span 
                                key={i} 
                                className="px-3 py-1 text-[10px] font-bold bg-accent/5 text-accent border border-accent/10 rounded-lg hover:bg-accent hover:text-white transition-all duration-300 transform"
                            >
                                #{keyword}
                            </span>
                        ))}
                    </div>
                    
                    <a 
                        href={article.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[12px] font-bold text-text-main group-hover:text-accent transition-all gap-2"
                    >
                        원본 기사 읽기
                        <span className="transform transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>
            </div>
        </article>
    );
}
