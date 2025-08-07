// src/components/Navbar.jsx
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
    </header>
  );
};

export default Navbar;
