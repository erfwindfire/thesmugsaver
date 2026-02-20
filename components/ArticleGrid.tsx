
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { getRecentArticles } from '@/lib/articles';

interface ArticleGridProps {
    limit?: number;
}

export default function ArticleGrid({ limit = 6 }: ArticleGridProps) {
    const articles = getRecentArticles(limit);

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
                <Link
                    key={article.slug}
                    href={`/${article.category}/${article.slug}`}
                    className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                    <div className="mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary uppercase tracking-wide">
                            {article.category.replace(/-/g, ' ')}
                        </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors leading-tight">
                        {article.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {article.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-xs text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(article.datePublished).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-bold text-teal-600 flex items-center group-hover:translate-x-1 transition-transform">
                            Read Article <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
