import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | The Smug Saver',
    description: 'Read the Terms & Conditions for using The Smug Saver website.',
};

export default function TermsAndConditions() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-8">
                <Link href="/" className="text-secondary hover:underline mb-4 inline-block">
                    &larr; Back to Homepage
                </Link>
                <h1 className="font-serif text-4xl font-bold text-primary mb-4">Terms & Conditions</h1>
                <p className="text-gray-600">Last updated: 16 February 2026</p>
            </div>

            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using The Smug Saver website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">2. Use of Content</h2>
                    <p>
                        The content on this website is provided for general information purposes only. All content, including articles, guides, and tips, is the property of The Smug Saver and is protected by copyright laws.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">3. Disclaimer</h2>
                    <p>
                        The information on this website does not constitute financial advice. We are not financial advisors, and you should always consult with a qualified professional before making any financial decisions. We are not liable for any losses or damages arising from your use of the information provided on this website.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">4. External Links</h2>
                    <p>
                        Our website may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, or completeness of any information on these external websites.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">5. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. We will notify users of any changes by updating the &quot;Last updated&quot; date at the top of this page. Your continued use of the website after any changes constitutes acceptance of those changes.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">6. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms & Conditions, please contact us through our website.
                    </p>
                </section>
            </div>

            <div className="mt-12 border-t pt-8">
                <Link href="/" className="text-secondary hover:underline font-semibold">
                    Back to Homepage
                </Link>
            </div>
        </main>
    );
}
