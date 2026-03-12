import { cityData } from '../data/city-data';

function fmt(n) {
  return '$' + n.toLocaleString('en-US');
}

function pct(n) {
  return (n * 100).toFixed(1) + '%';
}

function CostBar({ value, max, color }) {
  const width = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ height: 8, borderRadius: 4, backgroundColor: '#f1f5f9', width: '100%' }}>
      <div
        style={{
          height: '100%',
          borderRadius: 4,
          backgroundColor: color,
          width: `${width}%`,
          transition: 'width 0.6s ease-out',
        }}
      />
    </div>
  );
}

function StatRow({ label, left, right, format, barMax, barColor }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
        {label}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
            {format(left)}
          </div>
          {barMax != null && <CostBar value={left} max={barMax} color={barColor || '#f97316'} />}
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
            {format(right)}
          </div>
          {barMax != null && <CostBar value={right} max={barMax} color={barColor || '#f97316'} />}
        </div>
      </div>
    </div>
  );
}

export default function CityCompare({ originCity, destCity }) {
  const originEnriched = cityData[originCity.slug] || null;
  const destEnriched = cityData[destCity.slug] || null;

  const originCOL = originEnriched?.costOfLivingIndex ?? Math.round(originCity.costIndex * 100);
  const destCOL = destEnriched?.costOfLivingIndex ?? Math.round(destCity.costIndex * 100);
  const maxCOL = Math.max(originCOL, destCOL, 100);

  const originTax = originEnriched?.stateIncomeTax ?? null;
  const destTax = destEnriched?.stateIncomeTax ?? null;

  const originTempHigh = originEnriched?.avgTempHigh ?? null;
  const destTempHigh = destEnriched?.avgTempHigh ?? null;

  // Housing comparison callout
  const avgRentOrigin = (originCity.averageRent1BR + originCity.averageRent2BR) / 2;
  const avgRentDest = (destCity.averageRent1BR + destCity.averageRent2BR) / 2;
  const rentDiff = avgRentDest - avgRentOrigin;
  const rentPctChange = avgRentOrigin > 0 ? Math.abs(rentDiff / avgRentOrigin * 100).toFixed(0) : 0;
  const savesOnHousing = rentDiff < 0;

  return (
    <div className="card-elevated" style={{ padding: '1.5rem', overflow: 'hidden' }}>
      {/* Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Origin
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {originCity.name}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{originCity.state}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Destination
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            {destCity.name}
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{destCity.state}</span>
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '0 -1.5rem 1.5rem' }} />

      {/* Cost of Living Index */}
      <StatRow
        label="Cost of Living Index"
        left={originCOL}
        right={destCOL}
        format={(v) => v}
        barMax={maxCOL}
        barColor="#f97316"
      />

      {/* Average Rent */}
      <StatRow
        label="Average Rent (1BR)"
        left={originCity.averageRent1BR}
        right={destCity.averageRent1BR}
        format={fmt}
        barMax={Math.max(originCity.averageRent1BR, destCity.averageRent1BR)}
        barColor="#3b82f6"
      />

      <StatRow
        label="Average Rent (2BR)"
        left={originCity.averageRent2BR}
        right={destCity.averageRent2BR}
        format={fmt}
        barMax={Math.max(originCity.averageRent2BR, destCity.averageRent2BR)}
        barColor="#3b82f6"
      />

      {/* State Income Tax */}
      {originTax != null && destTax != null && (
        <StatRow
          label="State Income Tax"
          left={originTax}
          right={destTax}
          format={(v) => (v === 0 ? 'None' : pct(v))}
          barMax={Math.max(originTax, destTax) || 0.15}
          barColor="#8b5cf6"
        />
      )}

      {/* Average Temperature */}
      {originTempHigh != null && destTempHigh != null && (
        <StatRow
          label="Avg High Temperature"
          left={originTempHigh}
          right={destTempHigh}
          format={(v) => `${v}\u00B0F`}
          barMax={Math.max(originTempHigh, destTempHigh)}
          barColor="#10b981"
        />
      )}

      {/* Housing Callout */}
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: '0.75rem',
          background: savesOnHousing
            ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
            : 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
          border: `1px solid ${savesOnHousing ? '#bbf7d0' : '#fdba74'}`,
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: savesOnHousing ? '#166534' : '#9a3412' }}>
          {savesOnHousing
            ? `You'll save ~${rentPctChange}% on housing`
            : `You'll spend ~${rentPctChange}% more on housing`}
        </div>
        <div style={{ fontSize: '0.75rem', color: savesOnHousing ? '#15803d' : '#c2410c', marginTop: '0.25rem' }}>
          Average rent in {destCity.name} is {fmt(Math.round(avgRentDest))}/mo vs {fmt(Math.round(avgRentOrigin))}/mo in {originCity.name}
        </div>
      </div>

      {/* Neighborhoods */}
      {(originEnriched?.topNeighborhoods || destEnriched?.topNeighborhoods) && (
        <>
          <div style={{ height: 1, backgroundColor: '#f1f5f9', margin: '1.5rem -1.5rem 1rem' }} />
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Top Neighborhoods
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {originEnriched?.topNeighborhoods && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316', marginBottom: '0.35rem' }}>
                  {originCity.name}
                </div>
                <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.7 }}>
                  {originEnriched.topNeighborhoods.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
            {destEnriched?.topNeighborhoods && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', marginBottom: '0.35rem' }}>
                  {destCity.name}
                </div>
                <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.7 }}>
                  {destEnriched.topNeighborhoods.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
