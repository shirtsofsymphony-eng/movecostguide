export default function RouteSchema({ originCity, destCity, cost, distance }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Moving Service from ${originCity.name}, ${originCity.stateCode} to ${destCity.name}, ${destCity.stateCode}`,
    description: `Professional moving services from ${originCity.name} to ${destCity.name}. Average cost: $${cost.mid.toLocaleString()}. Distance: ${distance.miles} miles.`,
    provider: {
      '@type': 'Organization',
      name: 'MoveCostGuide',
      url: 'https://movecostguide.us',
    },
    areaServed: [
      { '@type': 'City', name: originCity.name, containedInPlace: { '@type': 'State', name: originCity.state } },
      { '@type': 'City', name: destCity.name, containedInPlace: { '@type': 'State', name: destCity.state } },
    ],
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: cost.low,
      highPrice: cost.high,
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
