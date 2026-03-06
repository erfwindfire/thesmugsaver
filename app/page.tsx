import { Metadata } from 'next';
import Hero from '@/components/Hero';
import FeatureGrid from '@/components/FeatureGrid';
import LatestArticles from '@/components/LatestArticles';
import RegistrationCTA from '@/components/RegistrationCTA';
import JsonLd from '@/components/JsonLd';

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

            {/* 1. Hero — tagline only */}
            <Hero />

            {/* 2. Latest articles — featured tile + image tiles */}
            <LatestArticles variant="top" />

            {/* 3. Registration CTA */}
            <RegistrationCTA />

            {/* 4. Remaining articles — tiles without images */}
            <LatestArticles variant="bottom" />

            {/* 5. Explore by category */}
            <FeatureGrid />
        </div>
    );
}
