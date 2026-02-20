import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES } from '../lib/articles';

interface BreadcrumbsProps {
    categorySlug: string;
    articleTitle: string;
}

const Breadcrumbs = ({ categorySlug, articleTitle }: BreadcrumbsProps) => {
    const category = CATEGORIES.find(c => c.slug === categorySlug);

    if (!category) return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <li>
                    <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                <li>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </li>
                <li>
                    <Link
                        href={`/${category.slug}`}
                        className="hover:text-primary font-medium text-gray-700 transition-colors whitespace-nowrap"
                    >
                        {category.title}
                    </Link>
                </li>
                <li>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </li>
                <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                    {articleTitle}
                </li>
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
