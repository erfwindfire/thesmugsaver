import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchResults from './SearchResults';

export const metadata: Metadata = {
    title: 'Search - The Smug Saver',
    description: 'Search articles on The Smug Saver',
    robots: { index: false, follow: true },
};

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center">Searching...</div>}>
            <SearchResults />
        </Suspense>
    );
}
