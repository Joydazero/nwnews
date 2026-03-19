import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'bg-main': 'var(--bg-main)',
                'card-bg': 'var(--card-bg)',
                'card-border': 'var(--card-border)',
                'text-main': 'var(--text-main)',
                'text-muted': 'var(--text-muted)',
                accent: 'var(--accent)',
            },
        },
    },
    plugins: [],
};
export default config;
