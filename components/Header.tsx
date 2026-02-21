'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, X, ChevronRight, ChevronUp } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  navData: {
    budgeting: any[];
    savings: any[];
    energy: any[];
    broadband: any[];
    earning: any[];
    costOfLiving: any[];
    supermarket: any[];
    credit: any[];
    housing: any[];
    insurance: any[];
    family: any[];
  }
}

const Header = ({ navData }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const headerRef = useRef<HTMLElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
    setSearchOpen(false);
  }, [pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const toggleDropdown = (key: string) => {
    if (activeDropdown === key) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(key);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Budgeting', href: '/budgeting', type: 'link' },
    { label: 'Savings', href: '/savings-and-investing', type: 'link' },
    {
      label: 'Bills & Subscriptions',
      type: 'dropdown',
      key: 'bills',
      items: [
        {
          label: 'Energy Bills',
          href: '/energy-bills',
          desc: 'Cut your energy costs',
          articles: navData.energy
        },
        {
          label: 'Broadband',
          href: '/broadband-and-subscriptions',
          desc: 'Cheaper internet & TV',
          articles: navData.broadband
        }
      ]
    },
    {
      label: 'Earning More',
      href: '/earning-and-benefits',
      type: 'link'
    },
    {
      label: 'Life Costs',
      type: 'dropdown',
      key: 'life',
      items: [
        { label: 'Cost of Living', href: '/cost-of-living', desc: 'Survival strategies', articles: navData.costOfLiving },
        { label: 'Housing', href: '/housing', desc: 'Mortgages & Rent', articles: navData.housing },
        { label: 'Insurance', href: '/insurance', desc: 'Car & Life cover', articles: navData.insurance },
      ]
    },
    {
      label: 'More',
      type: 'dropdown',
      key: 'more',
      items: [
        { label: 'Supermarket', href: '/supermarket-savings', desc: 'Food hacks', articles: navData.supermarket },
        { label: 'Credit & Debt', href: '/credit-cards-and-debt', desc: 'Clear debt fast', articles: navData.credit },
        { label: 'Family', href: '/family-and-lifestyle', desc: 'Kids & Travel', articles: navData.family },
      ]
    },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm"
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <div className="relative flex h-[68px] w-[68px] items-center justify-center logo-float">
              <Image
                src="/logo.png"
                alt="The Smug Saver"
                width={68}
                height={68}
                className="object-contain"
              />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-neutral-dark">
              The Smug Saver
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.type === 'dropdown' && handleMouseEnter(item.key!)}
                onMouseLeave={handleMouseLeave}
              >
                {item.type === 'link' ? (
                  <Link
                    href={item.href!}
                    className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleDropdown(item.key!)}
                    className={`flex items-center gap-1 rounded-md px-4 py-2 text-sm font-bold transition-colors hover:bg-gray-50 hover:text-primary ${activeDropdown === item.key ? 'text-primary bg-gray-50' : 'text-gray-700'}`}
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.key ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Mega Menu Dropdown */}
                {item.type === 'dropdown' && activeDropdown === item.key && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px]">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-6 grid grid-cols-2 gap-8 ring-1 ring-black/5">
                      {item.items!.map((subItem) => (
                        <div key={subItem.label} className="space-y-4">
                          <Link href={subItem.href} className="group/cat block">
                            <h4 className="font-serif font-bold text-lg text-neutral-dark group-hover/cat:text-primary transition-colors flex items-center">
                              {subItem.label} <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover/cat:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-xs text-cat-desc text-gray-500 mb-3">{subItem.desc}</p>
                          </Link>

                          <ul className="space-y-2">
                            {subItem.articles && subItem.articles.slice(0, 3).map((article: any) => (
                              <li key={article.slug}>
                                <Link
                                  href={`/${article.category}/${article.slug}`}
                                  className="text-sm text-gray-600 hover:text-primary hover:underline line-clamp-1 block"
                                >
                                  {article.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
              aria-label="Search"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 z-50 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-md p-4 animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="container mx-auto max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden pt-24 px-6 overflow-y-auto animate-fadeIn">
          <nav className="flex flex-col gap-2 pb-10">
            {navLinks.map((item) => (
              <div key={item.label} className="border-b border-gray-100 last:border-0">
                {item.type === 'link' ? (
                  <Link
                    href={item.href!}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-lg font-bold text-gray-800"
                  >
                    {item.label}
                    <ChevronRight className="h-5 w-5 text-gray-300" />
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.key ? null : item.key!)}
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-lg font-bold text-gray-800"
                    >
                      {item.label}
                      {mobileExpanded === item.key ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-300" />
                      )}
                    </button>

                    {/* Mobile Submenu */}
                    {mobileExpanded === item.key && (
                      <div className="bg-gray-50 rounded-lg mx-4 mb-4 p-4 space-y-4">
                        {item.items!.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block"
                          >
                            <h4 className="font-bold text-neutral-dark mb-1 flex items-center">
                              {subItem.label}
                              <ChevronRight className="w-3 h-3 ml-2 text-primary" />
                            </h4>
                            <p className="text-sm text-gray-500">{subItem.desc}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
