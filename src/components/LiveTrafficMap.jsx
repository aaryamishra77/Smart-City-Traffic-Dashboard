// src/components/LiveTrafficMap.jsx
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const LiveTrafficMap = ({ lat = 28.6139, lon = 77.209 }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadTomTom = async () => {
      const tt = await import("@tomtom-international/web-sdk-maps");
      const map = tt.map({
        key: import.meta.env.VITE_TOMTOM_API_KEY,
        container: mapRef.current,
        center: [lon, lat],
        zoom: 13,
      });

      const marker = new tt.Marker().setLngLat([lon, lat]).addTo(map);

      const trafficLayer = tt.traffic.map({
        key: import.meta.env.VITE_TOMTOM_API_KEY,
      });

      map.addLayer(trafficLayer);

      return () => map.remove();
    };

    loadTomTom();
  }, [lat, lon]);

  return (
    <motion.div
      ref={mapRef}
      className="w-full h-[500px] rounded-xl shadow-2xl border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
    />
  );
};

export default LiveTrafficMap;
