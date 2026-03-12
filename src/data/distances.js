import { cities } from './cities';

/**
 * Calculate the great-circle distance between two points using the Haversine formula.
 * @returns Distance in miles.
 */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth's radius in miles
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Get the straight-line distance in miles between two cities by slug.
 * @returns Distance in miles, rounded to the nearest integer.
 */
export function getDistance(citySlugA, citySlugB) {
  const cityA = cities.find((c) => c.slug === citySlugA);
  const cityB = cities.find((c) => c.slug === citySlugB);

  if (!cityA || !cityB) {
    return 0;
  }

  const miles = haversine(cityA.lat, cityA.lng, cityB.lat, cityB.lng);
  return Math.round(miles);
}

/**
 * Estimate driving hours for a given distance in miles.
 * Uses 55 mph average highway speed with a 1.15x multiplier for non-direct routing.
 * @returns Estimated driving hours, rounded to 1 decimal place.
 */
export function getDrivingEstimate(miles) {
  const hours = (miles / 55) * 1.15;
  return Math.round(hours * 10) / 10;
}

/**
 * Get full distance info between two cities.
 * @returns {{ miles: number, drivingHours: number, isLocal: boolean }}
 */
export function getDistanceInfo(citySlugA, citySlugB) {
  const miles = getDistance(citySlugA, citySlugB);
  const drivingHours = getDrivingEstimate(miles);
  const isLocal = miles < 100;

  return { miles, drivingHours, isLocal };
}
