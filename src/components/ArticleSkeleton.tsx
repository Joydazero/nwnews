import React from 'react';

const ArticleSkeleton = () => {
    return (
        <div className="bg-card-bg border border-card-border rounded-2xl p-6 relative overflow-hidden flex flex-col h-full min-h-[220px]">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 shimmer pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
                <div className="w-20 h-4 bg-white/10 rounded" />
                <div className="w-6 h-6 bg-white/10 rounded-full" />
            </div>
            
            <div className="w-full h-8 bg-white/15 rounded mb-4" />
            <div className="w-[80%] h-8 bg-white/15 rounded mb-6" />
            
            <div className="mt-auto space-y-2">
                <div className="w-full h-3 bg-white/10 rounded" />
                <div className="w-full h-3 bg-white/10 rounded" />
                <div className="w-2/3 h-3 bg-white/10 rounded" />
            </div>
        </div>
    );
};

export default ArticleSkeleton;
