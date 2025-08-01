// Helper function to get metafield reference (for metaobjects)
const getMetafieldReference = (metafields: any[], key: string) => {
  if (!Array.isArray(metafields)) return null;

  const metafield = metafields?.find(mf => mf && mf.key === key);
  if (!metafield) return null;

  // Handle list.metaobject_reference type
  if (metafield.type === 'list.metaobject_reference') {
    return metafield.references?.edges?.[0]?.node || null;
  }
  
  // Handle single metaobject_reference type
  if (metafield.type === 'metaobject_reference') {
    return metafield.reference || null;
  }
  
  return null;
};

// Helper function to get a field value from a metaobject
const getMetaobjectFieldValue = (metaobject: { fields: any[]; }, fieldKey: string) => {
  if (!metaobject?.fields) return null;
  
  const field = metaobject.fields.find(f => f.key === fieldKey);
  return field?.value || null;
};

const getMetafieldValue = (metafields: any[], key: string) => {
  if (!Array.isArray(metafields)) return null;
  
  const metafield = metafields.find(mf => {
    return mf && typeof mf === 'object' && mf.key === key;
  });
  
  return metafield?.value || null;
};

// Parse rating data from the structured format
const parseRatingData = (ratingValue: string) => {
  try {
    const parsed = JSON.parse(ratingValue);
    return {
      value: parseFloat(parsed.value) || 0,
      scaleMin: parseFloat(parsed.scale_min) || 1,
      scaleMax: parseFloat(parsed.scale_max) || 5
    };
  } catch {
    // Fallback: try to parse as simple number
    const numValue = parseFloat(ratingValue);
    return isNaN(numValue) ? null : {
      value: numValue,
      scaleMin: 1,
      scaleMax: 5
    };
  }
};

interface StarRatingProps {
  metafields: any[];
}

export function StarRating({ metafields }: StarRatingProps) {
  const ratingValue = getMetafieldValue(metafields, 'rating');
  const ratingCount = getMetafieldValue(metafields, 'rating_count');
  
  // If no rating data, show 5 gray stars with 0 count
  if (!ratingValue || !ratingCount) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="flex text-gray-300">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="text-gray-300">
                ★
              </span>
            ))}
          </div>
          <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
            0.0 (0 reviews)
          </span>
        </div>
      </div>
    );
  }
  
  const ratingData = parseRatingData(ratingValue);
  if (!ratingData) {
    // Fallback to gray stars if parsing fails
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="flex text-gray-300">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="text-gray-300">
                ★
              </span>
            ))}
          </div>
          <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
            0.0 (0 reviews)
          </span>
        </div>
      </div>
    );
  }
  
  const { value, scaleMax } = ratingData;
  const normalizedRating = (value / scaleMax) * 5; // Normalize to 5-star scale
  
  // Create array of stars (filled, half-filled, empty)
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (normalizedRating >= i) {
      stars.push('★'); // Filled star
    } else if (normalizedRating >= i - 0.5) {
      stars.push('☆'); // Half star (using different character for now)
    } else {
      stars.push('☆'); // Empty star
    }
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {stars.map((star, index) => (
            <span key={index} className={star === '★' ? 'text-primary' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
        <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
          {value.toFixed(1)} ({ratingCount} reviews)
        </span>
      </div>
    </div>
  );
}

interface CountryOriginProps {
  metafields: any[];
}

export function CountryOrigin({ metafields }: CountryOriginProps) {
  // Get country metaobject reference
  const countryMetaobject = getMetafieldReference(metafields, 'country');
  
  // Extract country info from the metaobject
  const countryName = countryMetaobject ? getMetaobjectFieldValue(countryMetaobject, 'name') : null;
  const countryFlag = countryMetaobject ? getMetaobjectFieldValue(countryMetaobject, 'flag') : null;
  
  // Check if there's a country reference but data isn't loaded
  const hasCountryReference = !countryName && !countryFlag && getMetafieldValue(metafields, 'country');
  
  if (!countryName && !countryFlag && !hasCountryReference) return null;
  
  return (
    <div className="flex items-center gap-2">
      {countryFlag && (
        <span className="text-lg" role="img" aria-label={countryName || 'country flag'}>
          {countryFlag}
        </span>
      )}
      {countryName && (
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {countryName}
        </span>
      )}
    </div>
  );
}