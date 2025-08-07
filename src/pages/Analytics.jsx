import { useEffect, useState } from "react";
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
import { motion } from "framer-motion"; // ✅ Framer Motion for animation

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Predefined city coordinates
const cities = {
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

export default function Analytics() {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [data, setData] = useState(null);

  useEffect(() => {
    const { lat, lon } = cities[selectedCity];
    fetchTrafficData(lat, lon).then((res) => {
      if (res) setData(res.flowSegmentData);
    });
  }, [selectedCity]);

  const chartData = {
    labels: ["Current Speed", "Free Flow Speed", "Confidence"],
    datasets: [
      {
        label: `Traffic in ${selectedCity}`,
        data: data ? [data.currentSpeed, data.freeFlowSpeed, data.confidence] : [0, 0, 0],
        backgroundColor: ["#34d399", "#60a5fa", "#fbbf24"],
      },
    ],
  };

  return (
    <div className="p-6">
      {/* Page Title & Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Real-Time Traffic Analytics</h2>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-2 text-sm shadow"
        >
          {Object.keys(cities).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Animated Chart Section */}
      {data ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Bar data={chartData} />
        </motion.div>
      ) : (
        <p className="text-gray-600">Loading traffic data...</p>
      )}

      {/* 🚀 Additional Info Cards */}
      {data && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-green-400">
            <h3 className="text-lg font-semibold text-gray-700">Current Speed</h3>
            <p className="text-2xl font-bold text-green-600">{data.currentSpeed} km/h</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-blue-400">
            <h3 className="text-lg font-semibold text-gray-700">Free Flow Speed</h3>
            <p className="text-2xl font-bold text-blue-600">{data.freeFlowSpeed} km/h</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg border-t-4 border-yellow-400">
            <h3 className="text-lg font-semibold text-gray-700">Confidence</h3>
            <p className="text-2xl font-bold text-yellow-500">{data.confidence}%</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
