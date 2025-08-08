// src/pages/Reports.jsx
import { useState } from "react";
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
import {
  fetchTrafficData,
  fetchCityCoordinates,
} from "../api/traffic";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Reports = () => {
  const [cities, setCities] = useState([]);
  const [inputCity, setInputCity] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddCity = async () => {
    if (!inputCity.trim()) return;

    setLoading(true);
    try {
      const coords = await fetchCityCoordinates(inputCity);
      if (!coords || !coords.lat || !coords.lon) {
        alert("City not found. Try another.");
        setLoading(false);
        return;
      }

      const traffic = await fetchTrafficData(coords.lat, coords.lon);
      const speed = traffic?.flowSegmentData?.currentSpeed;

      if (typeof speed !== "number") {
        alert("Traffic data not available for this city.");
        setLoading(false);
        return;
      }

      const updatedCities = [
        ...cities,
        {
          name: inputCity,
          speed: speed,
        },
      ];

      setCities(updatedCities);
      setInputCity("");
      updateChart(updatedCities);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateChart = (cities) => {
    if (!Array.isArray(cities) || cities.length === 0) return;

    setChartData({
      labels: cities.map((c) => c.name),
      datasets: [
        {
          label: "Current Speed (km/h)",
          data: cities.map((c) => c.speed ?? 0),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderRadius: 10,
        },
      ],
    });
  };

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-6">
        🌍 Live Traffic Reports (Dynamic Cities)
      </h2>

      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          className="border rounded-xl px-4 py-2 w-64"
          placeholder="Enter city name"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
        />
        <button
          onClick={handleAddCity}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        >
          Add City
        </button>
      </div>

      {loading && (
        <p className="text-gray-500 mb-4">Fetching data...</p>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {chartData && chartData.labels?.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p className="text-gray-600">
            No cities added yet. Add cities to see traffic data.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Reports;
