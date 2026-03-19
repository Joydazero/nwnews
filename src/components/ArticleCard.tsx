import React from 'react';

export interface Article {
    original_title: string;
    korean_title: string;
    summary: string;
    source_url: string;
    tech_keywords?: string[]; // AI가 정확하게 추출해준 핵심 기술 키워드
}

export default function ArticleCard({ article, index }: { article: Article; index: number }) {
    const summaries = article.summary.split('\n').map(s => s.replace(/^\d+\.\s*/, ''));

    return (
        <article className="bg-card-bg border border-card-border rounded-2xl p-8 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group mb-8 animate-fade-in flex flex-col justify-between">
            <div>
                <div className="absolute top-0 left-0 w-1.5 h-full bg-accent shadow-[0_0_10px_var(--accent-glow)] scale-y-0 origin-top transition-transform duration-300 group-hover:scale-y-100" />

                <h2 className="text-2xl font-semibold mb-2 leading-snug">
                    <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-accent transition-colors">
                        {article.korean_title}
                    </a>
                </h2>

                <div className="text-sm text-text-muted mb-6 flex items-center gap-2">
                    <span>🇺🇸
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
                                className="px-4 py-1.5 rounded-full bg-white/5 text-text-main text-[0.85rem] font-bold shadow-sm border border-card-border transition-all duration-300 hover:bg-accent hover:text-white hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_5px_15px_var(--accent-glow)] cursor-default tracking-wide"
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
