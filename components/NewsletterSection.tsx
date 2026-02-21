'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const EmailCaptureSection = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData as any).toString(),
            });
            if (response.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <section className="bg-primary py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                    Smart Money Management
                </h2>
                <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg">
                    Get money-saving tips, budgeting strategies, and financial advice delivered weekly. Build wealth while living well.
                </p>

                {/* Hero people image */}
                <div className="mx-auto mb-12 max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src="/assets/images/homepage-hero-people.jpg"
                        alt="Smart money management for everyone"
                        width={800}
                        height={450}
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Email capture — powered by Netlify Forms */}
                {status === 'success' ? (
                    <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-white font-bold text-xl mb-2">You&apos;re in!</h4>
                        <p className="text-white/80">Keep an eye on your inbox for your first money-saving tip.</p>
                    </div>
                ) : (
                    <form
                        name="email-signup"
                        method="POST"
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        onSubmit={handleSubmit}
                        className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
                    >
                        <input type="hidden" name="form-name" value="email-signup" />
                        <p className="hidden">
                            <label>Don&apos;t fill this out: <input name="bot-field" /></label>
                        </p>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-grow px-5 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                            required
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="bg-secondary hover:bg-secondary-hover text-white font-bold py-3 px-6 rounded-md transition-colors shadow-sm disabled:opacity-70 whitespace-nowrap"
                        >
                            {status === 'loading' ? 'Signing up…' : 'Start saving now'}
                        </button>
                    </form>
                )}
                {status === 'error' && (
                    <p className="text-white/70 text-sm mt-3">Something went wrong — please try again.</p>
                )}
                <p className="text-white/50 text-xs mt-4">
                    No spam. Unsubscribe at any time. Read our{' '}
                    <a href="/privacy-policy" className="underline hover:text-white/80">privacy policy</a>.
                </p>
            </div>
        </section>
    );
};

export default EmailCaptureSection;
