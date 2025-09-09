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
    return <div />;
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
    <div className="mt-10 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
      {/* Overall Score */}
      <div className="col-span-1 lg:col-span-3 bg-gradient-to-r from-indigo-200 to-blue-700 rounded-2xl shadow-xl p-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Overall Score</h2>

        <div className="flex flex-col sm:flex-row sm:gap-12 lg:gap-24 items-center justify-center">
          <div className="mb-4 sm:mb-0">
            <CircularProgress value={totalScore} size={110} stroke={10} />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              Grade - {data.result.grade}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg">
              AIO Compatibility - {data.result.badge}
            </p>
          </div>
        </div>

        <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-6">
          {totalScore}%
        </p>
        <p className="text-gray-200 text-sm sm:text-base mt-2">
          Website Health Index
        </p>
      </div>

      {/* Section Score Cards */}
      <div className="col-span-1 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.entries(sectionScores).map(([key, value], index) => (
          <div
            key={key}
            className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 text-center"
          >
            <h3 className="text-xs sm:text-sm text-gray-400">
              {sectionLabels[key]} Score
            </h3>
            <p
              className="text-lg sm:text-xl lg:text-2xl font-bold"
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {value.toFixed(1)}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="col-span-1 lg:col-span-3 bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Section Scores
        </h3>
        <div className="w-full h-64 sm:h-72 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
  <BarChart data={sectionData}>
    <XAxis dataKey="name" stroke="#aaa" tick={{ fontSize: 12 }} />
    <YAxis stroke="#aaa" tick={{ fontSize: 12 }} />
    <Tooltip />

    {/* ✅ Custom Legend with colors */}
    <Legend
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      wrapperStyle={{ fontSize: "12px" }}
      payload={sectionData.map((entry, index) => ({
        id: entry.name,
        type: "square",
        value: entry.name, // show section name
        color: COLORS[index % COLORS.length], // match colors
      }))}
    />

    <Bar dataKey="score">
      {sectionData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={COLORS[index % COLORS.length]}
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>



        </div>
      </div>

      {/* Pie Chart */}
      <div className="col-span-1 lg:col-span-3 bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold mb-4">
          Top Fixes Needed
        </h3>
        <div className="w-full h-64 sm:h-72 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topFixes}
                dataKey="score"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label={({ name }) =>
                  name.length > 14 ? name.slice(0, 14) + "..." : name
                }
              >
                {topFixes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
