import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { getRecentArticles } from '@/lib/articles';

const CATEGORY_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
    'energy-bills':              { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-200' },
    'savings-and-investing':     { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    'budgeting':                 { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-200' },
    'cost-of-living':            { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-200' },
    'earning-and-benefits':      { bg: 'bg-violet-100',  text: 'text-violet-800',  border: 'border-violet-200' },
    'supermarket-savings':       { bg: 'bg-lime-100',    text: 'text-lime-800',    border: 'border-lime-200' },
    'credit-cards-and-debt':     { bg: 'bg-red-100',     text: 'text-red-800',     border: 'border-red-200' },
    'broadband-and-subscriptions': { bg: 'bg-cyan-100', text: 'text-cyan-800',    border: 'border-cyan-200' },
    'insurance':                 { bg: 'bg-indigo-100',  text: 'text-indigo-800',  border: 'border-indigo-200' },
    'housing':                   { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-200' },
    'family-and-lifestyle':      { bg: 'bg-pink-100',    text: 'text-pink-800',    border: 'border-pink-200' },
};

const DEFAULT_COLOUR = { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };

function categoryColour(category: string) {
    return CATEGORY_COLOURS[category] ?? DEFAULT_COLOUR;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function CategoryBadge({ category }: { category: string }) {
    const { bg, text } = categoryColour(category);
    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${bg} ${text}`}>
            {category.replace(/-/g, ' ')}
        </span>
    );
}

export default function LatestArticles() {
    const articles = getRecentArticles(7);
    const [featured, ...rest] = articles;

    if (!featured) return null;

    return (
        <section className="bg-gray-50 py-12 md:py-16">
            <div className="container mx-auto px-4">

                {/* Section header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="inline-block bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                            Latest
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
                            This Week&apos;s Top Reads
                        </h2>
                    </div>
                    <span className="hidden sm:block text-sm text-gray-500">Updated weekly</span>
                </div>

                {/* Featured tile — most recent article */}
                <Link
                    href={`/${featured.category}/${featured.slug}`}
                    className="group block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 mb-6 overflow-hidden"
                >
                    <div className="grid md:grid-cols-5">
                        {/* Coloured accent bar */}
                        <div className="md:col-span-1 bg-emerald-800 min-h-[8px] md:min-h-0 flex flex-col justify-between p-6 md:p-8">
                            <div>
                                <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                    Featured
                                </span>
                                <p className="text-white/80 text-sm hidden md:block">
                                    {formatDate(featured.datePublished)}
                                </p>
                            </div>
                            <div className="hidden md:flex items-center text-white font-bold text-sm group-hover:translate-x-1 transition-transform mt-6">
                                Read now <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-4 p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <CategoryBadge category={featured.category} />
                                    <span className="text-xs text-gray-400 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />{featured.readingTime} min read
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-tight mb-3">
                                    {featured.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-3">
                                    {featured.excerpt}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-400 flex items-center md:hidden">
                                    <Calendar className="w-3 h-3 mr-1" />{formatDate(featured.datePublished)}
                                </span>
                                <span className="md:hidden flex items-center text-emerald-700 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    Read now <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Tile grid — next 6 articles */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rest.map((article) => {
                        const { bg, text, border } = categoryColour(article.category);
                        return (
                            <Link
                                key={article.slug}
                                href={`/${article.category}/${article.slug}`}
                                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Top accent stripe using category colour */}
                                <div className={`h-1.5 w-full ${bg} border-b ${border}`} />

                                <div className="flex flex-col flex-1 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <CategoryBadge category={article.category} />
                                        <span className="text-xs text-gray-400 flex items-center whitespace-nowrap ml-2">
                                            <Clock className="w-3 h-3 mr-1" />{article.readingTime} min
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-base md:text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug mb-2 line-clamp-2">
                                        {article.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                                        {article.excerpt}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
                                        <span className="text-xs text-gray-400 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />{formatDate(article.datePublished)}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-700 flex items-center group-hover:translate-x-0.5 transition-transform">
                                            Read <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
