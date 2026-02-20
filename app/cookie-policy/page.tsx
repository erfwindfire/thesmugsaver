import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy | The Smug Saver',
    description: 'Learn how The Smug Saver uses cookies to improve your experience.',
};

export default function CookiePolicy() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="mb-8">
                <Link href="/" className="text-secondary hover:underline mb-4 inline-block">
                    &larr; Back to Homepage
                </Link>
                <h1 className="font-serif text-4xl font-bold text-primary mb-4">Cookie Policy</h1>
                <p className="text-gray-600">Last updated: 16 February 2026</p>
            </div>

            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">1. What Are Cookies</h2>
                    <p>
                        Cookies are small text files that are stored on your computer or mobile device when you visit a website. They help the website remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">2. How We Use Cookies</h2>
                    <p className="mb-4">The Smug Saver uses cookies to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Remember your preferences and settings</li>
                        <li>Understand how you use our website</li>
                        <li>Improve your browsing experience</li>
                        <li>Analyze website traffic and performance</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">3. Types of Cookies We Use</h2>

                    <h3 className="text-xl font-semibold text-primary mb-2">Essential Cookies</h3>
                    <p className="mb-4">These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</p>

                    <h3 className="text-xl font-semibold text-primary mb-2">Analytics Cookies</h3>
                    <p className="mb-4">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>

                    <h3 className="text-xl font-semibold text-primary mb-2">Functionality Cookies</h3>
                    <p className="mb-4">These cookies enable the website to remember choices you make (such as your preferences) and provide enhanced, more personal features.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">4. Managing Cookies</h2>
                    <p>
                        Most web browsers allow you to control cookies through their settings. You can choose to accept or decline cookies, or set your browser to notify you when a website tries to place a cookie on your computer. However, if you disable cookies, some features of our website may not function properly.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">5. Third-Party Cookies</h2>
                    <p>
                        We may use third-party services that use cookies to help us analyze how our website is used. These third-party cookies are subject to the privacy policies of the respective third parties.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">6. Changes to This Policy</h2>
                    <p>
                        We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the &quot;Last updated&quot; date.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-primary mb-4">7. Contact Us</h2>
                    <p>
                        If you have any questions about our Cookie Policy, please contact us through our website.
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
