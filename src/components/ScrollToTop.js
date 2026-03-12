'use client';
import { useEffect, useState } from 'react';
import { ArrowUpIcon } from './icons';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-orange-500 text-white shadow-orange-glow hover:bg-orange-600 transition-all duration-300 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="w-5 h-5" />
    </button>
  );
}
