import { getDistanceInfo } from './distances';

// ---------------------------------------------------------------------------
// Home size options
// ---------------------------------------------------------------------------
export const homeSizes = [
  { id: 'studio', label: 'Studio', sqft: 500, weight: 2000, hours: 3, crew: 2 },
  { id: '1br', label: '1 Bedroom', sqft: 750, weight: 3500, hours: 4, crew: 2 },
  { id: '2br', label: '2 Bedroom', sqft: 1100, weight: 5000, hours: 5, crew: 3 },
  { id: '3br', label: '3 Bedroom', sqft: 1600, weight: 7500, hours: 7, crew: 3 },
  { id: '4br', label: '4 Bedroom', sqft: 2200, weight: 10000, hours: 9, crew: 4 },
  { id: '5br', label: '5+ Bedroom', sqft: 3000, weight: 14000, hours: 12, crew: 4 },
];

// ---------------------------------------------------------------------------
// Seasonal multipliers (month 0 = January, 11 = December)
// ---------------------------------------------------------------------------
export const seasonalMultipliers = {
  0: 0.85,  // January  — cheapest
  1: 0.90,  // February
  2: 0.90,  // March
  3: 1.05,  // April    — shoulder
  4: 1.20,  // May      — peak begins
  5: 1.25,  // June
  6: 1.30,  // July     — most expensive
  7: 1.25,  // August
  8: 1.10,  // September — shoulder
  9: 0.95,  // October  — off-peak
  10: 0.90, // November
  11: 0.90, // December
};

// ---------------------------------------------------------------------------
// Extras / add-on items
// ---------------------------------------------------------------------------
export const extras = [
  { id: 'piano', label: 'Piano', cost: 450 },
  { id: 'hottub', label: 'Hot Tub', cost: 800 },
  { id: 'pool-table', label: 'Pool Table', cost: 350 },
  { id: 'safe', label: 'Gun Safe / Heavy Safe', cost: 400 },
  { id: 'antiques', label: 'Antiques / Fine Art', cost: 300 },
  { id: 'packing', label: 'Full Packing Service', costMultiplier: 0.25 },
  { id: 'storage', label: 'Storage (1 month)', costMultiplier: 0.15 },
  { id: 'auto', label: 'Car Shipping', cost: 1200 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHomeSize(id) {
  return homeSizes.find((h) => h.id === id) || homeSizes[2]; // default 2BR
}

function range(low, high) {
  return { low, mid: (low + high) / 2, high };
}

function scaleRange(r, factor) {
  return {
    low: Math.round(r.low * factor),
    mid: Math.round(r.mid * factor),
    high: Math.round(r.high * factor),
  };
}

function addRanges(...ranges) {
  return ranges.reduce(
    (acc, r) => ({
      low: acc.low + r.low,
      mid: acc.mid + r.mid,
      high: acc.high + r.high,
    }),
    { low: 0, mid: 0, high: 0 },
  );
}

function roundRange(r) {
  return {
    low: Math.round(r.low),
    mid: Math.round(r.mid),
    high: Math.round(r.high),
  };
}

function calcExtras(selectedIds, subtotalRange) {
  if (!selectedIds || selectedIds.length === 0) {
    return { low: 0, mid: 0, high: 0 };
  }

  let total = { low: 0, mid: 0, high: 0 };

  for (const id of selectedIds) {
    const item = extras.find((e) => e.id === id);
    if (!item) continue;

    if (item.cost != null) {
      total.low += item.cost;
      total.mid += item.cost;
      total.high += item.cost;
    } else if (item.costMultiplier != null) {
      total.low += Math.round(subtotalRange.low * item.costMultiplier);
      total.mid += Math.round(subtotalRange.mid * item.costMultiplier);
      total.high += Math.round(subtotalRange.high * item.costMultiplier);
    }
  }

  return total;
}

function avgCostIndex(originCity, destCity) {
  const a = originCity?.costIndex ?? 1.0;
  const b = destCity?.costIndex ?? 1.0;
  return (a + b) / 2;
}

// ---------------------------------------------------------------------------
// Full-service long-distance (>= 100 miles)
// ---------------------------------------------------------------------------
function calcFullServiceLongDistance(home, miles, costIdx, month, selectedExtras) {
  const seasonal = seasonalMultipliers[month] ?? 1.0;

  const labor = roundRange({
    low: home.hours * home.crew * 35 * costIdx,
    mid: home.hours * home.crew * 40 * costIdx,
    high: home.hours * home.crew * 45 * costIdx,
  });

  const transportation = roundRange({
    low: 800 + miles * 0.50,
    mid: 1000 + miles * 0.65,
    high: 1200 + miles * 0.80,
  });

  const packing = roundRange({
    low: home.weight * 0.08,
    mid: home.weight * 0.115,
    high: home.weight * 0.15,
  });

  const baseSubtotal = addRanges(labor, transportation, packing);

  const insurance = roundRange({
    low: baseSubtotal.low * 0.03,
    mid: baseSubtotal.mid * 0.04,
    high: baseSubtotal.high * 0.05,
  });

  const tips = roundRange({
    low: labor.low * 0.08,
    mid: labor.mid * 0.10,
    high: labor.high * 0.12,
  });

  const extrasRange = calcExtras(selectedExtras, baseSubtotal);

  const preSeasonalTotal = addRanges(labor, transportation, packing, insurance, tips, extrasRange);
  const total = scaleRange(preSeasonalTotal, seasonal);

  return {
    total,
    breakdown: {
      labor: scaleRange(labor, seasonal),
      transportation: scaleRange(transportation, seasonal),
      packing: scaleRange(packing, seasonal),
      insurance: scaleRange(insurance, seasonal),
      tips: scaleRange(tips, seasonal),
      extras: scaleRange(extrasRange, seasonal),
    },
    seasonalMultiplier: seasonal,
  };
}

// ---------------------------------------------------------------------------
// Full-service local (< 100 miles)
// ---------------------------------------------------------------------------
function calcFullServiceLocal(home, miles, costIdx, month, selectedExtras) {
  const seasonal = seasonalMultipliers[month] ?? 1.0;

  const labor = roundRange({
    low: home.hours * home.crew * 28 * costIdx,
    mid: home.hours * home.crew * 33 * costIdx,
    high: home.hours * home.crew * 38 * costIdx,
  });

  const transportation = roundRange({
    low: 150 + miles * 2,
    mid: 250 + miles * 3,
    high: 350 + miles * 4,
  });

  const packing = roundRange({
    low: home.weight * 0.05,
    mid: home.weight * 0.075,
    high: home.weight * 0.10,
  });

  const baseSubtotal = addRanges(labor, transportation, packing);

  const insurance = roundRange({
    low: baseSubtotal.low * 0.02,
    mid: baseSubtotal.mid * 0.03,
    high: baseSubtotal.high * 0.04,
  });

  const tips = roundRange({
    low: labor.low * 0.08,
    mid: labor.mid * 0.10,
    high: labor.high * 0.12,
  });

  const extrasRange = calcExtras(selectedExtras, baseSubtotal);

  const preSeasonalTotal = addRanges(labor, transportation, packing, insurance, tips, extrasRange);
  const total = scaleRange(preSeasonalTotal, seasonal);

  return {
    total,
    breakdown: {
      labor: scaleRange(labor, seasonal),
      transportation: scaleRange(transportation, seasonal),
      packing: scaleRange(packing, seasonal),
      insurance: scaleRange(insurance, seasonal),
      tips: scaleRange(tips, seasonal),
      extras: scaleRange(extrasRange, seasonal),
    },
    seasonalMultiplier: seasonal,
  };
}

// ---------------------------------------------------------------------------
// Partial service (labor only, customer packs)
// ---------------------------------------------------------------------------
function calcPartialService(home, miles, costIdx, month, selectedExtras) {
  const isLocal = miles < 100;
  const seasonal = seasonalMultipliers[month] ?? 1.0;
  const reducedHours = home.hours * 0.8;

  let labor, transportation;

  if (isLocal) {
    labor = roundRange({
      low: reducedHours * home.crew * 28 * costIdx,
      mid: reducedHours * home.crew * 33 * costIdx,
      high: reducedHours * home.crew * 38 * costIdx,
    });
    transportation = roundRange({
      low: 150 + miles * 2,
      mid: 250 + miles * 3,
      high: 350 + miles * 4,
    });
  } else {
    labor = roundRange({
      low: reducedHours * home.crew * 35 * costIdx,
      mid: reducedHours * home.crew * 40 * costIdx,
      high: reducedHours * home.crew * 45 * costIdx,
    });
    transportation = roundRange({
      low: 800 + miles * 0.50,
      mid: 1000 + miles * 0.65,
      high: 1200 + miles * 0.80,
    });
  }

  const packing = { low: 0, mid: 0, high: 0 };

  const baseSubtotal = addRanges(labor, transportation);

  const insuranceRate = isLocal ? [0.02, 0.03, 0.04] : [0.03, 0.04, 0.05];
  const insurance = roundRange({
    low: baseSubtotal.low * insuranceRate[0],
    mid: baseSubtotal.mid * insuranceRate[1],
    high: baseSubtotal.high * insuranceRate[2],
  });

  const tips = roundRange({
    low: labor.low * 0.08,
    mid: labor.mid * 0.10,
    high: labor.high * 0.12,
  });

  const extrasRange = calcExtras(selectedExtras, baseSubtotal);

  const preSeasonalTotal = addRanges(labor, transportation, packing, insurance, tips, extrasRange);
  const total = scaleRange(preSeasonalTotal, seasonal);

  return {
    total,
    breakdown: {
      labor: scaleRange(labor, seasonal),
      transportation: scaleRange(transportation, seasonal),
      packing,
      insurance: scaleRange(insurance, seasonal),
      tips: scaleRange(tips, seasonal),
      extras: scaleRange(extrasRange, seasonal),
    },
    seasonalMultiplier: seasonal,
  };
}

// ---------------------------------------------------------------------------
// DIY move
// ---------------------------------------------------------------------------
function calcDIY(home, miles) {
  const isLocal = miles < 100;

  let truckRental;
  if (isLocal) {
    truckRental = range(50, 100);
  } else {
    // Scale truck rental cost by distance for long-distance moves
    const distFactor = Math.min(miles / 2000, 1);
    truckRental = roundRange({
      low: 800 + distFactor * 400,
      mid: 1250 + distFactor * 650,
      high: 2500 + distFactor * 0,
    });
    // Simplify: linear interpolation based on distance
    truckRental = roundRange({
      low: 800 + (miles / 3000) * 700,
      mid: 1200 + (miles / 3000) * 1000,
      high: 1700 + (miles / 3000) * 800,
    });
  }

  // Gas: miles * 2 (round-trip factor) / 8 mpg * gas price
  const gas = roundRange({
    low: (miles * 2) / 8 * 3.50,
    mid: (miles * 2) / 8 * 4.00,
    high: (miles * 2) / 8 * 4.50,
  });

  const equipment = range(100, 300);

  const insurance = range(50, 150);

  const labor = { low: 0, mid: 0, high: 0 };
  const packing = { low: 0, mid: 0, high: 0 };
  const tips = { low: 0, mid: 0, high: 0 };

  const total = roundRange(
    addRanges(truckRental, gas, equipment, insurance),
  );

  return {
    total,
    breakdown: {
      labor,
      transportation: roundRange(addRanges(truckRental, gas)),
      packing,
      insurance: roundRange(insurance),
      tips,
      extras: { low: 0, mid: 0, high: 0 },
    },
    seasonalMultiplier: 1.0,
  };
}

// ---------------------------------------------------------------------------
// Main calculation function
// ---------------------------------------------------------------------------
export function calculateMovingCost(originCity, destCity, options = {}) {
  const {
    homeSize = '2br',
    month = new Date().getMonth(),
    extras: selectedExtras = [],
    moveType = 'full',
  } = options;

  const home = getHomeSize(homeSize);
  const distanceInfo = getDistanceInfo(originCity.slug, destCity.slug);
  const miles = distanceInfo?.miles ?? 0;
  const drivingHours = distanceInfo?.drivingHours ?? 0;
  const isLocal = miles < 100;
  const costIdx = avgCostIndex(originCity, destCity);

  let result;

  switch (moveType) {
    case 'diy':
      result = calcDIY(home, miles);
      break;
    case 'partial':
      result = calcPartialService(home, miles, costIdx, month, selectedExtras);
      break;
    case 'full':
    default:
      result = isLocal
        ? calcFullServiceLocal(home, miles, costIdx, month, selectedExtras)
        : calcFullServiceLongDistance(home, miles, costIdx, month, selectedExtras);
      break;
  }

  return {
    ...result,
    distance: { miles, drivingHours, isLocal },
    moveType,
  };
}

// ---------------------------------------------------------------------------
// Quick estimate for city hub pages (2BR, current month)
// ---------------------------------------------------------------------------
export function getQuickEstimate(originCity, destCity) {
  const currentMonth = new Date().getMonth();

  const full = calculateMovingCost(originCity, destCity, {
    homeSize: '2br',
    month: currentMonth,
    extras: [],
    moveType: 'full',
  });

  const diy = calculateMovingCost(originCity, destCity, {
    homeSize: '2br',
    month: currentMonth,
    extras: [],
    moveType: 'diy',
  });

  return {
    fullService: full.total,
    diy: diy.total,
  };
}
