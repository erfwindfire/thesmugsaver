'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

const TableOfContents = () => {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Find all H2 and H3 elements in the article content
        // We assume the article content is wrapped in a class called 'article-body' or similar, 
        // or just look inside 'main' or 'article'.
        const elements = Array.from(document.querySelectorAll('article h2, article h3'));

        const items = elements.map((elem, index) => {
            // Ensure element has an ID
            if (!elem.id) {
                elem.id = `heading-${index}`;
            }

            return {
                id: elem.id,
                text: elem.textContent || '',
                level: Number(elem.tagName.substring(1))
            };
        });

        setHeadings(items);

        // Scroll spy
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (headings.length < 2) return null;

    return (
        <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-gray-50 rounded-xl p-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pb-10">
                <h3 className="font-bold text-neutral-dark mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-[#1B4D3E]" />
                    Table of Contents
                </h3>
                <nav className="space-y-1">
                    {headings.map((heading) => (
                        <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className={`block text-sm py-1 transition-colors ${heading.level === 3 ? 'pl-4' : ''
                                } ${activeId === heading.id
                                    ? 'text-[#1B4D3E] font-bold'
                                    : 'text-gray-600 hover:text-neutral-dark'
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }}
                        >
                            {heading.text}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default TableOfContents;
