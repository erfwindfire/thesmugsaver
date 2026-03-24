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
import NewsletterCta from '@/components/article/NewsletterCta';
import { addHeadingIds } from '@/lib/addHeadingIds';
import JsonLd from '@/components/JsonLd';

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

    const canonicalUrl = `https://www.thesmugsaver.com/${params.category}/${params.slug}/`;

    return {
        title: article.seoTitle || article.title,
        description: article.metaDescription || article.excerpt,
        robots: {
            index: true,
            follow: true,
        },
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
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
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

    const canonicalUrl = `https://www.thesmugsaver.com/${params.category}/${params.slug}/`;

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.seoTitle || article.title,
        description: article.metaDescription || article.excerpt,
        url: canonicalUrl,
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        author: {
            '@type': 'Person',
            name: article.author || 'The Smug Saver Team',
            url: 'https://www.thesmugsaver.com/about/',
        },
        publisher: {
            '@type': 'Organization',
            name: 'The Smug Saver',
            url: 'https://www.thesmugsaver.com/',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.thesmugsaver.com/logo.png',
                width: 200,
                height: 60,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
        },
        ...(article.heroImage ? { image: article.heroImage } : {}),
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.thesmugsaver.com/',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: params.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                item: `https://www.thesmugsaver.com/${params.category}/`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: canonicalUrl,
            },
        ],
    };

    return (
        <>
        <JsonLd data={articleSchema} />
        <JsonLd data={breadcrumbSchema} />
        <div className="bg-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <Breadcrumbs categorySlug={params.category} articleTitle={article.title} />

                <article className="max-w-3xl mx-auto">
                    <div className="w-full">
                        {/* Header */}
                        <ArticleHeader
                            title={article.title}
                            category={article.category.replace(/-/g, ' ')}
                            author={article.author || "The Smug Saver Team"}
                            date={new Date(article.datePublished).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            readingTime={`${article.readingTime} min read`}
                            imageUrl={article.heroImage}
                        />

                        {/* Excerpt / Summary Card — builder style */}
                        <div style={{
                            borderLeft: '3px solid #B8962E',
                            backgroundColor: '#F8F7F4',
                            padding: '28px 36px',
                            margin: '0 0 52px 0',
                        }}>
                            <span style={{
                                color: '#B8962E',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '13px',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                display: 'block',
                                marginBottom: '14px'
                            }}>
                                {article.slug === 'money-moves-weird-2026' ? 'THE SITUATION' : 'Summary'}
                            </span>
                            <p style={{
                                color: '#2C2C2C',
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: '18px',
                                lineHeight: 1.8,
                                fontStyle: 'italic',
                                fontWeight: 400,
                                margin: 0
                            }}>
                                {article.excerpt}
                            </p>
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none font-sans article-builder
                                prose-img:rounded-xl prose-img:shadow-md
                                prose-ul:list-disc prose-ol:list-decimal
                                [&_table]:w-full [&_table]:text-left [&_table]:border-collapse [&_table]:my-8
                                [&_th]:bg-gray-100 [&_th]:p-4 [&_th]:font-serif
                                prose-td:p-4 prose-td:border-b prose-td:border-gray-100
                                prose-blockquote:border-none prose-blockquote:pl-0 prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:text-gray-600"
                            style={{ fontFamily: 'var(--font-inter), sans-serif', lineHeight: '1.8' }}
                        >
                            <ArticleContent content={addHeadingIds(article.body)} />
                        </div>
                    </div>
                </article>

                <div className="max-w-3xl mx-auto">
                    <NewsletterCta />
                </div>

                {/* Cross Links */}
                <div className="mt-8 pt-10 border-t border-gray-100 max-w-3xl mx-auto">
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
        </>
    );
}
