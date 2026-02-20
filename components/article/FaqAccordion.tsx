'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqAccordionProps {
    items: FaqItem[];
}

const FaqAccordion = ({ items }: FaqAccordionProps) => {
    // Originally requested: First 2-3 items open by default
    // Let's open the first one by default for better UX, or first 2 if valid
    const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1].filter(i => i < items.length));

    const toggleItem = (index: number) => {
        setOpenIndexes(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="my-10 border-t border-gray-100">
            <h3 className="font-serif text-2xl font-bold text-neutral-dark mb-6 mt-8">
                Frequently Asked Questions
            </h3>

            <div className="space-y-4">
                {items.map((item, index) => {
                    const isOpen = openIndexes.includes(index);
                    return (
                        <div
                            key={index}
                            className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-gray-50/50 shadow-sm' : 'bg-white'}`}
                        >
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full flex items-start justify-between p-5 text-left cursor-pointer group"
                                aria-expanded={isOpen}
                            >
                                <span className={`font-bold text-lg pr-4 transition-colors ${isOpen ? 'text-primary' : 'text-neutral-dark group-hover:text-primary'}`}>
                                    {item.question}
                                </span>
                                <span className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div
                                    className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FaqAccordion;
