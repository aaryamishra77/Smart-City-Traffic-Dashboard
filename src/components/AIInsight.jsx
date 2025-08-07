import { useState } from "react";

function AIInsight() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    setInsight(null);

    // Simulated delay
    await new Promise((res) => setTimeout(res, 1500));

    // Hardcoded mock AI insight
    const fakeInsight = `
✅ Weekly Traffic Report:
- Traffic increased by 24% compared to last week.
- Peak traffic occurred on Thursday between 3–6 PM.
- Mobile users accounted for 68% of total visits.
- Bounce rate decreased by 12%, showing better engagement.
`;

    setInsight(fakeInsight);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">🧠 AI Insights</h2>
        <button
          onClick={generateInsight}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Thinking..." : "Generate"}
        </button>
      </div>

      {insight && (
        <div className="mt-4 p-4 bg-gray-50 rounded text-gray-700 whitespace-pre-line">
          {insight}
        </div>
      )}
    </div>
  );
}

export default AIInsight;
