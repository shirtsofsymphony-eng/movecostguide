import Link from 'next/link';
import { SITE_NAME } from '../../data/site-data';
import { seasonalMultipliers } from '../../data/moving-costs';
import { HomeIcon, ChevronRightIcon, InfoIcon, ChartIcon, DollarIcon, CalendarIcon, ShieldIcon, CheckIcon } from '../../components/icons';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata = {
  title: `How We Calculate Moving Costs | Methodology | ${SITE_NAME}`,
  description:
    'Learn how MoveCostGuide calculates moving cost estimates. Our methodology uses distance, home size, seasonal factors, local cost indexes, and move type.',
};

// ---------------------------------------------------------------------------
// Month labels for seasonal table
// ---------------------------------------------------------------------------
const monthLabels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getSeasonColor(multiplier) {
  if (multiplier >= 1.25) return 'bg-red-100 text-red-800';
  if (multiplier >= 1.10) return 'bg-orange-100 text-orange-800';
  if (multiplier >= 1.00) return 'bg-yellow-100 text-yellow-800';
  if (multiplier >= 0.90) return 'bg-blue-100 text-blue-800';
  return 'bg-green-100 text-green-800';
}

function getSeasonLabel(multiplier) {
  if (multiplier >= 1.25) return 'Peak';
  if (multiplier >= 1.10) return 'High';
  if (multiplier >= 1.00) return 'Shoulder';
  if (multiplier >= 0.90) return 'Off-Peak';
  return 'Cheapest';
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function MethodologyPage() {
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
        <span className="text-gray-800 font-medium">Methodology</span>
      </nav>

      {/* -- H1 -- */}
      <section className="max-w-4xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3 mb-4">
          <InfoIcon className="w-8 h-8 text-orange-500 flex-shrink-0" />
          How We Calculate Moving Costs
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Transparency matters. Here&apos;s exactly how we generate our moving cost estimates so you
          can understand what drives the numbers and make informed decisions.
        </p>
      </section>

      {/* ================================================================== */}
      {/* 1. Our Approach                                                    */}
      {/* ================================================================== */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="card-elevated p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-orange-500" />
            Our Approach
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Every estimate on {SITE_NAME} is calculated using a model that factors in five core variables:
          </p>
          <ul className="space-y-2">
            {[
              'Distance between origin and destination cities',
              'Home size (which determines shipment weight and labor hours)',
              'Seasonal pricing factors based on time of year',
              'Local cost index reflecting regional wage and cost differences',
              'Move type: full-service, partial-service, or DIY truck rental',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            We produce a low-to-high range for each estimate, reflecting the natural variation in
            real-world moving costs depending on the specifics of your move.
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. Data Sources                                                    */}
      {/* ================================================================== */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="card-elevated p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-orange-500" />
            Data Sources
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our cost model is informed by a combination of public data and industry research:
          </p>
          <ul className="space-y-2">
            {[
              'Bureau of Labor Statistics (BLS) — regional wage data for moving laborers',
              'U.S. Census Bureau — housing data and metropolitan area statistics',
              'Industry rate surveys — aggregated pricing data from moving companies',
              'Public moving company pricing — published rate sheets and advertised ranges',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. Cost Factors                                                    */}
      {/* ================================================================== */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="card-warm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarIcon className="w-5 h-5 text-orange-500" />
            Cost Factors Explained
          </h2>

          <div className="space-y-6">
            {/* Distance */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Distance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Moves under 100 miles are classified as local moves, priced primarily by hourly labor
                rates plus a short-haul transportation fee. Moves of 100 miles or more are
                long-distance, priced by shipment weight and mileage. The 100-mile threshold is the
                industry-standard dividing line.
              </p>
            </div>

            {/* Home size */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Home Size</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Larger homes mean more weight and more labor hours. We use standard industry
                estimates: a studio averages around 2,000 lbs while a 5+ bedroom home can exceed
                14,000 lbs. Labor crew size and hours scale accordingly.
              </p>
            </div>

            {/* Seasonal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Seasonal Pricing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Moving demand peaks in summer (May&ndash;August) when prices can be 20&ndash;30%
                higher. Winter months (December&ndash;February) are the cheapest. We apply a monthly
                multiplier to reflect these swings. See the full table below.
              </p>
            </div>

            {/* Cost index */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Local Cost Index</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Labor rates vary significantly by metro area. A mover in San Francisco costs more
                per hour than one in Memphis. We assign each city a cost index (1.0 = national
                average) and use the average of the origin and destination indexes to adjust labor
                costs.
              </p>
            </div>

            {/* Move type */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Move Type</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Full-service</strong> includes packing, loading, transportation, unloading,
                and basic insurance. <strong>Partial-service</strong> (labor-only) skips packing
                &mdash; you pack, they load and haul. <strong>DIY</strong> is truck rental only: you
                handle everything yourself, paying only for the truck, fuel, and equipment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. Seasonal Pricing Table                                          */}
      {/* ================================================================== */}
      <section id="seasonal" className="max-w-4xl mx-auto px-4 pb-10">
        <div className="card-elevated p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-500" />
            Seasonal Pricing Multipliers
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            The table below shows how the time of year affects moving costs. A multiplier of 1.0
            represents the baseline. Values above 1.0 mean higher prices; below 1.0 means savings.
          </p>

          <div className="overflow-x-auto">
            <table className="table-pro w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-sm text-gray-600 font-semibold">Month</th>
                  <th className="px-4 py-3 text-sm text-gray-600 font-semibold">Multiplier</th>
                  <th className="px-4 py-3 text-sm text-gray-600 font-semibold">Impact</th>
                  <th className="px-4 py-3 text-sm text-gray-600 font-semibold">Season</th>
                </tr>
              </thead>
              <tbody>
                {monthLabels.map((month, idx) => {
                  const mult = seasonalMultipliers[idx];
                  const pctChange = Math.round((mult - 1) * 100);
                  const impact =
                    pctChange > 0
                      ? `+${pctChange}%`
                      : pctChange < 0
                        ? `${pctChange}%`
                        : 'Baseline';
                  const colorClass = getSeasonColor(mult);
                  const label = getSeasonLabel(mult);

                  return (
                    <tr key={month} className="border-t border-gray-100 hover:bg-orange-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{month}</td>
                      <td className="px-4 py-3 text-gray-700">{mult.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            pctChange > 0
                              ? 'bg-red-100 text-red-700'
                              : pctChange < 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {impact}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
                          {label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 5. Disclaimer                                                      */}
      {/* ================================================================== */}
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <div className="card-elevated p-6 border-l-4 border-yellow-400">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-yellow-500" />
            Disclaimer
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            All costs shown on {SITE_NAME} are estimates based on publicly available data and
            industry averages. Actual moving costs vary based on specific circumstances including
            the exact items being moved, access conditions at both locations, special handling
            requirements, and individual company pricing.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We strongly recommend getting at least three written quotes from licensed movers before
            making a decision. Our estimates are meant to give you a helpful starting point &mdash;
            not a guaranteed price.
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. Affiliate Disclosure                                            */}
      {/* ================================================================== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="card-elevated p-6 border-l-4 border-blue-400">
          <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-blue-500" />
            Affiliate Disclosure
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Some links on {SITE_NAME} are affiliate links, meaning we may earn a commission if you
            request a quote or make a purchase through them. This comes at no additional cost to you.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Affiliate relationships do not influence our rankings, recommendations, or cost
            estimates. Our editorial content and calculations are independent of any partnerships.
            We only recommend services that we believe provide genuine value to our users.
          </p>
        </div>
      </section>

      {/* -- Ad Slot: Bottom -- */}
      <div className="ad-slot max-w-5xl mx-auto px-4 mb-8" data-ad="bottom" />
    </>
  );
}
