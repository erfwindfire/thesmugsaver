import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { getRecentArticles } from '@/lib/articles';

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface LatestArticlesProps {
    /** 'top' = section header + featured tile + grid tiles that have a heroImage
     *  'bottom' = grid tiles that do NOT have a heroImage (no section header) */
    variant?: 'top' | 'bottom';
}

export default function LatestArticles({ variant = 'top' }: LatestArticlesProps) {
    const articles = getRecentArticles(7);
    const [featured, ...rest] = articles;

    if (!featured) return null;

    const withImage = rest.filter(a => a.heroImage);
    const withoutImage = rest.filter(a => !a.heroImage);

    /* ── BOTTOM variant: remaining articles without images ── */
    if (variant === 'bottom') {
        if (withoutImage.length === 0) return null;
        return (
            <section className="bg-gray-50 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {withoutImage.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/${article.category}/${article.slug}`}
                                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                <div className="h-1.5 w-full bg-emerald-100 border-b border-emerald-200" />
                                <div className="flex flex-col flex-1 p-5">
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
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    /* ── TOP variant: section header + featured tile + image tiles ── */
    return (
        <section className="bg-gray-50 py-12 md:py-16">
            <div className="container mx-auto px-4">

                {/* Featured tile — most recent article */}
                <Link
                    href={`/${featured.category}/${featured.slug}`}
                    className="group block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 mb-6 overflow-hidden"
                >
                    <div className="grid md:grid-cols-5">
                        {featured.heroImage ? (
                            <div className="md:col-span-2 relative min-h-[220px] md:min-h-0 overflow-hidden bg-emerald-800">
                                <Image
                                    src={featured.heroImage}
                                    alt={featured.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    priority
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-block bg-emerald-800/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                        Featured
                                    </span>
                                </div>
                            </div>
                        ) : (
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
                        )}

                        <div className={`${featured.heroImage ? 'md:col-span-3' : 'md:col-span-4'} p-6 md:p-8 flex flex-col justify-between`}>
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs text-gray-400 flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />{formatDate(featured.datePublished)}
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-tight mb-3">
                                    {featured.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-3">
                                    {featured.excerpt}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-end pt-4 border-t border-gray-100">
                                <span className="flex items-center text-emerald-700 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    Read now <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Image tiles */}
                {withImage.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {withImage.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/${article.category}/${article.slug}`}
                                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <Image
                                        src={article.heroImage!}
                                        alt={article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 p-5">
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
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
