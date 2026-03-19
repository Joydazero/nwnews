import React, { useEffect, useState } from 'react';

export default function ProgressBar({ isActive }: { isActive: boolean }) {
    const [progress, setProgress] = useState(0);
    const [stepText, setStepText] = useState('대기 중...');

    useEffect(() => {
        if (!isActive) {
            setProgress(0);
            setStepText('대기 중...');
            return;
        }

        setStepText('1단계: 글로벌 소스(RSS, HackerNews, Dev.to) 기사 수집 중... (0/20)');
        setProgress(15);

        const timer1 = setTimeout(() => {
            setStepText('2단계: 대형 언어 모델(Gemini API)을 활용한 기사 문맥 분석 및 한국어 의역 진행 중...');
            setProgress(40);
        }, 3000);

        const timer2 = setTimeout(() => {
            setStepText('2단계: AI 분석 중... (이 단계는 가장 오래 소요됩니다)');
            setProgress(75);
        }, 15000);

        const timer3 = setTimeout(() => {
            setStepText('3단계: 번역된 데이터 병합 및 노션 데이터베이스 병렬 적재 중...');
            setProgress(90);
        }, 28000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="mt-10 w-full max-w-2xl mx-auto">
            <div className="flex justify-between mb-2">
                <span className="text-base text-accent font-semibold">진행 상황</span>
                <span className="text-[0.95rem] text-text-muted">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-card-border rounded-md overflow-hidden shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-[800ms] ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-center mt-5 text-[1.05rem] text-text-muted font-light animate-pulse">
                {stepText}
            </p>
        </div>
    );
}
