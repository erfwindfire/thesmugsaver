import { Metadata } from 'next';
import NewsletterSection from '@/components/NewsletterSection';
import FeatureGrid from '@/components/FeatureGrid';
import ArticleGrid from '@/components/ArticleGrid';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export const metadata: Metadata = {
    title: 'The Smug Saver | UK Money-Saving Tips, Deals & Hacks',
    description: 'Save smarter with independent UK money-saving tips. Energy bills, supermarket hacks, credit card tricks, and everyday savings updated weekly.',
    alternates: {
        canonical: 'https://www.thesmugsaver.com',
    },
    openGraph: {
        title: 'The Smug Saver | UK Money-Saving Tips, Deals & Hacks',
        description: 'Save smarter with independent UK money-saving tips. Energy bills, supermarket hacks, credit card tricks, and everyday savings updated weekly.',
        url: 'https://www.thesmugsaver.com',
        siteName: 'The Smug Saver',
        type: 'website',
        locale: 'en_GB',
        images: [{ url: 'https://www.thesmugsaver.com/og-image.jpg', width: 1200, height: 630, alt: 'The Smug Saver' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Smug Saver | UK Money-Saving Tips, Deals & Hacks',
        description: 'Save smarter with independent UK money-saving tips.',
        images: ['https://www.thesmugsaver.com/og-image.jpg'],
    },
};

export default function Home() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "The Smug Saver",
        "url": "https://www.thesmugsaver.com",
        "logo": "https://www.thesmugsaver.com/logo.png",
        "description": "The UK's sharpest independent money-saving resource",
        "sameAs": []
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "The Smug Saver",
        "url": "https://www.thesmugsaver.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.thesmugsaver.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <div className="bg-gray-50 font-sans">
            <JsonLd data={organizationSchema} />
            <JsonLd data={websiteSchema} />
            <NewsletterSection />

            {/* Visual Spacer - Overlapping cards effect potential here */}
            <div className="-mt-12 relative z-10">
                <FeatureGrid />
            </div>

            <section className="py-16 md:py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
                        Today&apos;s Money-Saving Tips
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Expertly curated financial advice and money-saving strategies to help you keep more of what you earn.
                    </p>
                </div>

                <ArticleGrid limit={6} />

                {/* Removed View All Articles link as it previously pointed to /articles which is deleted */}
            </section>
        </div>
    );
}
