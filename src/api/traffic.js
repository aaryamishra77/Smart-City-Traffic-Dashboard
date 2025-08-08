// src/api/traffic.js

// ✅ Get coordinates (lat, lon) for a city using TomTom Geocoding API
export const fetchCityCoordinates = async (cityName) => {
  try {
    const response = await fetch(
      `https://api.tomtom.com/search/2/geocode/${cityName}.json?key=${import.meta.env.VITE_TOMTOM_API_KEY}`
    );
    const data = await response.json();
    const result = data.results?.[0];
    if (!result) return null;

    return {
      lat: result.position.lat,
      lon: result.position.lon,
    };
  } catch (err) {
    console.error("Error fetching city coordinates:", err);
    return null;
  }
};

// ✅ Get live traffic data using lat/lon from TomTom Traffic Flow API
export const fetchTrafficData = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${lat},${lon}&key=${import.meta.env.VITE_TOMTOM_API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching traffic data:", err);
    return null;
  }
};
