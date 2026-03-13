'use client';

import { useEffect, useRef } from 'react';

// ============================================================
// Google AdSense Ad Unit Component
//
// SETUP: Replace AD_SLOT values below with real slot IDs from
// your AdSense dashboard (google.com/adsense → Ads → By ad unit)
//
// Publisher ID is already loaded in layout.js
// ============================================================

const AD_CLIENT = 'ca-pub-3292877774103361';

// Create ad units in AdSense dashboard and paste slot IDs here
// Each slot ID looks like: '1234567890'
const AD_SLOTS = {
  'top': '9292406047',
  'mid': '4451142900',
  'bottom': '5042169847',
  'in-article': '7229349488',
  'sidebar': '',
};

export default function AdUnit({
  slot = 'mid',
  format = 'auto',
  responsive = true,
  className = '',
  style = {},
}) {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const slotId = AD_SLOTS[slot] || AD_SLOTS['mid'] || '';

  if (!slotId) {
    return (
      <div className={`ad-slot ${className}`} style={{ minHeight: '90px', ...style }}>
        <div className="text-center text-xs text-gray-400 py-4">Advertisement</div>
      </div>
    );
  }

  return (
    <div className={`ad-unit ${className}`} style={{ textAlign: 'center', overflow: 'hidden', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
      />
    </div>
  );
}
