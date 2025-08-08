import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchTrafficData } from "../api/traffic";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import L from "leaflet";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Overview = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityInput, setCityInput] = useState("");
  const [cityCoordinates, setCityCoordinates] = useState({});
  const [loading, setLoading] = useState(false);

  // 👇 Read the API key safely from env
  const API_KEY =
    import.meta.env.VITE_TOMTOM_API_KEY || process.env.VITE_TOMTOM_API_KEY;

  const fetchCityCoordinates = async (cityName) => {
    if (!API_KEY) {
      console.error("❌ TomTom API Key not found!");
      alert("API key missing. Please check deployment settings.");
      return null;
    }

    const GEOCODE_API = `https://api.tomtom.com/search/2/geocode/${cityName}.json?key=${API_KEY}`;
    try {
      const res = await fetch(GEOCODE_API);
      const data = await res.json();
      const position = data.results[0]?.position;
      if (position) return { lat: position.lat, lon: position.lon };
      return null;
    } catch (err) {
      console.error("Error fetching city coordinates:", err);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!cityInput) return;
    setLoading(true);
    const coords = await fetchCityCoordinates(cityInput);
    if (!coords) {
      alert("City not found!");
      setLoading(false);
      return;
    }
    const data = await fetchTrafficData(coords.lat, coords.lon);
    if (data) {
      const traffic = {
        city: cityInput,
        coordinates: coords,
        speed: data.flowSegmentData.currentSpeed,
        freeFlow: data.flowSegmentData.freeFlowSpeed,
        confidence: data.flowSegmentData.confidence,
      };
      setSelectedCity(traffic);
      setTrafficData((prev) => {
        const updated = prev.filter((item) => item.city !== cityInput);
        return [...updated, traffic];
      });
    }
    setLoading(false);
  };

  const barChartData = {
    labels: trafficData.map((c) => c.city),
    datasets: [
      {
        label: "Speed (km/h)",
        data: trafficData.map((c) => c.speed),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          className="border p-2 rounded w-60"
          placeholder="Enter city name"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Search City"}
        </button>
      </div>

      {selectedCity && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-lg font-bold">Current Speed</h4>
            <p className="text-blue-600 text-xl">{selectedCity.speed} km/h</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-lg font-bold">Free Flow Speed</h4>
            <p className="text-green-600 text-xl">
              {selectedCity.freeFlow} km/h
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-lg font-bold">Confidence</h4>
            <p className="text-purple-600 text-xl">
              {(selectedCity.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      <div className="h-[400px] w-full">
        <Bar data={barChartData} options={{ responsive: true }} />
      </div>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-[400px] w-full rounded shadow"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {trafficData.map((city, idx) => (
          <Marker
            key={idx}
            position={[city.coordinates.lat, city.coordinates.lon]}
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [30, 30],
            })}
          >
            <Popup>
              <strong>{city.city}</strong>
              <br /> Speed: {city.speed} km/h
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Overview;
