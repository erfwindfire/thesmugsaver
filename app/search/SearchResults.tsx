'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllArticles } from '../../lib/articles';
import { Search, Calendar, Tag, ArrowRight } from 'lucide-react';

export default function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const articles = getAllArticles();

    const results = query ? articles.filter((article) => {
        const q = query.toLowerCase();
        return (
            article.title.toLowerCase().includes(q) ||
            article.excerpt.toLowerCase().includes(q) ||
            article.body.toLowerCase().includes(q) ||
            article.category.toLowerCase().includes(q)
        );
    }) : [];

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh]">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-serif font-bold text-neutral-dark mb-4">
                        {query ? (
                            <>Search Results for <span className="text-primary">"{query}"</span></>
                        ) : (
                            'Search Articles'
                        )}
                    </h1>
                    <p className="text-gray-600">
                        Found {results.length} article{results.length !== 1 ? 's' : ''} matching your search.
                    </p>
                </div>

                {results.length > 0 ? (
                    <div className="space-y-6">
                        {results.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/${article.category}/${article.slug}`}
                                className="group block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wide">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {article.category.replace(/-/g, ' ')}
                                            </span>
                                            <span className="text-gray-400 text-xs flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(article.datePublished).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-dark mb-3 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h2>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <span className="text-sm font-bold text-primary flex items-center group-hover:underline">
                                            Read Article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-700 mb-2">No results found</h3>
                        <p className="text-gray-500">Try adjusting your search terms or browse our categories.</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link href="/budgeting" className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-primary hover:text-primary transition-colors">Budgeting</Link>
                            <Link href="/savings-and-investing" className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-primary hover:text-primary transition-colors">Savings</Link>
                            <Link href="/cost-of-living" className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold hover:border-primary hover:text-primary transition-colors">Cost of Living</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
