import Link from 'next/link';
import { cities, SITE_NAME } from '../../../data/site-data';
import { getQuickEstimate } from '../../../data/moving-costs';
import { getDistanceInfo } from '../../../data/distances';
import { cityData } from '../../../data/city-data';
import { HomeIcon, ChevronRightIcon, MapPinIcon, ThermometerIcon, DollarIcon, KeyIcon, BuildingIcon, ArrowRightIcon } from '../../../components/icons';

// ---------------------------------------------------------------------------
// Static params — 100 destination city pages
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export function generateMetadata({ params }) {
  const { city } = params;
  const c = cities.find((x) => x.slug === city);

  if (!c) {
    return { title: 'City Not Found' };
  }

  const title = `Moving to ${c.name}, ${c.stateCode}: Complete Guide (2026)`;
  const description = `Everything you need to know about moving to ${c.name}, ${c.stateCode}. Average moving costs, cost of living, top neighborhoods, and estimates from major US cities.`;

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

function formatTaxRate(rate) {
  if (rate === 0) return 'None';
  return (rate * 100).toFixed(1) + '%';
}

// ---------------------------------------------------------------------------
// Related "moving-to" pages shown at the bottom
// ---------------------------------------------------------------------------
const relatedCitySlugs = [
  'new-york-ny',
  'los-angeles-ca',
  'chicago-il',
  'houston-tx',
  'phoenix-az',
  'dallas-tx',
  'austin-tx',
  'san-francisco-ca',
  'seattle-wa',
  'denver-co',
  'miami-fl',
  'nashville-tn',
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function MovingToCityPage({ params }) {
  const { city } = params;
  const destCity = cities.find((c) => c.slug === city);

  if (!destCity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">City Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn&apos;t find a city matching &ldquo;{city}&rdquo;.</p>
        <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const enrichment = cityData[destCity.slug] || null;

  // Top 10 origins by population (excluding destination itself)
  const topOrigins = cities
    .filter((c) => c.slug !== destCity.slug)
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
    .map((originCity) => {
      const dist = getDistanceInfo(originCity.slug, destCity.slug);
      const est = getQuickEstimate(originCity, destCity);
      return { city: originCity, dist, est };
    });

  // Grid of 12 origin city cards with estimated costs
  const originCards = cities
    .filter((c) => c.slug !== destCity.slug)
    .sort((a, b) => b.population - a.population)
    .slice(0, 12)
    .map((originCity) => {
      const dist = getDistanceInfo(originCity.slug, destCity.slug);
      const est = getQuickEstimate(originCity, destCity);
      return { city: originCity, dist, est };
    });

  // Related cities (excluding current city)
  const relatedCities = relatedCitySlugs
    .filter((s) => s !== destCity.slug)
    .map((s) => cities.find((c) => c.slug === s))
    .filter(Boolean)
    .slice(0, 10);

  const nationalAvgCostIndex = 100;
  const costIndexDisplay = enrichment ? enrichment.costOfLivingIndex : Math.round(destCity.costIndex * 100);
  const costDiff = costIndexDisplay - nationalAvgCostIndex;
  const costLabel = costDiff > 0 ? `${costDiff}% above` : costDiff < 0 ? `${Math.abs(costDiff)}% below` : 'at';

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
        <span className="text-gray-800 font-medium">Moving to {destCity.name}</span>
      </nav>

      {/* ── H1 ── */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3 mb-6">
          <KeyIcon className="w-8 h-8 text-orange-500 flex-shrink-0" />
          Moving to {destCity.name}, {destCity.stateCode}
        </h1>

        {/* ── City Overview Card ── */}
        <div className="card-elevated p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-orange-500" />
            City Overview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <DollarIcon className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Cost of Living</p>
              <p className="text-lg font-bold text-gray-900">{costIndexDisplay}</p>
            </div>

            {enrichment && (
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <ThermometerIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Temperature</p>
                <p className="text-lg font-bold text-gray-900">{enrichment.avgTempLow}&deg;–{enrichment.avgTempHigh}&deg;F</p>
              </div>
            )}

            {enrichment && (
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <DollarIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500 uppercase tracking-wide">State Income Tax</p>
                <p className="text-lg font-bold text-gray-900">{formatTaxRate(enrichment.stateIncomeTax)}</p>
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <BuildingIcon className="w-5 h-5 text-slate-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500 uppercase tracking-wide">Population</p>
              <p className="text-lg font-bold text-gray-900">{formatPopulation(destCity.population)}</p>
            </div>
          </div>

          {/* Vibe description */}
          {enrichment?.vibe && (
            <p className="text-gray-600 leading-relaxed mb-4">{enrichment.vibe}</p>
          )}

          {/* Top neighborhoods as pills */}
          {enrichment?.topNeighborhoods && enrichment.topNeighborhoods.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {enrichment.topNeighborhoods.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Average Moving Costs Table ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Average Moving Costs to {destCity.name}
        </h2>
        <p className="text-gray-600 mb-6">
          Estimated costs for a 2-bedroom move from the top 10 US cities by population.
        </p>

        <div className="overflow-x-auto">
          <table className="table-pro w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-sm text-gray-600 font-semibold">From</th>
                <th className="px-4 py-3 text-sm text-gray-600 font-semibold">Distance</th>
                <th className="px-4 py-3 text-sm text-gray-600 font-semibold">Full-Service</th>
                <th className="px-4 py-3 text-sm text-gray-600 font-semibold">DIY</th>
              </tr>
            </thead>
            <tbody>
              {topOrigins.map((o) => (
                <tr key={o.city.slug} className="border-t border-gray-100 hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/moving-from/${o.city.slug}/to/${destCity.slug}/`}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      {o.city.name}, {o.city.stateCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {o.dist.miles.toLocaleString()} mi
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {formatCurrency(o.est.fullService.low)}–{formatCurrency(o.est.fullService.high)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatCurrency(o.est.diy.low)}–{formatCurrency(o.est.diy.high)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Ad Slot: Mid ── */}
      <div className="ad-slot max-w-5xl mx-auto px-4 my-8" data-ad="mid" />

      {/* ── Neighborhoods Section ── */}
      {enrichment?.topNeighborhoods && enrichment.topNeighborhoods.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BuildingIcon className="w-6 h-6 text-orange-500" />
            Neighborhoods in {destCity.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrichment.topNeighborhoods.map((neighborhood) => (
              <div key={neighborhood} className="card-elevated p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{neighborhood}</h3>
                <p className="text-sm text-gray-600">
                  A popular neighborhood in {destCity.name}, {destCity.stateCode} for newcomers and residents alike.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Cost of Living Section ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <DollarIcon className="w-6 h-6 text-orange-500" />
          Cost of Living in {destCity.name}
        </h2>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-extrabold text-gray-900">{costIndexDisplay}</div>
            <div>
              <p className="text-sm text-gray-500">Cost of Living Index</p>
              <p className="text-sm font-medium text-gray-700">
                {costLabel} the national average of 100
              </p>
            </div>
          </div>

          {/* Visual bar */}
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: `${Math.min(costIndexDisplay, 150)}%`,
                maxWidth: '100%',
                background: costDiff > 10
                  ? 'linear-gradient(90deg, #f97316, #ef4444)'
                  : costDiff < -10
                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                    : 'linear-gradient(90deg, #f97316, #fb923c)',
              }}
            />
            {/* National average marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-gray-800"
              style={{ left: `${(100 / 150) * 100}%` }}
              title="National Average (100)"
            />
          </div>
          <p className="text-xs text-gray-400">Index: 100 = national average. Scale capped at 150.</p>

          {/* Quick housing stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg 1BR Rent</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(destCity.averageRent1BR)}/mo</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg 2BR Rent</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(destCity.averageRent2BR)}/mo</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Moving to {City} from these cities ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Moving to {destCity.name} from These Cities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {originCards.map((o, idx) => {
            const delay = Math.min(idx * 0.03, 0.5);
            return (
              <Link
                key={o.city.slug}
                href={`/moving-from/${o.city.slug}/to/${destCity.slug}/`}
                className="card-elevated p-5 block animate-on-scroll"
                style={{ transitionDelay: `${delay}s` }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  From {o.city.name}, {o.city.stateCode}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {o.dist.miles.toLocaleString()} miles
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Full-Service</p>
                    <p className="text-base font-bold text-gray-900">
                      {formatCurrency(o.est.fullService.low)}–{formatCurrency(o.est.fullService.high)}
                    </p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-orange-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Related Cities ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Cities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {relatedCities.map((c) => (
            <Link
              key={c.slug}
              href={`/moving-to/${c.slug}/`}
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
