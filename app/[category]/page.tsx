import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticlesByCategory, CATEGORIES } from '../../lib/articles';
import { Metadata } from 'next';

interface Props {
    params: {
        category: string;
    };
}

export async function generateStaticParams() {
    return CATEGORIES.map((cat) => ({
        category: cat.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = CATEGORIES.find((c) => c.slug === params.category);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.title} - The Smug Saver`,
        description: category.description,
    };
}

export default function CategoryPage({ params }: Props) {
    const category = CATEGORIES.find((c) => c.slug === params.category);

    if (!category) {
        notFound();
    }

    const articles = getArticlesByCategory(category.slug).sort(
        (a, b) => b.readingTime - a.readingTime // Sort by longest first as requested
    );

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold font-serif text-neutral-dark mb-4">
                    {category.title}
                </h1>
                <p className="text-xl text-neutral-600 leading-relaxed">
                    {category.description}
                </p>
            </div>

            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <Link
                        key={article.slug}
                        href={`/${category.slug}/${article.slug}`}
                        className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {category.title}
                                </span>
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {article.readingTime} min read
                                </span>
                            </div>

                            <h3 className="text-xl font-bold font-serif text-neutral-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {article.excerpt}
                            </p>

                            <div className="flex items-center text-primary font-bold text-sm">
                                Read Article
                                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {articles.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-500">No articles found in this category yet.</p>
                </div>
            )}
        </div>
    );
}
