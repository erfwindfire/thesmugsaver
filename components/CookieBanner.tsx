'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) setVisible(true);
    }, []);

    function accept() {
        localStorage.setItem('cookie-consent', 'accepted');
        setVisible(false);
    }

    function decline() {
        localStorage.setItem('cookie-consent', 'declined');
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 md:p-6">
                <p className="text-sm text-gray-300 flex-1 leading-relaxed">
                    We use cookies to improve your experience and analyse site traffic. By clicking &ldquo;Accept&rdquo; you agree to our{' '}
                    <Link href="/cookie-policy" className="underline text-emerald-400 hover:text-emerald-300 transition-colors">
                        Cookie Policy
                    </Link>.
                </p>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={decline}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="px-5 py-2 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
