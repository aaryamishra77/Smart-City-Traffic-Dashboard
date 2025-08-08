// src/pages/Analytics.jsx
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { fetchTrafficData, fetchCityCoordinates } from "../api/traffic";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Analytics = () => {
  const [inputCity, setInputCity] = useState("");
  const [trafficInfo, setTrafficInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchAnalytics = async () => {
    if (!inputCity.trim()) return;
    setLoading(true);

    try {
      const coords = await fetchCityCoordinates(inputCity);
      if (!coords) {
        alert("City not found. Try again.");
        setLoading(false);
        return;
      }

      const traffic = await fetchTrafficData(coords.lat, coords.lon);
      setTrafficInfo({
        city: inputCity,
        speed: traffic.flowSegmentData.currentSpeed,
        freeFlow: traffic.flowSegmentData.freeFlowSpeed,
        confidence: traffic.flowSegmentData.confidence,
        time: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    if (!trafficInfo) return null;
    return {
      labels: ["Free Flow", "Current Speed"],
      datasets: [
        {
          label: `${trafficInfo.city} - Speed Comparison (km/h)`,
          data: [trafficInfo.freeFlow, trafficInfo.speed],
          fill: false,
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-6">📈 Live Traffic Analytics</h2>

      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Enter city name"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          className="border px-4 py-2 rounded-xl w-64"
        />
        <button
          onClick={handleFetchAnalytics}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
        >
          Fetch Analytics
        </button>
      </div>

      {loading && <p className="text-gray-500">Fetching traffic data...</p>}

      {trafficInfo && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Traffic in {trafficInfo.city} @ {trafficInfo.time}
          </h3>

          <ul className="mb-6 space-y-2">
            <li>🚗 Current Speed: {trafficInfo.speed} km/h</li>
            <li>🛣️ Free Flow Speed: {trafficInfo.freeFlow} km/h</li>
            <li>✅ Confidence: {Math.round(trafficInfo.confidence * 100)}%</li>
          </ul>

          <Line data={generateChartData()} />
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;
