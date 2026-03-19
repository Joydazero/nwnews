'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';

export default function ManagePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [files, setFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchFiles();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId === 'admin' && password === 'Parktest1234') {
            setIsAuthenticated(true);
            setErrorMsg('');
        } else {
            setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    const fetchFiles = async () => {
        setLoading(true);
        const res = await fetch('/api/files');
        const data = await res.json();
        if (data.success) setFiles(data.files);
        setLoading(false);
    };

    const handleDelete = async (filename: string) => {
        if (confirm(`${filename} 파일을 영구 삭제하시겠습니까?`)) {
            await fetch('/api/files', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename })
            });
            fetchFiles();
        }
    };

    const handleNotionGC = async () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('노션에 등록된지 2일(48시간) 이상 지난 뉴스 기사들을 모두 휴지통으로 이동시킵니다. 계속할까요?')) {
            await fetch('/api/notion-gc', { method: 'POST' });
            alert('동기화 처리 완료!');
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="max-w-md mx-auto min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fade-in">
                <ThemeToggle />
                <div className="w-full bg-card-bg border border-card-border rounded-2xl p-8 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.1)] text-center mt-6">
                    <h2 className="text-2xl font-bold text-text-main mb-6">관리자 전용 로그인</h2>
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="아이디"
                            value={userId}
                            onChange={e => setUserId(e.target.value)}
                            className="p-3.5 rounded-xl border border-card-border bg-white/5 text-text-main placeholder:text-text-muted outline-none focus:border-accent transition-colors"
                            autoComplete="off"
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="p-3.5 rounded-xl border border-card-border bg-white/5 text-text-main placeholder:text-text-muted outline-none focus:border-accent transition-colors"
                        />
                        {errorMsg && <p className="text-red-500 text-sm text-left m-0">{errorMsg}</p>}
                        <button
                            type="submit"
                            className="mt-2 w-full bg-accent text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_var(--accent-glow)] hover:-translate-y-0.5 transition-all hover:shadow-[0_8px_25px_var(--accent-glow)]"
                        >
                            인증하기
                        </button>
                        <Link href="/" className="text-sm text-text-muted mt-4 hover:text-accent transition-colors">
                            ← 메인으로 돌아가기
                        </Link>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto py-16 px-6 sm:px-8 flex flex-col gap-8 animate-fade-in">
            <header className="text-center mb-4">
                <h1 className="text-4xl font-extrabold text-text-main mb-3">데이터베이스 및 파일 관리</h1>
                <p className="text-text-muted text-lg mb-6">수집된 로컬 JSON 데이터와 연동 노션 워크스페이스를 관리합니다.</p>
                <ThemeToggle />
                <div className="flex gap-4 justify-center items-center mt-6">
                    <Link href="/" className="text-accent underline hover:opacity-80">
                        ← 뉴스 보드 복귀
                    </Link>
                    <span className="text-text-muted">|</span>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-red-500 underline hover:opacity-80 font-medium"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            <div className="bg-card-bg border border-card-border rounded-2xl p-8 backdrop-blur-md shadow-lg">
                <h2 className="text-2xl font-bold text-text-main mb-2">로컬 뉴스 데이터 (Output)</h2>
                <div className="text-sm text-text-muted mb-6">서버 스토리지에 캐싱된 JSON 파일 리스트입니다. 필요없는 데이터는 삭제합니다.</div>

                {loading ? <p className="text-text-muted">로딩 중...</p> : (
                    <ul className="list-none p-0 flex flex-col gap-3">
                        {files.length === 0 && <p className="p-8 text-center border border-dashed border-card-border rounded-xl text-text-muted">저장된 로컬 백업이 없습니다.</p>}
                        {files.map(f => (
                            <li key={f} className="flex justify-between items-center p-4 border border-card-border bg-white/5 rounded-xl hover:border-accent/50 transition-colors">
                                <span className="text-[1.05rem] text-text-main font-medium">📄 {f}</span>
                                <button
                                    onClick={() => handleDelete(f)}
                                    className="bg-red-500/90 hover:bg-red-500 text-white border-0 px-4 py-2 rounded-lg font-semibold shadow-md transition-all hover:shadow-red-500/30"
                                >
                                    수동 삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-card-bg border border-card-border rounded-2xl p-8 backdrop-blur-md shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <h2 className="text-2xl font-bold text-yellow-500 mb-2">노션 GC (가비지 컬렉터) 강제 구동</h2>
                <div className="text-sm text-text-muted mb-6">
                    매일 새벽 2시에 자동 동작하는 GC를 수동 실행합니다. 기준일(과거 2일 이전)의 모든 데이터를 아카이브합니다.
                </div>
                <button
                    onClick={handleNotionGC}
                    className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-[0_4px_15px_rgba(234,179,8,0.2)] hover:shadow-[0_8px_25px_rgba(234,179,8,0.4)]"
                >
                    🗑️ 오래된 노션 휴지통 비우기
                </button>
            </div>
        </main>
    );
}
