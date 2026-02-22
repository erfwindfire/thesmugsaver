import { getArticleBySlug, getAllArticles } from '@/lib/articles';
// Force rebuild 2
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CATEGORIES } from '@/lib/articles';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleHeader from '@/components/article/ArticleHeader';
import TableOfContents from '@/components/article/TableOfContents';
import NewsletterCta from '@/components/article/NewsletterCta';

interface PageProps {
    params: {
        category: string;
        slug: string;
    };
}

export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        category: article.category,
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const article = getArticleBySlug(params.slug);
    if (!article) return {};

    // Validate category matches
    if (article.category !== params.category) {
        return {};
    }

    const canonicalUrl = `https://www.thesmugsaver.com/${params.category}/${params.slug}`;

    return {
        title: article.seoTitle || article.title,
        description: article.metaDescription || article.excerpt,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.datePublished,
            url: canonicalUrl,
            siteName: 'The Smug Saver',
            images: article.heroImage
                ? [{ url: `https://www.thesmugsaver.com${article.heroImage}`, width: 1200, height: 630, alt: article.heroImageAlt || article.title }]
                : [{ url: 'https://www.thesmugsaver.com/og-image.jpg', width: 1200, height: 630, alt: 'The Smug Saver' }],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: article.heroImage
                ? [`https://www.thesmugsaver.com${article.heroImage}`]
                : ['https://www.thesmugsaver.com/og-image.jpg'],
        },
    };
}

export default function ArticlePage({ params }: PageProps) {
    const article = getArticleBySlug(params.slug);

    if (!article || article.category !== params.category) {
        notFound();
    }

    // Find related articles
    const relatedByCategory = getAllArticles()
        .filter(a => a.category === article.category && a.slug !== article.slug)
        .slice(0, 3);

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <Breadcrumbs categorySlug={params.category} articleTitle={article.title} />

                <article className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                    <div className="flex-grow lg:w-2/3 max-w-3xl">
                        {/* Header */}
                        <ArticleHeader
                            title={article.title}
                            category={article.category.replace(/-/g, ' ')}
                            author={article.author || "The Smug Saver Team"}
                            date={new Date(article.datePublished).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            readingTime={`${article.readingTime} min read`}
                            imageUrl={article.heroImage}
                            imageAlt={article.heroImageAlt}
                        />

                        {/* Excerpt / Summary Card */}
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E8E8E8',
                            borderRadius: '12px',
                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                            padding: '36px 40px',
                            maxWidth: '850px',
                            margin: '0 auto 48px auto'
                        }}>
                            <h3 style={{
                                color: '#B8962E',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '17px',
                                fontWeight: 700,
                                letterSpacing: '0.02em',
                                marginBottom: '16px',
                                marginTop: 0,
                                textTransform: 'uppercase'
                            }}>
                                Key Points
                            </h3>
                            <p style={{
                                color: '#333333',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '17px',
                                lineHeight: 1.75,
                                fontWeight: 400,
                                margin: 0
                            }}>
                                {article.excerpt}
                            </p>
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none text-gray-700 font-sans
                                prose-headings:font-serif prose-headings:text-neutral-dark prose-headings:font-bold
                                [&_h2]:border-b [&_h2]:border-gray-300 [&_h2]:pb-4 [&_h2]:mb-8 [&_h2]:pt-8 [&_h2]:mt-12
                                [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-4
                                prose-h4:font-bold prose-h4:text-gray-900
                                prose-p:leading-[1.8] prose-p:mb-6
                                prose-a:text-[#1B4D3E] prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-xl prose-img:shadow-md
                                prose-strong:text-neutral-dark prose-strong:font-bold
                                prose-ul:list-disc prose-ol:list-decimal
                                prose-li:marker:text-[#1B4D3E]
                                [&_table]:w-full [&_table]:text-left [&_table]:border-collapse [&_table]:my-8
                                [&_th]:bg-gray-100 [&_th]:p-4 [&_th]:font-serif
                                prose-td:p-4 prose-td:border-b prose-td:border-gray-100
                                prose-blockquote:border-none prose-blockquote:pl-0 prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-gray-600
                            "
                            style={{
                                fontFamily: 'var(--font-inter), sans-serif',
                                lineHeight: '28.8px'
                            }}
                        >
                            <ArticleContent content={article.body} />
                        </div>
                    </div>

                    <div className="hidden lg:block lg:w-1/3">
                        <div className="sticky top-24">
                            <TableOfContents />
                        </div>
                    </div>
                </article>

                <div className="max-w-3xl mx-auto">
                    <NewsletterCta />
                </div>

                {/* Cross Links */}
                <div className="mt-8 pt-10 border-t border-gray-100 max-w-3xl mx-auto lg:mx-0 lg:max-w-none">
                    <h2 className="text-2xl font-serif font-bold mb-6">More in {article.category.replace(/-/g, ' ')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedByCategory.map(rel => (
                            <Link
                                key={rel.slug}
                                href={`/${rel.category}/${rel.slug}`}
                                className="group block bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="font-bold text-lg mb-2 group-hover:text-[#1B4D3E] transition-colors">{rel.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{rel.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
