const COLORS = {
  labor: '#f97316',
  transportation: '#3b82f6',
  packing: '#10b981',
  insurance: '#8b5cf6',
  tips: '#f59e0b',
  extras: '#ec4899',
};

const LABELS = {
  labor: 'Labor',
  transportation: 'Transportation',
  packing: 'Packing',
  insurance: 'Insurance',
  tips: 'Tips',
  extras: 'Extras',
};

function fmt(n) {
  return '$' + n.toLocaleString('en-US');
}

export default function CostBreakdown({ breakdown }) {
  // Build items from breakdown, skipping $0 entries
  const items = Object.entries(breakdown)
    .filter(([, range]) => range.mid > 0)
    .map(([key, range]) => ({
      key,
      label: LABELS[key] || key,
      color: COLORS[key] || '#94a3b8',
      value: range.mid,
      low: range.low,
      high: range.high,
    }));

  const total = items.reduce((sum, item) => sum + item.value, 0);

  // Build conic-gradient stops
  let accumulated = 0;
  const stops = items.map((item) => {
    const pct = (item.value / total) * 100;
    const start = accumulated;
    accumulated += pct;
    return `${item.color} ${start}% ${accumulated}%`;
  });

  const gradient = `conic-gradient(${stops.join(', ')})`;

  return (
    <div>
      {/* Donut Chart */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div
          className="donut-chart"
          style={{
            width: 200,
            height: 200,
            background: gradient,
          }}
        >
          <div className="donut-center">
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              {fmt(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item) => {
          const pct = ((item.value / total) * 100).toFixed(1);
          return (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: '#475569' }}>{item.label}</span>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({pct}%)</span>
              </div>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>
                {fmt(item.low)} &ndash; {fmt(item.high)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
