
import { Metadata } from 'next';
import Footer from '../../components/Footer';
import JsonLd from '../../components/JsonLd';

export const metadata: Metadata = {
  title: 'Contact The Smug Saver | Get In Touch',
  description: 'Contact The Smug Saver team. Have a money-saving tip or a question about our articles? We would love to hear from you.',
  alternates: {
    canonical: 'https://www.thesmugsaver.com/contact',
  },
  openGraph: {
    title: 'Contact The Smug Saver | Get In Touch',
    description: 'Contact The Smug Saver team. Have a money-saving tip or a question about our articles?',
    url: 'https://www.thesmugsaver.com/contact',
    siteName: 'The Smug Saver',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: 'https://www.thesmugsaver.com/og-image.jpg', width: 1200, height: 630, alt: 'The Smug Saver' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact The Smug Saver | Get In Touch',
    description: 'Contact The Smug Saver team. Have a money-saving tip or a question about our articles?',
    images: ['https://www.thesmugsaver.com/og-image.jpg'],
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact The Smug Saver',
    url: 'https://www.thesmugsaver.com/contact',
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-teal-900 mb-8">Contact Us</h1>
        <div className="prose prose-lg prose-teal max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed">
            Have a question, a suggestion, or a money-saving story to share? We'd love to hear from you.
          </p>
          <p>
            Please note that we cannot provide personalized financial advice. For specific financial guidance, please consult a qualified Independent Financial Adviser (IFA).
          </p>
          <div className="bg-teal-50 p-8 rounded-lg border border-teal-100 mt-8">
            <h2 className="text-2xl font-serif text-teal-800 mb-4 mt-0">Email Us</h2>
            <p className="mb-0">
              You can reach our editorial team at: <a href="mailto:hello@thesmugsaver.com" className="font-bold text-teal-700 hover:text-teal-900">hello@thesmugsaver.com</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
