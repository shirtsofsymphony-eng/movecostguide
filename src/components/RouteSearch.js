'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cities } from '../data/cities';
import { MapPinIcon, SwapIcon, TruckIcon, ArrowRightIcon } from './icons';

function fuzzyMatch(query, city) {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  const name = city.name.toLowerCase();
  const state = city.state.toLowerCase();
  const code = city.stateCode.toLowerCase();
  const combined = `${name} ${state} ${code} ${name}, ${code}`;
  // Check if all characters in query appear in order (fuzzy)
  if (combined.includes(q)) return true;
  // Also try matching tokens individually
  const tokens = q.split(/\s+/);
  return tokens.every(t => combined.includes(t));
}

function formatPopulation(pop) {
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)}K`;
  return pop.toLocaleString();
}

export default function RouteSearch({ variant = 'hero' }) {
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [originCity, setOriginCity] = useState(null);
  const [destCity, setDestCity] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [error, setError] = useState('');

  const originRef = useRef(null);
  const destRef = useRef(null);
  const originDropdownRef = useRef(null);
  const destDropdownRef = useRef(null);
  const containerRef = useRef(null);

  const isHero = variant === 'hero';

  // Filter cities based on the active query
  const filteredCities = useMemo(() => {
    const query = activeField === 'origin' ? originQuery : destQuery;
    if (!query || query.length < 1) return [];
    return cities.filter(c => fuzzyMatch(query, c)).slice(0, 8);
  }, [activeField, originQuery, destQuery]);

  // Reset highlight when results change
  useEffect(() => {
    setHighlightIndex(-1);
  }, [filteredCities.length, activeField]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveField(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex < 0) return;
    const dropdown = activeField === 'origin' ? originDropdownRef.current : destDropdownRef.current;
    if (!dropdown) return;
    const item = dropdown.children[highlightIndex];
    if (item) item.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex, activeField]);

  const selectCity = useCallback((city, field) => {
    if (field === 'origin') {
      setOriginCity(city);
      setOriginQuery(`${city.name}, ${city.stateCode}`);
    } else {
      setDestCity(city);
      setDestQuery(`${city.name}, ${city.stateCode}`);
    }
    setActiveField(null);
    setHighlightIndex(-1);
    setError('');

    // Move focus to the other field if it's empty
    if (field === 'origin' && !destCity) {
      setTimeout(() => destRef.current?.focus(), 50);
    }
  }, [destCity]);

  const handleInputChange = useCallback((value, field) => {
    if (field === 'origin') {
      setOriginQuery(value);
      setOriginCity(null);
    } else {
      setDestQuery(value);
      setDestCity(null);
    }
    setActiveField(field);
    setError('');
  }, []);

  const handleKeyDown = useCallback((e, field) => {
    if (activeField !== field || filteredCities.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIndex(prev =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIndex(prev =>
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filteredCities.length) {
          selectCity(filteredCities[highlightIndex], field);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setActiveField(null);
        setHighlightIndex(-1);
        break;
      default:
        break;
    }
  }, [activeField, filteredCities, highlightIndex, selectCity]);

  const handleSwap = useCallback(() => {
    setOriginQuery(destQuery);
    setDestQuery(originQuery);
    setOriginCity(destCity);
    setDestCity(originCity);
    setError('');
  }, [originQuery, destQuery, originCity, destCity]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!originCity || !destCity) {
      setError('Please select both an origin and destination city.');
      return;
    }
    if (originCity.slug === destCity.slug) {
      setError('Origin and destination must be different cities.');
      return;
    }

    window.location.href = `/moving-from/${originCity.slug}/to/${destCity.slug}/`;
  }, [originCity, destCity]);

  // Shared input classes
  const inputBase = isHero
    ? 'w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent px-4 py-4 text-lg'
    : 'w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent px-3 py-2.5 text-sm';

  const labelClass = isHero
    ? 'block text-sm font-semibold text-white/90 mb-2 tracking-wide uppercase'
    : 'block text-xs font-semibold text-gray-500 mb-1 tracking-wide uppercase';

  const renderDropdown = (field) => {
    if (activeField !== field || filteredCities.length === 0) return null;
    const ref = field === 'origin' ? originDropdownRef : destDropdownRef;

    return (
      <div className="autocomplete-dropdown" ref={ref}>
        {filteredCities.map((city, i) => (
          <div
            key={city.slug}
            className={`autocomplete-item ${i === highlightIndex ? 'active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              selectCity(city, field);
            }}
            onMouseEnter={() => setHighlightIndex(i)}
          >
            <MapPinIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="font-medium">{city.name}</span>
            <span className="text-gray-400 text-sm">{city.stateCode}</span>
            <span className="text-gray-300 text-xs ml-auto">
              ({formatPopulation(city.population)})
            </span>
          </div>
        ))}
      </div>
    );
  };

  // --- Hero Variant ---
  if (isHero) {
    return (
      <form onSubmit={handleSubmit} ref={containerRef} className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4">
          {/* Origin Input */}
          <div className="relative flex-1 w-full">
            <label htmlFor="origin-input" className={labelClass}>
              Moving from
            </label>
            <input
              ref={originRef}
              id="origin-input"
              type="text"
              className={inputBase}
              placeholder="Enter city or state..."
              value={originQuery}
              onChange={(e) => handleInputChange(e.target.value, 'origin')}
              onFocus={() => {
                setActiveField('origin');
                if (!originCity && originQuery) setActiveField('origin');
              }}
              onKeyDown={(e) => handleKeyDown(e, 'origin')}
              autoComplete="off"
              aria-expanded={activeField === 'origin' && filteredCities.length > 0}
              aria-haspopup="listbox"
              aria-autocomplete="list"
            />
            {renderDropdown('origin')}
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwap}
            className="flex-shrink-0 p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/70 hover:text-orange-400 hover:bg-white/20 hover:border-orange-400/50 transition-all duration-200 mb-0 sm:mb-1 self-center sm:self-auto"
            aria-label="Swap origin and destination"
            title="Swap cities"
          >
            <SwapIcon className="w-5 h-5" />
          </button>

          {/* Destination Input */}
          <div className="relative flex-1 w-full">
            <label htmlFor="dest-input" className={labelClass}>
              Moving to
            </label>
            <input
              ref={destRef}
              id="dest-input"
              type="text"
              className={inputBase}
              placeholder="Enter city or state..."
              value={destQuery}
              onChange={(e) => handleInputChange(e.target.value, 'dest')}
              onFocus={() => {
                setActiveField('dest');
                if (!destCity && destQuery) setActiveField('dest');
              }}
              onKeyDown={(e) => handleKeyDown(e, 'dest')}
              autoComplete="off"
              aria-expanded={activeField === 'dest' && filteredCities.length > 0}
              aria-haspopup="listbox"
              aria-autocomplete="list"
            />
            {renderDropdown('dest')}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 text-center">
            <p className="text-orange-300 text-sm font-medium animate-pulse">
              {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-glow text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-lg"
          >
            <TruckIcon className="w-6 h-6" />
            Get Your Estimate
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    );
  }

  // --- Compact Variant ---
  return (
    <form onSubmit={handleSubmit} ref={containerRef} className="w-full">
      <div className="flex flex-col sm:flex-row items-end gap-2">
        {/* Origin Input */}
        <div className="relative flex-1 w-full">
          <label htmlFor="origin-input-compact" className={labelClass}>
            Moving from
          </label>
          <input
            ref={originRef}
            id="origin-input-compact"
            type="text"
            className={inputBase}
            placeholder="Origin city..."
            value={originQuery}
            onChange={(e) => handleInputChange(e.target.value, 'origin')}
            onFocus={() => setActiveField('origin')}
            onKeyDown={(e) => handleKeyDown(e, 'origin')}
            autoComplete="off"
            aria-expanded={activeField === 'origin' && filteredCities.length > 0}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />
          {renderDropdown('origin')}
        </div>

        {/* Swap Button */}
        <button
          type="button"
          onClick={handleSwap}
          className="flex-shrink-0 p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 mb-0 sm:mb-0.5 self-center sm:self-auto border border-gray-200"
          aria-label="Swap origin and destination"
          title="Swap cities"
        >
          <SwapIcon className="w-4 h-4" />
        </button>

        {/* Destination Input */}
        <div className="relative flex-1 w-full">
          <label htmlFor="dest-input-compact" className={labelClass}>
            Moving to
          </label>
          <input
            ref={destRef}
            id="dest-input-compact"
            type="text"
            className={inputBase}
            placeholder="Destination city..."
            value={destQuery}
            onChange={(e) => handleInputChange(e.target.value, 'dest')}
            onFocus={() => setActiveField('dest')}
            onKeyDown={(e) => handleKeyDown(e, 'dest')}
            autoComplete="off"
            aria-expanded={activeField === 'dest' && filteredCities.length > 0}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />
          {renderDropdown('dest')}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-glow text-white font-bold px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm whitespace-nowrap"
        >
          <TruckIcon className="w-4 h-4" />
          Get Estimate
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2">
          <p className="text-red-500 text-xs font-medium">
            {error}
          </p>
        </div>
      )}
    </form>
  );
}
