import Link from 'next/link';
import { ArrowRight, Wallet, TrendingUp, PiggyBank, ShoppingCart, Zap, Home } from 'lucide-react';
import { getArticlesByCategory } from '@/lib/articles';

const FeatureGrid = () => {
    const featuredCategories = [
        {
            slug: 'budgeting',
            icon: <Wallet className="w-8 h-8 text-white" />,
            title: 'Budgeting',
            description: 'Master your money with proven budgeting techniques, apps, and automation strategies.',
            count: getArticlesByCategory('budgeting').length
        },
        {
            slug: 'earning-and-benefits',
            icon: <TrendingUp className="w-8 h-8 text-white" />,
            title: 'Earning & Benefits',
            description: 'Boost your income with side hustles, claim every benefit you\'re owed, and understand tax changes.',
            count: getArticlesByCategory('earning-and-benefits').length
        },
        {
            slug: 'savings-and-investing',
            icon: <PiggyBank className="w-8 h-8 text-white" />,
            title: 'Savings & Investing',
            description: 'Grow your wealth with high-yield accounts, bonds, bank hacks, and smart investment strategies.',
            count: getArticlesByCategory('savings-and-investing').length
        },
        {
            slug: 'supermarket-savings',
            icon: <ShoppingCart className="w-8 h-8 text-white" />,
            title: 'Supermarket Savings',
            description: 'Beat food inflation with smart shopping strategies, loyalty hacks, and meal planning.',
            count: getArticlesByCategory('supermarket-savings').length
        },
        {
            slug: 'energy-bills',
            icon: <Zap className="w-8 h-8 text-white" />,
            title: 'Energy Bills',
            description: 'Cut your energy costs with switching strategies, negotiation scripts, and efficiency hacks.',
            count: getArticlesByCategory('energy-bills').length
        },
        {
            slug: 'housing',
            icon: <Home className="w-8 h-8 text-white" />,
            title: 'Housing',
            description: 'Navigate the UK housing market — first-time buyer schemes, mortgage decisions, and rent strategies.',
            count: getArticlesByCategory('housing').length
        }
    ];

    const moreTopics = [
        { name: 'Cost of Living', slug: 'cost-of-living' },
        { name: 'Credit Cards & Debt', slug: 'credit-cards-and-debt' },
        { name: 'Broadband & Subscriptions', slug: 'broadband-and-subscriptions' },
        { name: 'Insurance', slug: 'insurance' },
        { name: 'Family & Lifestyle', slug: 'family-and-lifestyle' }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
                        Explore by Category
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find exactly what you need to save money in every area of your life.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {featuredCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/${cat.slug}`}
                            className="group block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary-light transition-colors shadow-lg shadow-primary/20">
                                        {cat.icon}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                        {cat.count} Articles
                                    </span>
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-neutral-dark mb-3 group-hover:text-primary transition-colors">
                                    {cat.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {cat.description}
                                </p>

                                <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wide">
                                    Explore Topic <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* More Topics */}
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-6 text-center">More Money-Saving Topics</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {moreTopics.map((topic) => (
                            <Link
                                key={topic.slug}
                                href={`/${topic.slug}`}
                                className="bg-white hover:bg-white hover:text-primary hover:border-primary text-gray-700 px-6 py-3 rounded-full border border-gray-200 font-medium transition-all shadow-sm hover:shadow-md"
                            >
                                {topic.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
