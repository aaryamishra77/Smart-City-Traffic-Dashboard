import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { fetchTrafficData } from "../api/traffic";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Register ChartJS elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// ✅ Export cities for use elsewhere
export const cities = {
  Delhi: { lat: 28.6139, lon: 77.209 },
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Guna: { lat: 24.6542, lon: 77.321 },
};

export default function Overview() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [trafficData, setTrafficData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const allData = {};
      setLoading(true);
      for (const city in cities) {
        const { lat, lon } = cities[city];
        const data = await fetchTrafficData(lat, lon);
        if (data) {
          allData[city] = data.flowSegmentData;
        }
      }
      setTrafficData(allData);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const selected = trafficData[selectedCity];

  const chartData = {
    labels: Object.keys(cities),
    datasets: [
      {
        label: "Current Speed (km/h)",
        data: Object.values(trafficData).map((d) => d?.currentSpeed || 0),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🧭 Header & City Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🚦 Smart City Traffic Dashboard</h1>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-white border border-gray-300 rounded px-4 py-2 shadow"
        >
          {Object.keys(cities).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* 📍 Live Traffic Map */}
      <motion.div
        className="rounded-xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MapContainer
          center={[cities[selectedCity].lat, cities[selectedCity].lon]}
          zoom={5}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {Object.entries(cities).map(([name, { lat, lon }]) => (
            <Marker key={name} position={[lat, lon]}>
              <Popup>
                <strong>{name}</strong>
                <br />
                {trafficData[name]?.currentSpeed
                  ? `Speed: ${trafficData[name].currentSpeed} km/h`
                  : "Loading..."}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>

      {/* 📊 Traffic Speed Bar Chart */}
      {!loading && (
        <motion.div
          className="bg-white p-4 rounded-xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-4">City-Wise Traffic Speed</h2>
          <Bar data={chartData} />
        </motion.div>
      )}

      {/* 🔍 Traffic Info Cards */}
      {selected && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white p-4 rounded-xl shadow border-t-4 border-green-500">
            <h3 className="text-lg font-medium">Current Speed</h3>
            <p className="text-2xl font-bold text-green-600">
              {selected.currentSpeed} km/h
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-t-4 border-blue-500">
            <h3 className="text-lg font-medium">Free Flow Speed</h3>
            <p className="text-2xl font-bold text-blue-600">
              {selected.freeFlowSpeed} km/h
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-t-4 border-yellow-400">
            <h3 className="text-lg font-medium">Confidence</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {selected.confidence}%
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
