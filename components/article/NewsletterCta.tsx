'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const NewsletterCta = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <div className="my-16 bg-[#1B4D3E] rounded-2xl overflow-hidden shadow-xl relative isolate">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="relative p-8 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between gap-8">
                <div className="md:w-1/2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wide mb-4 border border-white/20">
                        <Mail className="w-3 h-3" />
                        Weekly Money Tips
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                        Join 25,000+ Smug Savers
                    </h3>
                    <p className="text-white/80 mb-6 md:mb-0 leading-relaxed">
                        Get our latest money-saving guides, cheat sheets, and expert advice delivered straight to your inbox. No spam, ever.
                    </p>
                </div>

                <div className="md:w-1/2">
                    {status === 'success' ? (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="w-6 h-6 text-[#1B4D3E]" />
                            </div>
                            <h4 className="text-white font-bold text-lg">You're on the list!</h4>
                            <p className="text-white/80 text-sm">Keep an eye on your inbox for your first tip.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 rounded-xl border border-transparent focus:border-white/50 focus:ring-0 bg-white/10 text-white placeholder:text-white/60 outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full px-6 py-3 rounded-xl bg-white text-[#1B4D3E] font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
                            >
                                {status === 'loading' ? 'Signing up...' : 'Subscribe for Free'}
                                {!status.match(/loading/) && <ArrowRight className="w-4 h-4" />}
                            </button>
                            <p className="text-white/50 text-xs text-center mt-2">
                                Unsubscribe at any time. Read our privacy policy.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsletterCta;
