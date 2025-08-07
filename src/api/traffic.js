import axios from "axios";

const API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

export const fetchTrafficData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch traffic data:", error);
    return null;
  }
};
