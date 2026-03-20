'use client';

import Link from 'next/link';

const AdminLink = () => {
    return (
        <div className="fixed top-6 right-8 z-[100] group">
            <Link
                href="/manage"
                className="flex items-center gap-2 px-4 py-2 bg-card-bg/50 backdrop-blur-md border border-card-border rounded-full text-xs font-semibold text-text-muted hover:text-text-main hover:border-accent/50 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
            >
                {/* Spinning Gear Icon */}
                <svg 
                    className="w-4 h-4 text-accent group-hover:rotate-180 transition-transform duration-700" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Console
            </Link>
            
            {/* Tooltip on hover */}
            <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-accent text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                관리자 전용 뉴스 데이터 및 노션 관리
            </div>
        </div>
    );
};

export default AdminLink;
