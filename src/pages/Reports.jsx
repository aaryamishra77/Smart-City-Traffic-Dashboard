// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const cities = {
  Mumbai: 85,
  Delhi: 78,
  Bengaluru: 65,
  Hyderabad: 72,
  Chennai: 69,
  Pune: 60,
  Kolkata: 68,
};

const Reports = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const labels = Object.keys(cities);
    const trafficData = Object.values(cities);

    setData({
      labels,
      datasets: [
        {
          label: "Traffic Intensity",
          data: trafficData,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderRadius: 10,
        },
      ],
    });
  }, []);

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-6">📊 City Traffic Reports</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {data.labels && <Bar data={data} />}
      </div>
    </motion.div>
  );
};

export default Reports;
