import Link from 'next/link';
import { cities, SITE_NAME } from '../../../data/site-data';
import { getQuickEstimate } from '../../../data/moving-costs';
import { getDistanceInfo } from '../../../data/distances';
import { HomeIcon, ChevronRightIcon, MapPinIcon, TruckIcon, ArrowRightIcon } from '../../../components/icons';

// ---------------------------------------------------------------------------
// Static params — 100 origin city pages
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return cities.map((c) => ({ origin: c.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export function generateMetadata({ params }) {
  const { origin } = params;
  const city = cities.find((c) => c.slug === origin);

  if (!city) {
    return { title: 'City Not Found' };
  }

  const title = `Moving from ${city.name}, ${city.stateCode}: Costs to Every Major City (2026)`;
  const description = `Compare moving costs from ${city.name}, ${city.stateCode} to 99 other US cities. See estimated full-service and DIY prices, distances, and find the cheapest routes.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCurrency(n) {
  return '$' + Math.round(n).toLocaleString();
}

function formatPopulation(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toLocaleString();
}

// ---------------------------------------------------------------------------
// Popular origins shown at the bottom
// ---------------------------------------------------------------------------
const popularOriginSlugs = [
  'new-york-ny',
  'los-angeles-ca',
  'chicago-il',
  'houston-tx',
  'phoenix-az',
  'dallas-tx',
  'san-francisco-ca',
  'miami-fl',
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function MovingFromCityPage({ params }) {
  const { origin } = params;
  const originCity = cities.find((c) => c.slug === origin);

  if (!originCity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">City Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn&apos;t find a city matching &ldquo;{origin}&rdquo;.</p>
        <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  // Build destination data for all other 99 cities
  const destinations = cities
    .filter((c) => c.slug !== originCity.slug)
    .map((destCity) => {
      const dist = getDistanceInfo(originCity.slug, destCity.slug);
      const est = getQuickEstimate(originCity, destCity);
      return { city: destCity, dist, est };
    })
    .sort((a, b) => a.est.fullService.mid - b.est.fullService.mid);

  // Mark cheapest 3 and most expensive 3
  const cheapSlugs = new Set(destinations.slice(0, 3).map((d) => d.city.slug));
  const expensiveSlugs = new Set(destinations.slice(-3).map((d) => d.city.slug));

  // Popular origins (excluding current city)
  const popularOrigins = popularOriginSlugs
    .filter((s) => s !== originCity.slug)
    .map((s) => cities.find((c) => c.slug === s))
    .filter(Boolean)
    .slice(0, 8);

  return (
    <>
      {/* ── Ad Slot: Top ── */}
      <div className="ad-slot max-w-5xl mx-auto px-4 mt-6" data-ad="top" />

      {/* ── Breadcrumbs ── */}
      <nav className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <HomeIcon className="w-4 h-4" />
          Home
        </Link>
        <ChevronRightIcon className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-medium">Moving from {originCity.name}</span>
      </nav>

      {/* ── Hero / H1 ── */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3 mb-6">
          <MapPinIcon className="w-8 h-8 text-orange-500 flex-shrink-0" />
          Moving from {originCity.name}, {originCity.stateCode}
        </h1>

        {/* City info pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-200">
            Cost Index: {originCity.costIndex.toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200">
            Population: {formatPopulation(originCity.population)}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200">
            {originCity.state}
          </span>
        </div>

        <p className="text-gray-600 text-lg max-w-3xl">
          See estimated moving costs from {originCity.name}, {originCity.stateCode} to every other major US city.
          Cards are sorted cheapest first — based on a 2-bedroom full-service move.
        </p>
      </section>

      {/* ── Destination Grid ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TruckIcon className="w-6 h-6 text-orange-500" />
          Costs to 99 Cities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d, idx) => {
            const isCheap = cheapSlugs.has(d.city.slug);
            const isExpensive = expensiveSlugs.has(d.city.slug);
            const delay = Math.min(idx * 0.02, 0.5);

            let borderClass = '';
            if (isCheap) borderClass = 'border-green-400 ring-1 ring-green-200';
            else if (isExpensive) borderClass = 'border-orange-400 ring-1 ring-orange-200';

            return (
              <Link
                key={d.city.slug}
                href={`/moving-from/${originCity.slug}/to/${d.city.slug}/`}
                className={`card-elevated p-5 block animate-on-scroll ${borderClass}`}
                style={{ transitionDelay: `${delay}s` }}
              >
                {/* Badge */}
                {isCheap && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                    Budget-Friendly
                  </span>
                )}
                {isExpensive && (
                  <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                    Premium Route
                  </span>
                )}

                {/* Destination name */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {d.city.name}, {d.city.stateCode}
                </h3>

                {/* Distance */}
                <p className="text-sm text-gray-500 mb-3">
                  {d.dist.miles.toLocaleString()} miles &middot; ~{d.dist.drivingHours}h drive
                </p>

                {/* Cost range */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Full-Service Est.</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(d.est.fullService.low)}–{formatCurrency(d.est.fullService.high)}
                    </p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-orange-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Ad Slot: Mid ── */}
      <div className="ad-slot max-w-5xl mx-auto px-4 my-8" data-ad="mid" />

      {/* ── Popular Origins ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Origins</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularOrigins.map((c) => (
            <Link
              key={c.slug}
              href={`/moving-from/${c.slug}/`}
              className="card-elevated p-4 text-center hover:border-orange-300 transition-colors"
            >
              <MapPinIcon className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <span className="font-semibold text-gray-900 text-sm">{c.name}, {c.stateCode}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Ad Slot: Bottom ── */}
      <div className="ad-slot max-w-5xl mx-auto px-4 mb-8" data-ad="bottom" />
    </>
  );
}
