import Link from 'next/link';
import { SITE_NAME } from '../../data/site-data';
import { HomeIcon, ChevronRightIcon, DollarIcon, CalendarIcon, ClipboardIcon, TruckIcon, BoxIcon, ShieldIcon } from '../../components/icons';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata = {
  title: `Moving Tips & Guides (2026) | ${SITE_NAME}`,
  description:
    'Expert moving tips, checklists, and guides to help you save money and stay organized during your next move. Updated for 2026.',
};

// ---------------------------------------------------------------------------
// Tip card data
// ---------------------------------------------------------------------------
const tipCards = [
  {
    title: 'How to Save Money on a Long-Distance Move',
    description:
      'Discover proven strategies to cut costs on your cross-country move, from timing your move to negotiating with movers.',
    href: '/methodology/',
    icon: 'dollar',
  },
  {
    title: 'Best Time to Move: Month-by-Month Guide',
    description:
      'Learn which months offer the lowest rates and best availability. Seasonal pricing can save you hundreds.',
    href: '/methodology/#seasonal',
    icon: 'calendar',
  },
  {
    title: 'Complete 8-Week Moving Checklist',
    description:
      'Stay on track with our interactive 41-task checklist covering every phase of your move from start to finish.',
    href: '/checklist/',
    icon: 'clipboard',
  },
  {
    title: 'DIY vs Full-Service: Which is Right for You?',
    description:
      'Compare the real costs, time, and effort of doing it yourself versus hiring professional movers.',
    href: '/moving-from/new-york-ny/to/los-angeles-ca/',
    icon: 'truck',
  },
  {
    title: 'How to Choose a Moving Company',
    description:
      'Red flags to avoid, questions to ask, and how to verify a mover is licensed and insured.',
    href: '/movers/new-york-ny/',
    icon: 'shield',
  },
  {
    title: "First-Time Mover's Guide",
    description:
      'Everything you need to know for your first big move — from budgeting to packing to settling in.',
    href: '/checklist/',
    icon: 'box',
  },
  {
    title: 'Moving with Pets: Tips & Tricks',
    description: null,
    href: null,
    icon: 'shield',
    staticTips: [
      'Visit the vet for a health check and updated records before moving day.',
      'Keep pets in a quiet, secure room while movers are loading and unloading.',
      'Pack a pet essentials bag with food, water, medication, and a favorite toy.',
      'Update microchip and tag information with your new address immediately.',
      'Gradually introduce pets to the new home, starting with one room at a time.',
    ],
  },
  {
    title: 'Packing Like a Pro',
    description: null,
    href: null,
    icon: 'box',
    staticTips: [
      'Start packing non-essentials at least 3 weeks before your move date.',
      'Use the heaviest items in small boxes and lighter items in large boxes.',
      'Wrap fragile items individually and fill empty space with packing paper or towels.',
      'Label every box on the top and at least one side with contents and destination room.',
      'Pack an essentials box with toiletries, chargers, snacks, and a change of clothes.',
    ],
  },
];

// ---------------------------------------------------------------------------
// Icon resolver
// ---------------------------------------------------------------------------
function CardIcon({ type, className }) {
  switch (type) {
    case 'dollar':
      return <DollarIcon className={className} />;
    case 'calendar':
      return <CalendarIcon className={className} />;
    case 'clipboard':
      return <ClipboardIcon className={className} />;
    case 'truck':
      return <TruckIcon className={className} />;
    case 'shield':
      return <ShieldIcon className={className} />;
    case 'box':
      return <BoxIcon className={className} />;
    default:
      return <ClipboardIcon className={className} />;
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function TipsPage() {
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
        <span className="text-gray-800 font-medium">Tips</span>
      </nav>

      {/* -- H1 -- */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Moving Tips &amp; Guides
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Whether you&apos;re moving across town or across the country, these guides will help you
          save money, stay organized, and avoid common pitfalls.
        </p>
      </section>

      {/* -- Tip Cards Grid -- */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipCards.map((card, idx) => {
            const delay = Math.min(idx * 0.04, 0.5);

            // Static content cards (no link)
            if (!card.href && card.staticTips) {
              return (
                <div
                  key={card.title}
                  className="card-elevated p-6 animate-on-scroll"
                  style={{ transitionDelay: `${delay}s` }}
                >
                  <CardIcon type={card.icon} className="w-8 h-8 text-orange-500 mb-3" />
                  <h2 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h2>
                  <ul className="space-y-2">
                    {card.staticTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold mt-0.5">
                          {i + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Linked cards
            return (
              <Link
                key={card.title}
                href={card.href}
                className="card-elevated p-6 block animate-on-scroll hover:border-orange-300 transition-colors group"
                style={{ transitionDelay: `${delay}s` }}
              >
                <CardIcon type={card.icon} className="w-8 h-8 text-orange-500 mb-3" />
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-orange-600">
                  Read more
                  <ChevronRightIcon className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* -- Ad Slot: Bottom -- */}
      <div className="ad-slot max-w-5xl mx-auto px-4 mb-8" data-ad="bottom" />
    </>
  );
}
