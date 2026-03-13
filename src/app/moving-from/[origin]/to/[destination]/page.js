import { cities, SITE_NAME } from '../../../../../data/site-data';
import { calculateMovingCost, homeSizes, seasonalMultipliers } from '../../../../../data/moving-costs';
import { getDistanceInfo } from '../../../../../data/distances';
import { cityData } from '../../../../../data/city-data';
import { movingCompanies } from '../../../../../data/moving-companies';
import MovingCalculator from '../../../../../components/MovingCalculator';
import CostBreakdown from '../../../../../components/CostBreakdown';
import SeasonalChart from '../../../../../components/SeasonalChart';
import CityCompare from '../../../../../components/CityCompare';
import RouteSchema from '../../../../../components/RouteSchema';
import AdUnit from '../../../../../components/AdUnit';
import { HomeIcon, ChevronRightIcon, MapPinIcon, TruckIcon, ChevronDownIcon, ClockIcon, RouteIcon, DollarIcon, CalendarIcon, CheckIcon, ArrowRightIcon, BoxIcon, ShieldIcon } from '../../../../../components/icons';

// ---------------------------------------------------------------------------
// Static params — generates ~9,900 pages (100 cities x 99 destinations)
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  const params = [];
  for (const origin of cities) {
    for (const dest of cities) {
      if (origin.slug !== dest.slug) {
        params.push({ origin: origin.slug, destination: dest.slug });
      }
    }
  }
  return params;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export function generateMetadata({ params }) {
  const { origin, destination } = params;
  const originCity = cities.find((c) => c.slug === origin);
  const destCity = cities.find((c) => c.slug === destination);

  if (!originCity || !destCity) {
    return { title: 'Route Not Found' };
  }

  const distance = getDistanceInfo(origin, destination);
  const cost = calculateMovingCost(originCity, destCity, { homeSize: '2br', month: 0, moveType: 'full' });

  const title = `Moving from ${originCity.name}, ${originCity.stateCode} to ${destCity.name}, ${destCity.stateCode}: Cost Guide (2026)`;
  const description = `How much does it cost to move from ${originCity.name} to ${destCity.name}? Average cost $${cost.total.low.toLocaleString()}–$${cost.total.high.toLocaleString()} for a 2-bedroom. Distance: ${distance.miles} miles. Free calculator & tips.`;

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

function getMoveCategory(miles) {
  if (miles < 100) return 'local';
  if (miles < 500) return 'medium';
  return 'long';
}

function getMoveLabel(category) {
  if (category === 'local') return 'Local Move';
  if (category === 'medium') return 'Medium Distance';
  return 'Long Distance';
}

function formatDriveTime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.25;
  const stars = [];
  for (let i = 0; i < full; i++) stars.push('full');
  if (half) stars.push('half');
  while (stars.length < 5) stars.push('empty');
  return stars;
}

function getMovingTips(category, originCity, destCity) {
  const tips = {
    local: [
      { title: 'Consider a DIY move', text: `At under 100 miles, renting a truck for your ${originCity.name} to ${destCity.name} move can save you 50–70% compared to full-service movers.` },
      { title: 'Move mid-week', text: 'Tuesday through Thursday moves are typically 15–25% cheaper than weekend moves, with better availability.' },
      { title: 'Declutter before you pack', text: 'Sell or donate items you no longer need. Less stuff means fewer boxes, a smaller truck, and a lower bill.' },
      { title: 'Get at least 3 quotes', text: 'Local moving company rates can vary dramatically. Always compare at least three in-home or video estimates.' },
      { title: 'Reserve your elevator', text: 'If you live in an apartment building, book the service elevator in advance to avoid delays and extra hourly charges.' },
    ],
    medium: [
      { title: 'Book 4–6 weeks ahead', text: `Medium-distance moves from ${originCity.name} to ${destCity.name} require more logistics. Early booking locks in better rates and your preferred date.` },
      { title: 'Consider a hybrid move', text: 'Pack your own boxes but hire movers for the heavy lifting and driving. This partial-service approach typically saves 30–40%.' },
      { title: 'Use wardrobe boxes', text: 'For a multi-hundred-mile move, wardrobe boxes keep clothing organized and wrinkle-free without the hassle of folding everything.' },
      { title: 'Plan your route', text: `The drive from ${originCity.name} to ${destCity.name} may take several hours. Plan rest stops and fuel stations, especially if driving a rental truck.` },
      { title: 'Protect your valuables', text: 'Transport important documents, jewelry, and electronics in your personal vehicle rather than the moving truck.' },
      { title: 'Check your insurance', text: 'Basic carrier liability covers only $0.60/lb. For a medium-distance move, consider full-value protection for your belongings.' },
    ],
    long: [
      { title: 'Get a binding estimate', text: `Long-distance moves from ${originCity.name} to ${destCity.name} can have surprise costs. A binding or not-to-exceed estimate protects you from a ballooning bill.` },
      { title: 'Move in winter to save big', text: 'January and February rates are 15–30% lower than the summer peak. If your timeline is flexible, a winter move from pays for itself.' },
      { title: 'Ship your car separately', text: `At ${getDistanceInfo(originCity.slug, destCity.slug).miles} miles, driving two vehicles is exhausting and expensive. Auto transport typically costs $800–$1,500 and eliminates wear on your car.` },
      { title: 'Inventory everything', text: 'Create a detailed, numbered inventory with photos before the movers arrive. This is essential for filing claims if anything goes missing or gets damaged.' },
      { title: 'Research your new city', text: `Before arriving in ${destCity.name}, research neighborhoods, school districts, and local utilities so you can hit the ground running.` },
      { title: 'Use a portable container', text: 'Companies like PODS or U-Pack let you pack on your schedule and can be more affordable than traditional long-distance movers.' },
    ],
  };
  return tips[category] || tips.long;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function MovingRoutePage({ params }) {
  const { origin, destination } = params;
  const originCity = cities.find((c) => c.slug === origin);
  const destCity = cities.find((c) => c.slug === destination);

  if (!originCity || !destCity) {
    return <div className="container py-20 text-center"><h1 className="text-2xl font-bold">Route not found</h1></div>;
  }

  const distance = getDistanceInfo(origin, destination);
  const currentMonth = new Date().getMonth();

  const fullService = calculateMovingCost(originCity, destCity, { homeSize: '2br', month: currentMonth, moveType: 'full' });
  const partialService = calculateMovingCost(originCity, destCity, { homeSize: '2br', month: currentMonth, moveType: 'partial' });
  const diy = calculateMovingCost(originCity, destCity, { homeSize: '2br', month: currentMonth, moveType: 'diy' });

  const moveCategory = getMoveCategory(distance.miles);
  const moveLabel = getMoveLabel(moveCategory);
  const tips = getMovingTips(moveCategory, originCity, destCity);

  const originData = cityData[origin] || {};
  const destData = cityData[destination] || {};

  const otherDestinations = cities.filter((c) => c.slug !== origin && c.slug !== destination).slice(0, 8);
  const otherOrigins = cities.filter((c) => c.slug !== destination && c.slug !== origin).slice(0, 8);

  const topMovers = movingCompanies.national.slice(0, 4);

  // Cheapest / most expensive months
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const cheapestMonth = Object.entries(seasonalMultipliers).reduce((a, b) => (b[1] < a[1] ? b : a));
  const priceyMonth = Object.entries(seasonalMultipliers).reduce((a, b) => (b[1] > a[1] ? b : a));

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Ad Slot: Top */}
      {/* ------------------------------------------------------------------ */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="container py-2">
          <AdUnit slot="top" />
        </div>
      </div>

      <div className="container py-8 md:py-12">
        {/* ---------------------------------------------------------------- */}
        {/* Breadcrumbs */}
        {/* ---------------------------------------------------------------- */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <a href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 transition-colors">
                <HomeIcon className="w-3.5 h-3.5" />
                Home
              </a>
            </li>
            <li><ChevronRightIcon className="w-4 h-4 text-gray-400" /></li>
            <li>
              <a href={`/moving-from/${origin}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 transition-colors">
                <MapPinIcon className="w-3.5 h-3.5" />
                Moving from {originCity.name}
              </a>
            </li>
            <li><ChevronRightIcon className="w-4 h-4 text-gray-400" /></li>
            <li>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                <TruckIcon className="w-3.5 h-3.5" />
                To {destCity.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* ---------------------------------------------------------------- */}
        {/* Hero Header */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-3">{moveLabel}</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                Moving from {originCity.name}, {originCity.stateCode} to {destCity.name}, {destCity.stateCode}
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-3xl mb-8">
                {distance.miles} miles &middot; {formatDriveTime(distance.drivingHours)} drive &middot; Estimated cost {formatCurrency(fullService.total.low)}–{formatCurrency(fullService.total.high)} for a 2-bedroom move
              </p>

              {/* Route Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  <RouteIcon className="w-4 h-4 text-blue-200" />
                  {distance.miles} miles
                </div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  <ClockIcon className="w-4 h-4 text-blue-200" />
                  {formatDriveTime(distance.drivingHours)} drive
                </div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                  <DollarIcon className="w-4 h-4 text-blue-200" />
                  Cost Index: {originCity.costIndex.toFixed(2)} &rarr; {destCity.costIndex.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <RouteSchema
            originCity={originCity}
            destCity={destCity}
            cost={fullService.total}
            distance={distance}
          />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Cost Summary Cards */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Cost Estimate: {originCity.name} to {destCity.name}
          </h2>
          <p className="text-gray-600 mb-8">Average costs for a 2-bedroom move. Use the calculator below for a custom quote.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Service */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg shadow-blue-100/50 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Full Service</h3>
                  <p className="text-xs text-gray-500">Movers handle everything</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-extrabold text-blue-600">{formatCurrency(fullService.total.mid)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Range: {formatCurrency(fullService.total.low)} – {formatCurrency(fullService.total.high)}
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Professional packing & unpacking</li>
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Loading, transport & unloading</li>
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> Basic valuation coverage</li>
              </ul>
            </div>

            {/* Partial Service */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <BoxIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Partial Service</h3>
                  <p className="text-xs text-gray-500">You pack, movers move</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-extrabold text-amber-600">{formatCurrency(partialService.total.mid)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Range: {formatCurrency(partialService.total.low)} – {formatCurrency(partialService.total.high)}
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> You pack your own boxes</li>
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> Movers load, transport & unload</li>
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> Save 20–35% vs. full service</li>
              </ul>
            </div>

            {/* DIY */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">DIY Move</h3>
                  <p className="text-xs text-gray-500">Rent a truck, do it yourself</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-extrabold text-emerald-600">{formatCurrency(diy.total.mid)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Range: {formatCurrency(diy.total.low)} – {formatCurrency(diy.total.high)}
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Truck rental + gas + equipment</li>
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> No labor costs — you do the lifting</li>
                <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> Full control over your schedule</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Interactive Calculator */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Custom Moving Calculator</h2>
            </div>
            <p className="text-gray-600 mb-8 ml-[52px]">
              Adjust home size, move type, and extras to get a personalized estimate for your {originCity.name} to {destCity.name} move.
            </p>
            <MovingCalculator originCity={originCity} destCity={destCity} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Ad Slot: After Calculator */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-16">
          <AdUnit slot="mid" />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Cost Breakdown Donut Chart */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Where Does Your Money Go?</h2>
            <p className="text-gray-600 mb-8">Full-service cost breakdown for a 2-bedroom {moveLabel.toLowerCase()} from {originCity.name} to {destCity.name}.</p>
            <CostBreakdown breakdown={fullService.breakdown} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Seasonal Pricing Chart */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Time to Move</h2>
            </div>
            <p className="text-gray-600 mb-2 ml-[52px]">
              Moving costs from {originCity.name} to {destCity.name} vary significantly by season.
            </p>
            <p className="text-sm text-gray-500 mb-8 ml-[52px]">
              <span className="text-emerald-600 font-semibold">{monthNames[parseInt(cheapestMonth[0])]}</span> is the cheapest month (save up to {Math.round((1 - cheapestMonth[1]) * 100)}%), while{' '}
              <span className="text-red-600 font-semibold">{monthNames[parseInt(priceyMonth[0])]}</span> is the most expensive (+{Math.round((priceyMonth[1] - 1) * 100)}%).
            </p>
            <SeasonalChart baseCost={fullService.total.mid} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Ad Slot: After Seasonal Chart */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-16">
          <AdUnit slot="mid" />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* City Comparison */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <CityCompare originCity={originCity} destCity={destCity} />
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Moving Tips */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {moveCategory === 'local' ? 'Local' : moveCategory === 'medium' ? 'Medium-Distance' : 'Long-Distance'} Moving Tips
          </h2>
          <p className="text-gray-600 mb-8">
            Expert advice for your {distance.miles}-mile move from {originCity.name} to {destCity.name}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Moving Companies */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {moveCategory === 'local' ? 'Finding Local Movers' : `Top Moving Companies for ${originCity.name} to ${destCity.name}`}
          </h2>

          {moveCategory === 'local' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-4">
              <p className="text-gray-700">
                For local moves under 100 miles, we recommend searching for movers in the {originCity.name} area.
                Local companies often provide better rates and more personalized service than national carriers for short-distance moves.
                Always get at least 3 in-home estimates and verify licensing through the FMCSA.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8">
                These nationally recognized movers service the {originCity.name} to {destCity.name} route. Compare their rates and read reviews before choosing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topMovers.map((company) => (
                  <div key={company.slug} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
                      <span className="text-sm font-semibold text-gray-500">{company.priceRange}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {getStars(company.rating).map((type, i) => (
                          <svg key={i} className={`w-4 h-4 ${type === 'full' ? 'text-yellow-400' : type === 'half' ? 'text-yellow-300' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{company.rating}</span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {company.specialties.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{s}</span>
                      ))}
                    </div>

                    {/* Pros */}
                    <ul className="space-y-1.5 mb-4">
                      {company.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={company.affiliateUrl}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Get a Free Quote <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FAQs */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 max-w-3xl">
            {[
              {
                q: `How much does it cost to move from ${originCity.name} to ${destCity.name}?`,
                a: `The average cost for a 2-bedroom full-service move from ${originCity.name}, ${originCity.stateCode} to ${destCity.name}, ${destCity.stateCode} ranges from ${formatCurrency(fullService.total.low)} to ${formatCurrency(fullService.total.high)}, with a typical cost around ${formatCurrency(fullService.total.mid)}. A DIY move with a rental truck averages ${formatCurrency(diy.total.mid)}. Actual costs depend on home size, time of year, and additional services.`,
              },
              {
                q: `How long does the drive from ${originCity.name} to ${destCity.name} take?`,
                a: `The distance from ${originCity.name} to ${destCity.name} is approximately ${distance.miles} miles. The estimated driving time is ${formatDriveTime(distance.drivingHours)}, though actual drive time may vary based on the route, traffic, and road conditions. Professional movers may take ${distance.isLocal ? '1 day' : `${Math.ceil(distance.drivingHours / 8)}–${Math.ceil(distance.drivingHours / 6)} days`} to deliver your belongings.`,
              },
              {
                q: `What's the cheapest month to move from ${originCity.name} to ${destCity.name}?`,
                a: `${monthNames[parseInt(cheapestMonth[0])]} is typically the cheapest month to move, with rates up to ${Math.round((1 - cheapestMonth[1]) * 100)}% below average. The most expensive month is ${monthNames[parseInt(priceyMonth[0])]}, when rates increase by about ${Math.round((priceyMonth[1] - 1) * 100)}%. Moving mid-week (Tuesday–Thursday) also helps reduce costs by 10–20%.`,
              },
              {
                q: 'Should I hire movers or do it myself?',
                a: `For a ${distance.miles}-mile move, ${moveCategory === 'local' ? 'a DIY move can save you significantly — rental trucks are affordable for short distances, and you can recruit friends to help' : moveCategory === 'medium' ? 'both options have merit. A DIY move saves money but requires significant effort over several hours of driving. Partial service (you pack, movers drive) offers a good balance' : 'hiring professional movers is usually worth the investment. The logistics of a long-distance move are complex, and the physical toll of driving a large truck hundreds of miles can be overwhelming'}. Compare your DIY cost of ~${formatCurrency(diy.total.mid)} vs. full-service at ~${formatCurrency(fullService.total.mid)} to decide.`,
              },
              {
                q: `How far is ${originCity.name} from ${destCity.name}?`,
                a: `${originCity.name}, ${originCity.stateCode} is approximately ${distance.miles} miles from ${destCity.name}, ${destCity.stateCode}. This is classified as a ${moveLabel.toLowerCase()} and the drive takes roughly ${formatDriveTime(distance.drivingHours)}.`,
              },
              {
                q: `What size moving truck do I need for a move from ${originCity.name} to ${destCity.name}?`,
                a: 'For a 2-bedroom home, a 15–17 foot truck is usually sufficient. For 3-bedroom homes, plan on a 20–22 foot truck. For 4+ bedrooms, you will likely need a 26-foot truck or may need to consider two trips. When in doubt, size up — packing a too-small truck wastes time and risks damage.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200 shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Related Routes */}
        {/* ---------------------------------------------------------------- */}
        <section className="mb-16 scroll-reveal">
          {/* Other destinations from origin */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Also moving from {originCity.name}?
            </h2>
            <p className="text-gray-600 mb-6">Explore other popular routes from {originCity.name}, {originCity.stateCode}.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {otherDestinations.map((city) => (
                <a
                  key={city.slug}
                  href={`/moving-from/${origin}/to/${city.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    To {city.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {city.stateCode} &middot; {getDistanceInfo(origin, city.slug).miles} mi
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Other origins to destination */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Moving to {destCity.name} from elsewhere?
            </h2>
            <p className="text-gray-600 mb-6">Compare moving costs from other cities to {destCity.name}, {destCity.stateCode}.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {otherOrigins.map((city) => (
                <a
                  key={city.slug}
                  href={`/moving-from/${city.slug}/to/${destination}`}
                  className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    From {city.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {city.stateCode} &middot; {getDistanceInfo(city.slug, destination).miles} mi
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Ad Slot: Bottom */}
        {/* ---------------------------------------------------------------- */}
        <AdUnit slot="bottom" />
      </div>
    </>
  );
}
