import { cities } from '../data/site-data';

const BASE = 'https://movecostguide.us';

export default function sitemap() {
  const now = new Date().toISOString();

  const staticPages = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/checklist/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tips/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/methodology/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const movingToPages = cities.map(c => ({
    url: `${BASE}/moving-to/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const movingFromPages = cities.map(c => ({
    url: `${BASE}/moving-from/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const moversPages = cities.map(c => ({
    url: `${BASE}/movers/${c.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const routePages = [];
  for (const origin of cities) {
    for (const dest of cities) {
      if (origin.slug !== dest.slug) {
        routePages.push({
          url: `${BASE}/moving-from/${origin.slug}/to/${dest.slug}/`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  }

  return [...staticPages, ...movingToPages, ...movingFromPages, ...moversPages, ...routePages];
}
