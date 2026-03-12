'use client';
import { useState } from 'react';
import { MenuIcon, CloseIcon, TruckIcon, MapPinIcon, ClipboardIcon, ChartIcon, HomeIcon, InfoIcon } from './icons';

const navLinks = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/moving-from/houston-tx/', label: 'Routes', Icon: TruckIcon },
  { href: '/moving-to/austin-tx/', label: 'City Guides', Icon: MapPinIcon },
  { href: '/checklist/', label: 'Checklist', Icon: ClipboardIcon },
  { href: '/movers/new-york-ny/', label: 'Movers', Icon: ChartIcon },
  { href: '/methodology/', label: 'Methodology', Icon: InfoIcon },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
        aria-label="Open menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition"
                aria-label="Close menu"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition font-medium"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
