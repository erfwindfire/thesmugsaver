import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-neutral-dark text-white pt-16 pb-8 border-t border-white/10" style={{ backgroundColor: '#1B4D3E' }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Popular Topics */}
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-6 text-accent">Popular Topics</h3>
                        <ul className="space-y-3">
                            <li><Link href="/budgeting" className="text-gray-300 hover:text-white transition-colors">Budgeting</Link></li>
                            <li><Link href="/savings-and-investing" className="text-gray-300 hover:text-white transition-colors">Savings & Investing</Link></li>
                            <li><Link href="/energy-bills" className="text-gray-300 hover:text-white transition-colors">Energy Bills</Link></li>
                            <li><Link href="/supermarket-savings" className="text-gray-300 hover:text-white transition-colors">Supermarket Savings</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Money Help */}
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-6 text-accent">Money Help</h3>
                        <ul className="space-y-3">
                            <li><Link href="/credit-cards-and-debt" className="text-gray-300 hover:text-white transition-colors">Credit Cards & Debt</Link></li>
                            <li><Link href="/housing" className="text-gray-300 hover:text-white transition-colors">Housing</Link></li>
                            <li><Link href="/insurance" className="text-gray-300 hover:text-white transition-colors">Insurance</Link></li>
                            <li><Link href="/earning-and-benefits" className="text-gray-300 hover:text-white transition-colors">Earning & Benefits</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: More */}
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-6 text-accent">More</h3>
                        <ul className="space-y-3">
                            <li><Link href="/cost-of-living" className="text-gray-300 hover:text-white transition-colors">Cost of Living</Link></li>
                            <li><Link href="/broadband-and-subscriptions" className="text-gray-300 hover:text-white transition-colors">Broadband & Subscriptions</Link></li>
                            <li><Link href="/family-and-lifestyle" className="text-gray-300 hover:text-white transition-colors">Family & Lifestyle</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: About */}
                    <div>
                        <h3 className="font-serif font-bold text-lg mb-6 text-accent">About</h3>
                        <div className="flex items-center gap-2 mb-6">
                            <Image src="/logo.png" alt="The Smug Saver" width={32} height={32} className="object-contain" />
                            <span className="font-bold text-white">The Smug Saver</span>
                        </div>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                            <li><Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} The Smug Saver. All rights reserved. None of the information on this website constitutes financial advice.
                    </p>
                </div>
            </div>
        </footer>
    );
}
