// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-60 bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-8">Traffic Dashboard</h1>
      <nav className="flex flex-col space-y-4">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>Overview</NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>Analytics</NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>Reports</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>Settings</NavLink>
      </nav>
    </div>
  );
}
