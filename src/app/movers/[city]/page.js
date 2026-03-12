import Link from 'next/link';
import { cities, SITE_NAME } from '../../../data/site-data';
import { movingCompanies } from '../../../data/moving-companies';
import { HomeIcon, ChevronRightIcon, MapPinIcon, StarIcon, TruckIcon, PhoneIcon, ExternalLinkIcon, ShieldIcon, BoxIcon, ArrowRightIcon, CheckIcon } from '../../../components/icons';

// ---------------------------------------------------------------------------
// Static params — 100 city pages
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

  const title = `Best Moving Companies in ${c.name}, ${c.stateCode} (2026) | ${SITE_NAME}`;
  const description = `Compare top-rated moving companies in ${c.name}, ${c.stateCode}. Read reviews, get free quotes, and find the best movers for your budget.`;

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
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={i} className="w-4 h-4 text-yellow-400" />);
  }
  if (rating % 1 >= 0.5) {
    stars.push(<StarIcon key="half" className="w-4 h-4 text-yellow-200" />);
  }
  return stars;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function MoversPage({ params }) {
  const { city } = params;
  const currentCity = cities.find((c) => c.slug === city);

  if (!currentCity) {
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

  // Related cities (8 other cities excluding current)
  const relatedCities = cities
    .filter((c) => c.slug !== currentCity.slug)
    .sort((a, b) => b.population - a.population)
    .slice(0, 8);

  return (
    <>
      {/* -- Ad Slot: Top -- */}
      <div className="ad-slot max-w-5xl mx-auto px-4 mt-6" data-ad="top" />

      {/* -- Breadcrumbs -- */}
      <nav className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <HomeIcon className="w-4 h-4" />
          Home
        </Link>
        <ChevronRightIcon className="w-3 h-3 text-gray-400" />
        <span className="hover:text-orange-600">Movers</span>
        <ChevronRightIcon className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-medium">{currentCity.name}</span>
      </nav>

      {/* -- H1 -- */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3 mb-4">
          <TruckIcon className="w-8 h-8 text-orange-500 flex-shrink-0" />
          Best Moving Companies in {currentCity.name}, {currentCity.stateCode}
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Planning a move in {currentCity.name}? Compare top-rated national moving companies and DIY
          truck rental options below. Get free quotes, read honest reviews, and find the right mover
          for your budget and timeline.
        </p>
      </section>

      {/* ================================================================== */}
      {/* National Moving Companies                                          */}
      {/* ================================================================== */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShieldIcon className="w-6 h-6 text-orange-500" />
          National Moving Companies
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {movingCompanies.national.map((company, idx) => {
            const delay = Math.min(idx * 0.04, 0.5);
            return (
              <div
                key={company.slug}
                className="card-elevated p-6 animate-on-scroll"
                style={{ transitionDelay: `${delay}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{company.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">{renderStars(company.rating)}</div>
                      <span className="text-sm text-gray-500 font-medium">{company.rating}</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {company.priceRange}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{company.description}</p>

                {/* Pros */}
                <ul className="space-y-1.5 mb-4">
                  {company.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {company.specialties.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={company.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all text-sm"
                >
                  Get Quote
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* -- Ad Slot: Mid -- */}
      <div className="ad-slot max-w-5xl mx-auto px-4 my-8" data-ad="mid" />

      {/* ================================================================== */}
      {/* DIY & Truck Rental Options                                         */}
      {/* ================================================================== */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BoxIcon className="w-6 h-6 text-orange-500" />
          DIY &amp; Truck Rental Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movingCompanies.diy.map((company, idx) => {
            const delay = Math.min(idx * 0.04, 0.5);
            return (
              <div
                key={company.slug}
                className="card-elevated p-6 animate-on-scroll"
                style={{ transitionDelay: `${delay}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                  <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {company.priceRange}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">{renderStars(company.rating)}</div>
                  <span className="text-sm text-gray-500 font-medium">{company.rating}</span>
                </div>

                {/* Truck sizes */}
                <div className="mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Truck Sizes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {company.truckSizes.map((size) => (
                      <span
                        key={size}
                        className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        <TruckIcon className="w-3 h-3 mr-1" />
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best for */}
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{company.bestFor}</p>

                {/* CTA */}
                <a
                  href={company.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm"
                >
                  Check Rates
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================== */}
      {/* Tips for Choosing a Mover                                          */}
      {/* ================================================================== */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShieldIcon className="w-6 h-6 text-orange-500" />
          Tips for Choosing a Mover in {currentCity.name}
        </h2>

        <div className="card-elevated p-6">
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-semibold text-gray-900">Get at least 3 in-home estimates</p>
                <p className="text-sm text-gray-600">In-person or video surveys are more accurate than phone quotes. Compare itemized breakdowns side by side.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-semibold text-gray-900">Check FMCSA registration and insurance</p>
                <p className="text-sm text-gray-600">Verify the company&apos;s USDOT number on the FMCSA website. Confirm they carry proper liability and cargo insurance.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-semibold text-gray-900">Read reviews from multiple sources</p>
                <p className="text-sm text-gray-600">Check Google, Yelp, BBB, and the FMCSA complaint database. Look for patterns rather than individual reviews.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">4</span>
              <div>
                <p className="font-semibold text-gray-900">Ask about liability coverage options</p>
                <p className="text-sm text-gray-600">Understand the difference between released value (free, minimal) and full value protection. Consider third-party moving insurance.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">5</span>
              <div>
                <p className="font-semibold text-gray-900">Get everything in writing before signing</p>
                <p className="text-sm text-gray-600">Ensure your estimate, pickup/delivery dates, and all services are documented. Avoid movers who only give verbal agreements.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Related Cities                                                     */}
      {/* ================================================================== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Movers in Other Cities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedCities.map((c) => (
            <Link
              key={c.slug}
              href={`/movers/${c.slug}/`}
              className="card-elevated p-4 text-center hover:border-orange-300 transition-colors"
            >
              <MapPinIcon className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <span className="font-semibold text-gray-900 text-sm">{c.name}, {c.stateCode}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* -- Ad Slot: Bottom -- */}
      <div className="ad-slot max-w-5xl mx-auto px-4 mb-8" data-ad="bottom" />
    </>
  );
}
