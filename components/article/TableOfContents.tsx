'use client';

import { useState, useEffect } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface Props {
    /** 'desktop' = sticky sidebar panel (hidden on mobile)
     *  'mobile'  = <details> disclosure (hidden on lg+, renders in article column) */
    variant?: 'desktop' | 'mobile';
}

const TableOfContents = ({ variant = 'desktop' }: Props) => {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // IDs are injected server-side by addHeadingIds() — just read them
        const elements = Array.from(
            document.querySelectorAll<HTMLElement>('article h2[id], article h3[id]')
        );

        setHeadings(
            elements.map((el) => ({
                id: el.id,
                text: el.textContent || '',
                level: Number(el.tagName[1]),
            }))
        );

        // Scroll-spy
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: '-80px 0px -66%' }
        );
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (headings.length < 2) return null;

    const links = headings.map((h) => (
        <a
            key={h.id}
            href={`#${h.id}`}
            className={`block text-sm py-1 transition-colors ${
                h.level === 3 ? 'pl-4' : ''
            } ${
                activeId === h.id
                    ? 'text-[#1B4D3E] font-bold'
                    : 'text-gray-600 hover:text-[#1B4D3E]'
            }`}
            onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
        >
            {h.text}
        </a>
    ));

    /* ── Desktop sidebar ── */
    if (variant === 'desktop') {
        return (
            <div className="bg-gray-50 rounded-xl p-6 max-h-[calc(100vh-140px)] overflow-y-auto">
                <p className="font-bold text-sm text-[#1B4D3E] uppercase tracking-widest mb-4">
                    On this page
                </p>
                <nav>{links}</nav>
            </div>
        );
    }

    /* ── Mobile <details> disclosure ── */
    return (
        <details className="lg:hidden mb-8 border border-gray-200 rounded-xl overflow-hidden not-prose">
            <summary className="cursor-pointer px-5 py-3 bg-gray-50 text-sm font-bold text-[#1B4D3E] uppercase tracking-widest select-none list-none flex items-center justify-between">
                On this page
                <span className="text-gray-400 text-xs font-normal normal-case tracking-normal">▾</span>
            </summary>
            <div className="px-5 py-4">
                <nav>{links}</nav>
            </div>
        </details>
    );
};

export default TableOfContents;
