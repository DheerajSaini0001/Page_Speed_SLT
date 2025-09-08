import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard2({ data }) {
  if (!data) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const { sectionScores, topFixes, totalScore } = data;

  const sectionData = Object.entries(sectionScores || {}).map(([key, value]) => ({
    name: key,
    score: value,
  }));

  const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#d946ef",
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
      {/* Total Score Highlight */}
      <div className="col-span-1 lg:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-2xl font-bold">Overall Score</h2>
        <p className="text-6xl font-extrabold mt-2">{totalScore}%</p>
        <p className="text-gray-200">Website Health Index</p>
      </div>

      {/* Section Stat Cards */}
      <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        {sectionData.map((item, index) => (
          <div
            key={item.name}
            className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 text-center"
          >
            <h3 className="text-sm text-gray-400">{item.name}</h3>
            <p
              className="text-2xl font-bold"
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {item.score.toFixed(1)}
            </p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Section Score Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sectionData}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Top Fixes</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={topFixes || []}
              dataKey="score"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              label
            >
              {(topFixes || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
