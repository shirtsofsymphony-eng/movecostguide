import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, cities } from '../data/site-data';
import Header from '../components/Header';
import ScrollAnimator from '../components/ScrollAnimator';
import ScrollToTop from '../components/ScrollToTop';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: {
    default: `${SITE_NAME} — Free Moving Cost Calculator & Comparison`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const footerRoutes = [
  { origin: 'new-york-ny', dest: 'los-angeles-ca', label: 'NYC to LA' },
  { origin: 'chicago-il', dest: 'houston-tx', label: 'Chicago to Houston' },
  { origin: 'san-francisco-ca', dest: 'seattle-wa', label: 'SF to Seattle' },
  { origin: 'dallas-tx', dest: 'austin-tx', label: 'Dallas to Austin' },
  { origin: 'miami-fl', dest: 'atlanta-ga', label: 'Miami to Atlanta' },
];

const footerCities = cities.slice(0, 6);

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3292877774103361" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-stone-50">
        <Header siteName={SITE_NAME} />

        <main className="flex-1">
          {children}
        </main>

        <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

        <footer className="bg-slate-900 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h3 className="font-semibold text-white mb-3">Popular Routes</h3>
                <ul className="space-y-2">
                  {footerRoutes.map(item => (
                    <li key={item.label}>
                      <a href={`/moving-from/${item.origin}/to/${item.dest}/`} className="text-gray-400 hover:text-orange-400 transition">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Top Cities</h3>
                <ul className="space-y-2">
                  {footerCities.map(c => (
                    <li key={c.slug}>
                      <a href={`/moving-to/${c.slug}/`} className="text-gray-400 hover:text-orange-400 transition">{c.name}, {c.stateCode}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Tools</h3>
                <ul className="space-y-2">
                  <li><a href="/checklist/" className="text-gray-400 hover:text-orange-400 transition">Moving Checklist</a></li>
                  <li><a href="/movers/new-york-ny/" className="text-gray-400 hover:text-orange-400 transition">Find Movers</a></li>
                  <li><a href="/methodology/" className="text-gray-400 hover:text-orange-400 transition">How We Calculate</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">{SITE_NAME}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">
                  Free moving cost calculator with estimates for 100+ US cities.
                  Compare full-service movers vs DIY and find the best time to move.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} {SITE_NAME}. Cost estimates are approximate and may vary.
                Always get multiple quotes from licensed movers.
              </p>
              <p className="mt-1">
                Some links on this site are affiliate links. <a href="/methodology/" className="hover:text-orange-400 underline transition">Learn more</a>.
              </p>
            </div>
          </div>
        </footer>

        <ScrollAnimator />
        <ScrollToTop />
      </body>
    </html>
  );
}
