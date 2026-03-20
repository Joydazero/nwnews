import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '../components/ThemeProvider';
import ScrollToTop from '../components/ScrollToTop';
import AdminLink from '../components/AdminLink';

export const metadata = {
    title: 'NW News - Daily Silicon Valley Tech Updates',
    description: 'AI-curated and translated tech articles from the heart of web development.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
            </head>
            <body className="antialiased min-h-screen">
                <ThemeProvider>
                    <AdminLink />
                    {children}
                    <ScrollToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}
