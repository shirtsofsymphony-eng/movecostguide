import Link from 'next/link';
import { SITE_NAME } from '../../data/site-data';
import MovingChecklist from '../../components/MovingChecklist';
import { HomeIcon, ChevronRightIcon, ClipboardIcon } from '../../components/icons';

export const metadata = {
  title: `Free 8-Week Moving Checklist (2026) | ${SITE_NAME}`,
  description:
    'Interactive moving checklist with 41 tasks across 7 phases. Track your progress from 8 weeks before to your first week in your new home. Free, no signup required.',
};

export default function ChecklistPage() {
  return (
    <>
      {/* ── Breadcrumbs ── */}
      <nav className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="breadcrumb-pill">
          <HomeIcon className="w-3.5 h-3.5" />
          Home
        </Link>
        <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
        <span className="breadcrumb-pill bg-orange-50 text-orange-700">
          <ClipboardIcon className="w-3.5 h-3.5" />
          Moving Checklist
        </span>
      </nav>

      {/* ── Ad slot: top ── */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="ad-slot">Ad</div>
      </div>

      {/* ── Header ── */}
      <header className="max-w-4xl mx-auto px-4 pt-8 pb-6 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <ClipboardIcon className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Your Complete Moving Checklist
          </h1>
        </div>
        <p className="text-gray-500 max-w-xl mx-auto">
          41 tasks across 7 phases. Track your progress — your data saves automatically.
        </p>
      </header>

      {/* ── Checklist ── */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <MovingChecklist />
      </section>

      {/* ── Tips Section ── */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Pro Moving Tips
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <div className="card-elevated p-5">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold text-gray-800 mb-1">Pack Smart</h3>
            <p className="text-sm text-gray-500">
              Label every box on the top and side with its contents and destination room. Use
              color-coded tape per room so movers place boxes in the right spot immediately.
            </p>
          </div>
          <div className="card-elevated p-5">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-800 mb-1">Save Money</h3>
            <p className="text-sm text-gray-500">
              Move mid-month and mid-week for the lowest rates. Declutter before you move —
              fewer items means a smaller truck and lower costs.
            </p>
          </div>
          <div className="card-elevated p-5">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-800 mb-1">Stay Organized</h3>
            <p className="text-sm text-gray-500">
              Keep an essentials box with toiletries, chargers, snacks, and important documents.
              Pack it last and unpack it first on move-in day.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ad slot: bottom ── */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="ad-slot">Ad</div>
      </div>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16 text-center">
        <div className="card-warm p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to estimate your move?
          </h2>
          <p className="text-gray-500 mb-5">
            Get a free, instant cost estimate for your upcoming move.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Calculate Moving Costs
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
