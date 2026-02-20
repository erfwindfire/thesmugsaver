
import { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import JsonLd from '../../components/JsonLd';

export const metadata: Metadata = {
  title: 'About The Smug Saver | Independent UK Money Advice',
  description: 'The Smug Saver provides independent, actionable money-saving advice for UK households. Learn how to cut bills, save smarter, and beat inflation.',
  alternates: {
    canonical: 'https://www.thesmugsaver.com/about',
  },
  openGraph: {
    title: 'About The Smug Saver | Independent UK Money Advice',
    description: 'The Smug Saver provides independent, actionable money-saving advice for UK households. Learn how to cut bills, save smarter, and beat inflation.',
    url: 'https://www.thesmugsaver.com/about',
    siteName: 'The Smug Saver',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: 'https://www.thesmugsaver.com/og-image.jpg', width: 1200, height: 630, alt: 'The Smug Saver' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About The Smug Saver | Independent UK Money Advice',
    description: 'The Smug Saver provides independent, actionable money-saving advice for UK households.',
    images: ['https://www.thesmugsaver.com/og-image.jpg'],
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The Smug Saver',
    url: 'https://www.thesmugsaver.com/about',
    description: 'The Smug Saver provides independent, actionable money-saving advice for UK households.',
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-teal-900 mb-8">About The Smug Saver</h1>
        <div className="prose prose-lg prose-teal max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed">
            The Smug Saver is an independent resource dedicated to helping UK households navigate the cost of living crisis with actionable, proven strategies.
          </p>
          <p>
            We don't just list deals. We explain the mechanisms behind savings—from how the energy market works to the psychology of supermarket pricing. Our mission is to empower you to take control of your finances, one bill at a time.
          </p>
          <h2>Our Philosophy</h2>
          <p>
            We believe that saving money shouldn't mean a lower quality of life. It means being smarter with your resources. Whether it's switching broadband providers, understanding tax allowances, or mastering the weekly shop, small changes compound into significant wealth over time.
          </p>
          <h2>Why "Smug"?</h2>
          <p>
            Because there is a quiet satisfaction in knowing you paid less than everyone else. That feeling when you get the same flight for half the price, or slash your energy bill while staying warm. That's the feeling we want to help you achieve.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
