import { Calendar, User, Clock, Tag } from 'lucide-react';
import Link from 'next/link';

interface ArticleHeaderProps {
    title: string;
    category: string;
    author: string;
    date: string;
    readingTime?: string;
    imageUrl?: string;
    imageAlt?: string;
}

const ArticleHeader = ({ title, category, author, date, readingTime = "5 min read", imageUrl, imageAlt }: ArticleHeaderProps) => {
    return (
        <header className="mb-12 text-center max-w-[720px] mx-auto px-6 md:px-0">
            <div className="flex justify-center gap-3 mb-6 text-sm font-bold uppercase tracking-widest text-[#1B4D3E]">
                <Link href={`/${category}`} className="hover:underline border-b-2 border-transparent hover:border-[#1B4D3E] transition-colors pb-0.5">
                    {category.replace(/-/g, ' ')}
                </Link>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-dark mb-6 leading-tight text-gray-900">
                {title}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-4 text-gray-500 text-sm font-medium border-b border-gray-100 pb-8 mb-8 tracking-wide">
                <span>By {author}</span>
                <span className="text-gray-300">|</span>
                <span>{date}</span>
                <span className="text-gray-300">|</span>
                <span>{readingTime}</span>
            </div>

            {imageUrl && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-xl aspect-[16/9] relative">
                    <img
                        src={imageUrl}
                        alt={imageAlt || title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                </div>
            )}

            {/* Added subtle separator line if no image */}
            {!imageUrl && <div className="w-24 h-1 bg-gray-200 mx-auto rounded-full mt-8"></div>}
        </header>
    );
};

export default ArticleHeader;
