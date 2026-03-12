import { seasonalMultipliers } from '../data/moving-costs';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MAX_BAR_HEIGHT = 120;

function getBarColor(multiplier) {
  if (multiplier < 0.95) return '#10b981'; // green — cheapest
  if (multiplier > 1.15) return '#f97316'; // orange — expensive
  return '#3b82f6'; // blue — moderate
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export default function SeasonalChart({ baseCost }) {
  const currentMonth = new Date().getMonth();

  // Calculate costs and find max for scaling
  const months = MONTH_LABELS.map((label, i) => {
    const multiplier = seasonalMultipliers[i] ?? 1.0;
    const cost = baseCost * multiplier;
    return { label, index: i, multiplier, cost };
  });

  const maxCost = Math.max(...months.map((m) => m.cost));

  return (
    <div>
      {/* Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.35rem',
          height: MAX_BAR_HEIGHT + 30,
          paddingTop: 10,
        }}
      >
        {months.map((m) => {
          const height = maxCost > 0 ? (m.cost / maxCost) * MAX_BAR_HEIGHT : 0;
          const color = getBarColor(m.multiplier);
          const isCurrent = m.index === currentMonth;

          return (
            <div
              key={m.index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {/* Current month indicator */}
              {isCurrent && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#f97316',
                    marginBottom: 2,
                  }}
                />
              )}
              {!isCurrent && <div style={{ width: 6, height: 6, marginBottom: 2 }} />}

              {/* Bar */}
              <div
                className="season-bar"
                title={`${MONTH_LABELS[m.index]}: ${fmt(m.cost)} (${m.multiplier > 1 ? '+' : ''}${((m.multiplier - 1) * 100).toFixed(0)}%)`}
                style={{
                  width: '100%',
                  height,
                  backgroundColor: color,
                  borderRadius: '4px 4px 0 0',
                  minHeight: 4,
                  cursor: 'default',
                  opacity: isCurrent ? 1 : 0.8,
                  border: isCurrent ? '2px solid #ea580c' : 'none',
                  boxSizing: 'border-box',
                }}
              />

              {/* Month label */}
              <span
                style={{
                  fontSize: '0.65rem',
                  color: isCurrent ? '#ea580c' : '#64748b',
                  fontWeight: isCurrent ? 700 : 500,
                }}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '0.75rem',
          fontSize: '0.7rem',
          color: '#64748b',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#10b981', display: 'inline-block' }} />
          Cheapest
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#3b82f6', display: 'inline-block' }} />
          Moderate
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#f97316', display: 'inline-block' }} />
          Expensive
        </span>
      </div>
    </div>
  );
}
