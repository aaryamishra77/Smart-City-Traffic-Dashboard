import Header from './Header';
import AnalyticsChart from './AnalyticsChart';
import AIInsight from './AIInsight';

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex-1">
      <Header />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">📈 Revenue Card</div>
        <div className="bg-white p-6 rounded-lg shadow">📊 User Growth</div>
        <div className="bg-white p-6 rounded-lg shadow">🧠 AI Insight Coming Soon</div>
      </div>

      {/* Chart + AI */}
      <div className="mt-8 space-y-8">
        <AnalyticsChart />
        <AIInsight />
      </div>
    </div>
  );
}

export default Dashboard;
