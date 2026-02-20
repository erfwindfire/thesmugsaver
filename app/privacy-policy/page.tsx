
import { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import JsonLd from '../../components/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Smug Saver',
  description: 'Our privacy policy explains how we collect, use, and protect your data at The Smug Saver.',
  alternates: {
    canonical: 'https://www.thesmugsaver.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | The Smug Saver',
    description: 'Our privacy policy explains how we collect, use, and protect your data at The Smug Saver.',
    url: 'https://www.thesmugsaver.com/privacy-policy',
    siteName: 'The Smug Saver',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: 'https://www.thesmugsaver.com/og-image.jpg', width: 1200, height: 630, alt: 'The Smug Saver' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | The Smug Saver',
    description: 'Our privacy policy explains how we collect, use, and protect your data at The Smug Saver.',
    images: ['https://www.thesmugsaver.com/og-image.jpg'],
  },
};

export default function PrivacyPolicyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    url: 'https://www.thesmugsaver.com/privacy-policy',
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-teal-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg prose-teal max-w-none">
          <p className="text-sm text-gray-500">Last Updated: February 2026</p>
          <p>
            Your privacy is important to us. This policy explains how The Smug Saver handles your information.
          </p>
          <h2>Information We Collect</h2>
          <p>
            We do not require user registration to access our content. We may collect anonymous analytics data to understand how our site is used and improve our content.
          </p>
          <h2>Cookies</h2>
          <p>
            We use minimal cookies for site functionality and aggregated analytics. You can control cookie preferences through your browser settings.
          </p>
          <h2>Contact</h2>
          <p>
            If you have questions about this policy, please contact us at [hello@thesmugsaver.com].
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
