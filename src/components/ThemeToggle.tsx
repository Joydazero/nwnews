'use client';
import { useTheme, Theme } from './ThemeProvider';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes: { id: Theme; label: string }[] = [
        { id: 'dark', label: '다크 🌙' },
        { id: 'normal', label: '화이트 ☀️' },
    ];

    return (
        <div className="flex gap-3 justify-center my-6 flex-wrap">
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`px-5 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${theme === t.id
                        ? 'bg-accent text-white border-accent shadow-[0_0_15px_var(--accent-glow)] scale-105'
                        : 'bg-card-bg text-text-muted border-card-border hover:border-accent hover:text-text-main'
                        }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}
