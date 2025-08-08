// src/pages/Profile.jsx
import { motion } from "framer-motion";

const Profile = () => {
  const user = {
    name: "Aarya Sharma",
    email: "aarya@example.com",
    recentCities: ["Delhi", "Mumbai", "Bangalore"],
    preferences: {
      theme: "Dark",
      units: "km/h",
    },
  };

  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-6">👤 Profile</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 max-w-xl">
        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-md font-semibold mb-2">Preferences</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
            <li>Theme: {user.preferences.theme}</li>
            <li>Units: {user.preferences.units}</li>
          </ul>
        </div>

        {/* Recent Cities */}
        <div>
          <h3 className="text-md font-semibold mb-2">Recently Viewed Cities</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
            {user.recentCities.map((city, index) => (
              <li key={index}>{city}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
