import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import CircularProgress from "./CircularProgress";

export default function Dashboard2({ data }) {
  if (!data || !data.result) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  const sectionLabels = {
    A: "Technical Performance",
    B: "On Page SEO",
    C: "Accessibility",
    D: "Security/Compliance",
    E: "UX & Content",
    F: "Conversion & Lead Flow",
    G: "AIO Readiness",
  };
  const { sectionScores, topFixes, totalScore } = data.result;

  const sectionData = Object.entries(sectionScores).map(([key, value]) => ({
    name: sectionLabels[key], 
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
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
      {/* Overall Score */}
      <div className="col-span-1 lg:col-span-3 bg-gradient-to-r from-indigo-200 to-blue-700 rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-2xl font-bold">Overall Score</h2>
       <div className="flex gap-64 items-center justify-center">
        <div> <CircularProgress value={totalScore} size={110} stroke={10} /></div>
        <div>
      <h1>Grade {data.result.grade}</h1>
      <p>AIO Compatibility- {data.result.badge}</p>

        </div>
       </div>
        <p className="text-gray-200">Website Health Index</p>
      </div>

      {/* Dynamic Section Score Cards */}
      <div className="col-span-1 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {Object.entries(sectionScores).map(([key, value], index) => (
          <div
            key={key}
            className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 text-center"
          >
            <h3 className="text-sm text-gray-400">{sectionLabels[key]} Score</h3>
            <p
              className="text-2xl font-bold"
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="col-span-1 lg:col-span-3 bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Section Scores</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sectionData}>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="score">
              {sectionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Top Fixes Needed</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={topFixes}
              dataKey="score"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {topFixes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
