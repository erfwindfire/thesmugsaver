
import { Metadata } from 'next';
import Footer from '../../components/Footer';
import JsonLd from '../../components/JsonLd';

export const metadata: Metadata = {
  title: 'Terms & Conditions | The Smug Saver',
  description: 'Terms and conditions for using The Smug Saver website. Please read carefully before using our content.',
  alternates: {
    canonical: 'https://www.thesmugsaver.com/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | The Smug Saver',
    description: 'Terms and conditions for using The Smug Saver website.',
    url: 'https://www.thesmugsaver.com/terms',
    siteName: 'The Smug Saver',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: 'https://www.thesmugsaver.com/og-image.jpg', width: 1200, height: 630, alt: 'The Smug Saver' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | The Smug Saver',
    description: 'Terms and conditions for using The Smug Saver website.',
    images: ['https://www.thesmugsaver.com/og-image.jpg'],
  },
};

export default function TermsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms & Conditions',
    url: 'https://www.thesmugsaver.com/terms',
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-teal-900 mb-8">Terms & Conditions</h1>
        <div className="prose prose-lg prose-teal max-w-none">
          <p className="text-sm text-gray-500">Last Updated: February 2026</p>
          <p>
            By accessing The Smug Saver, you agree to these Terms and Conditions.
          </p>
          <h2>Disclaimer</h2>
          <p>
            The content on The Smug Saver is for informational purposes only and does not constitute financial advice. While we strive for accuracy, financial markets and regulations change. Always do your own research or consult a qualified professional before making financial decisions.
          </p>
          <h2>Intellectual Property</h2>
          <p>
            All content on this site is the property of The Smug Saver. You may not reproduce or redistribute our content without permission.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
