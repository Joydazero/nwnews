'use client';

import React, { useState } from 'react';

export interface Article {
    original_title: string;
    korean_title: string;
    summary: string;
    source_url: string;
    tech_keywords?: string[];
    is_ai?: boolean; // AI 관련 뉴스 하이라이트용 플래그
}

export default function ArticleCard({ article, index }: { article: Article; index: number }) {
    const [copied, setCopied] = useState(false);
    const summaries = article.summary.split('\n').map(s => s.replace(/^\d+\.\s*/, ''));

    const handleCopyMarkdown = () => {
        const keywords = article.tech_keywords?.map(k => `#${k}`).join(' ') || '';
        const markdown = `### [${article.korean_title}](${article.source_url})\n\n` +
            `**원문:** [${article.original_title}](${article.source_url})\n\n` +
            `${summaries.map(s => `- ${s}`).join('\n')}\n\n` +
            `${keywords}`;

        navigator.clipboard.writeText(markdown).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <article className={`bg-card-bg border rounded-2xl p-8 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group mb-8 animate-fade-in flex flex-col justify-between ${
            article.is_ai 
            ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20' 
            : 'border-card-border'
        }`}>
            <div>
                {/* Horizontal Top Bar */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_10px_var(--accent-glow)] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100 ${
                    article.is_ai ? 'scale-x-100 opacity-70' : ''
                }`} />

                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-2 pr-8">
                        {article.is_ai && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent text-[10px] font-bold text-white uppercase tracking-wider w-fit animate-pulse">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                AI Focus
                            </span>
                        )}
                        <h2 className={`text-2xl font-semibold leading-snug ${article.is_ai ? 'text-accent' : ''}`}>
                            <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-accent transition-colors">
                                {article.korean_title}
                            </a>
                        </h2>
                    </div>
                    <button
                        onClick={handleCopyMarkdown}
                        className={`shrink-0 p-2 rounded-lg border transition-all duration-300 ${copied
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : 'bg-white/5 border-card-border text-text-muted hover:border-accent hover:text-accent'
                            }`}
                        title="마크다운으로 복사"
                    >
                        {copied ? (
                            <span className="text-xs font-bold px-1">복사됨!</span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="text-sm text-text-muted mb-6 flex items-center gap-2">
                    <span>🌍
                        <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-text-muted underline ml-1.5 hover:text-accent transition-colors">
                            {article.original_title}
                        </a>
                    </span>
                </div>

                <ul className="list-none space-y-3 m-0 p-0 mb-6">
                    {summaries.map((point, i) => (
                        <li key={i} className="relative pl-7 text-[1.05rem] text-text-main opacity-90 leading-relaxed">
                            <span className="absolute left-0 top-1 text-accent text-sm">✦</span>
                            {point}
                        </li>
                    ))}
                </ul>
            </div>

            {article.tech_keywords && article.tech_keywords.length > 0 && (
                <div className="mt-4 pt-5 border-t border-dashed border-card-border">
                    <div className="flex flex-wrap gap-2.5">
                        {article.tech_keywords.map((k, i) => (
                            <span
                                key={i}
                                className={`px-4 py-1.5 rounded-full text-[0.85rem] font-bold shadow-sm border transition-all duration-300 hover:-translate-y-0.5 cursor-default tracking-wide ${
                                    article.is_ai && (k.toLowerCase().includes('ai') || k.toLowerCase().includes('gpt'))
                                    ? 'bg-accent text-white border-accent shadow-[0_5px_15px_var(--accent-glow)]'
                                    : 'bg-white/5 text-text-main border-card-border hover:bg-accent hover:text-white hover:border-accent'
                                }`}
                            >
                                #{k}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
