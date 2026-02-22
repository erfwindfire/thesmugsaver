import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { getArticlesByCategory } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'The Smug Saver - Smart Money Management',
  description: 'Get money-saving tips, budgeting strategies, and financial advice. Build wealth while living well.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-merriweather: 'Merriweather', serif;
          }
        `}</style>
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <Header navData={navData} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
