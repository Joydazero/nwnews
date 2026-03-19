import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import ScrollToTop from '../components/ScrollToTop';

export const metadata = {
    title: 'NW News - Daily Silicon Valley Tech Updates',
    description: 'AI-curated and translated tech articles from the heart of web development.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className="antialiased min-h-screen">
                <ThemeProvider>
                    {children}
                    <ScrollToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}
