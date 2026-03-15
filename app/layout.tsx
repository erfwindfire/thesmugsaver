import type { Metadata } from 'next'
import { Inter, Merriweather, Playfair_Display } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CookieBanner from '@/components/CookieBanner';
import { getArticlesByCategory } from '@/lib/articles';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'The Smug Saver - Smart Money Management',
  description: 'Get personalised money-saving tips, budgeting strategies, and financial advice.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch data for Mega Menu (Client Component)
  const navData = {
    budgeting: getArticlesByCategory('budgeting'),
    savings: getArticlesByCategory('savings-and-investing'),
    energy: getArticlesByCategory('energy-bills'),
    broadband: getArticlesByCategory('broadband-and-subscriptions'),
    earning: getArticlesByCategory('earning-and-benefits'),
    costOfLiving: getArticlesByCategory('cost-of-living'),
    supermarket: getArticlesByCategory('supermarket-savings'),
    credit: getArticlesByCategory('credit-cards-and-debt'),
    housing: getArticlesByCategory('housing'),
    insurance: getArticlesByCategory('insurance'),
    family: getArticlesByCategory('family-and-lifestyle'),
  };

  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} ${playfair.variable} font-sans min-h-screen flex flex-col`}>
        <Header navData={navData} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
