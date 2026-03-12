'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TruckIcon } from './icons';
import MobileMenu from './MobileMenu';

const links = [
  { href: '/', label: 'Home' },
  { href: '/checklist/', label: 'Checklist' },
  { href: '/methodology/', label: 'How It Works' },
];

export default function Header({ siteName }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-orange-500 rounded-lg text-white group-hover:bg-orange-600 transition">
            <TruckIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-gray-900">{siteName}</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(href)
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
