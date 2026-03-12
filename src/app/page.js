import Link from 'next/link';
import { cities, SITE_NAME } from '../data/site-data';
import { getQuickEstimate } from '../data/moving-costs';
import { getDistanceInfo } from '../data/distances';
import { checklistData } from '../data/checklist-data';
import RouteSearch from '../components/RouteSearch';
import AnimatedStats from '../components/AnimatedStats';
import {
  TruckIcon,
  MapPinIcon,
  DollarIcon,
  ClipboardIcon,
  CheckIcon,
  ArrowRightIcon,
  SearchIcon,
  ShieldIcon,
  ChartIcon,
  BoxIcon,
  CalendarIcon,
} from '../components/icons';

export const metadata = {
  title: 'MoveCostGuide — Free Moving Cost Calculator for 100+ US Cities',
  description:
    'Calculate your moving costs instantly. Free estimates for local and long-distance moves between 100+ US cities. Compare movers, find the cheapest month to move, and get an 8-week checklist.',
};

/* ─── Popular route pairs ─── */
const popularRoutes = [
  { origin: 'new-york-ny', dest: 'los-angeles-ca' },
  { origin: 'chicago-il', dest: 'houston-tx' },
  { origin: 'san-francisco-ca', dest: 'seattle-wa' },
  { origin: 'dallas-tx', dest: 'austin-tx' },
  { origin: 'miami-fl', dest: 'atlanta-ga' },
  { origin: 'denver-co', dest: 'phoenix-az' },
  { origin: 'boston-ma', dest: 'washington-dc' },
  { origin: 'portland-or', dest: 'las-vegas-nv' },
];

function cityBySlug(slug) {
  return cities.find((c) => c.slug === slug);
}

function fmt(n) {
  return n.toLocaleString('en-US');
}

export default function HomePage() {
  /* Pre-compute route data */
  const routeData = popularRoutes.map((r) => {
    const origin = cityBySlug(r.origin);
    const dest = cityBySlug(r.dest);
    const dist = getDistanceInfo(r.origin, r.dest);
    const est = getQuickEstimate(origin, dest);
    return { ...r, origin, dest, dist, est };
  });

  /* First 12 cities for explorer grid */
  const exploreCities = cities.slice(0, 12);

  /* Checklist preview: first 4 tasks from week-8 */
  const week8 = checklistData.find((w) => w.id === 'week-8');
  const previewTasks = week8 ? week8.tasks.slice(0, 4) : [];

  /* Total task count */
  const totalTasks = checklistData.reduce((sum, w) => sum + w.tasks.length, 0);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          1. HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-orange-950 hero-pattern py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-orange-300 text-sm font-medium mb-6">
            <TruckIcon className="w-4 h-4" />
            Free for 100+ US Cities
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Know Your <span className="gradient-text">Moving Costs</span>
            <br className="hidden sm:block" /> Before You Move
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Free estimates for 100+ US cities. Compare full-service movers,
            DIY options, and find the best time to move.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <RouteSearch variant="hero" />
          </div>

          <AnimatedStats />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2. POPULAR ROUTES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Popular Moving Routes
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              See estimated costs for the most common city-to-city moves across
              the United States.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {routeData.map((r, i) => (
              <Link
                key={`${r.origin.slug}-${r.dest.slug}`}
                href={`/moving-from/${r.origin.slug}/to/${r.dest.slug}/`}
                className="card-elevated p-5 group animate-on-scroll block"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <MapPinIcon className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="truncate">
                    {r.origin.name}, {r.origin.stateCode}
                  </span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {r.dest.name}, {r.dest.stateCode}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  {fmt(r.dist.miles)} miles &middot;{' '}
                  {r.dist.drivingHours} hrs driving
                </div>
                <div className="text-lg font-bold text-orange-600 group-hover:text-orange-700 transition">
                  ${fmt(r.est.fullService.low)} &ndash; $
                  {fmt(r.est.fullService.high)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Full-service &middot; 2 BR
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad Slot 1 ── */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="ad-slot" data-ad="homepage-mid-1">
          Advertisement
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          3. HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Get your personalized moving cost estimate in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector lines (decorative) */}
            <div className="hidden md:block absolute top-16 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-orange-300 to-amber-300" />
            <div className="hidden md:block absolute top-16 right-0 w-1/3 h-0.5 bg-gradient-to-r from-amber-300 to-orange-400" />

            {[
              {
                step: 1,
                title: 'Enter Your Route',
                icon: SearchIcon,
                desc: 'Tell us where you\u2019re moving from and to.',
              },
              {
                step: 2,
                title: 'Get Your Estimate',
                icon: DollarIcon,
                desc: 'See detailed cost breakdowns for full-service, partial, and DIY.',
              },
              {
                step: 3,
                title: 'Compare & Save',
                icon: ChartIcon,
                desc: 'Find the cheapest month, compare movers, and use our checklist.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="card-warm p-8 text-center animate-on-scroll"
              >
                <div className="relative mx-auto mb-5 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-orange-200">
                  {s.step}
                </div>
                <s.icon className="w-7 h-7 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4. CITY EXPLORER
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Explore Cities
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Dive into cost-of-living data, mover options, and moving tips for
              each destination.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {exploreCities.map((city, i) => {
              const pctVsAvg = Math.round((city.costIndex - 1) * 100);
              const label =
                pctVsAvg > 0
                  ? `${pctVsAvg}% above avg`
                  : pctVsAvg < 0
                    ? `${Math.abs(pctVsAvg)}% below avg`
                    : 'National avg';

              return (
                <Link
                  key={city.slug}
                  href={`/moving-to/${city.slug}/`}
                  className="card-elevated p-5 group animate-on-scroll block"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition">
                      <MapPinIcon className="w-4.5 h-4.5 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate group-hover:text-orange-600 transition">
                        {city.name}
                      </h3>
                      <p className="text-xs text-slate-400">{city.state}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span
                      className={
                        pctVsAvg > 0
                          ? 'text-red-500 font-medium'
                          : pctVsAvg < 0
                            ? 'text-emerald-600 font-medium'
                            : 'text-slate-500 font-medium'
                      }
                    >
                      {label}
                    </span>
                    <span className="text-slate-400">
                      Cost index {city.costIndex.toFixed(2)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/cities/"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition text-sm"
            >
              See all 100+ cities
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ad Slot 2 ── */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="ad-slot" data-ad="homepage-mid-2">
          Advertisement
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          5. CHECKLIST PREVIEW
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="md:flex md:items-center md:gap-12">
            {/* Left column */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-3 py-1 text-orange-700 text-xs font-semibold mb-4">
                <ClipboardIcon className="w-3.5 h-3.5" />
                Free Tool
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Free 8-Week Moving Checklist
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Stay organized from start to finish with our comprehensive
                moving checklist &mdash; {totalTasks} tasks across{' '}
                {checklistData.length} phases, from 8 weeks out through your
                first week in your new home.
              </p>
              <Link
                href="/checklist/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl transition-all"
              >
                View Full Checklist
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {/* Right column: task preview */}
            <div className="md:w-1/2">
              <div className="card-elevated p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  8 Weeks Before &mdash; Preview
                </h3>
                <ul className="space-y-3">
                  {previewTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <span className="mt-0.5 w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                        <CheckIcon className="w-3 h-3 text-orange-600" />
                      </span>
                      <span className="text-slate-700 leading-snug">
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
                  + {totalTasks - previewTasks.length} more tasks across all
                  phases
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          6. TRUST SIGNALS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Why {SITE_NAME}?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShieldIcon,
                title: 'Data-Driven Estimates',
                desc: 'Our calculations use real-world mover rates, distance data, and seasonal trends to produce reliable cost ranges.',
              },
              {
                icon: MapPinIcon,
                title: '100+ Cities Covered',
                desc: 'From New York to Anchorage, we cover major metros and mid-size cities across all 50 states.',
              },
              {
                icon: DollarIcon,
                title: 'Free Forever',
                desc: 'No sign-up required. Get unlimited estimates, checklists, and city comparisons at zero cost.',
              },
              {
                icon: CalendarIcon,
                title: 'Updated for 2026',
                desc: 'Our cost data reflects current market rates, seasonal pricing, and the latest industry standards.',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="card-elevated p-6 text-center animate-on-scroll"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-50 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad Slot 3 ── */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="ad-slot" data-ad="homepage-bottom">
          Advertisement
        </div>
      </div>
    </>
  );
}
