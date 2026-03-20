declare module '@postlight/parser' {
    export interface ParseResult {
        title: string | null;
        content: string | null;
        author: string | null;
        date_published: string | null;
        lead_image_url: string | null;
        dek: string | null;
        next_page_url: string | null;
        url: string;
        domain: string;
        excerpt: string | null;
        word_count: number;
        direction: 'ltr' | 'rtl';
        total_pages: number;
        rendered_pages: number;
        textContent?: string;
    }

    const Parser: {
        parse(url: string, options?: any): Promise<ParseResult>;
    };

    export default Parser;
}

declare module 'compromise' {
    const nlp: any;
    export default nlp;
}

declare module 'google-translate-api-next' {
    const translate: any;
    export default translate;
}
