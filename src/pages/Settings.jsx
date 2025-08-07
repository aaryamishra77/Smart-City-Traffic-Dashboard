export default function Settings() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">⚙️ Settings</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <label className="block text-sm font-medium">Theme</label>
        <select className="mt-1 block w-full border-gray-300 rounded-md">
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <label className="block text-sm font-medium">Notifications</label>
        <input type="checkbox" className="mt-2" /> Enable alerts
      </div>
    </div>
  );
}
