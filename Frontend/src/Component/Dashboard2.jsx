import React, { useContext } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import CircularProgress from "./CircularProgress";
import { ThemeContext } from "../ThemeContext"; // ✅ ThemeContext import

export default function Dashboard2({ data }) {
  const { darkMode } = useContext(ThemeContext); // ✅ useContext

  if (!data || !data.Overall_Data) return <div />;

  const sectionLabels = {
    A: "Technical Performance",
    B: "On Page SEO",
    C: "Accessibility",
    D: "Security/Compliance",
    E: "UX & Content",
    F: "Conversion & Lead Flow",
    G: "AIO Readiness",
  };
  const sectionOutOf = {
    A: 28,
    B: 22,
    C: 12,
    D: 8,
    E: 10,
    F: 10,
    G: 10,
  };

  const { sectionScores, topFixes, totalScore } = data.Overall_Data;

  const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#d946ef",
  ];

  // ✅ Dynamic theme classes
  const cardBg = darkMode ? "bg-gray-900 text-white" : "bg-white text-black";
  const cardBorder = darkMode ? "border-gray-700" : "border-gray-300";
  const sectionText = darkMode ? "text-gray-400" : "text-gray-600";
  const btnBg = darkMode ? "bg-green-500 hover:bg-green-600 text-white " : "bg-green-400 hover:bg-green-500 text-black";

  return (
    <div
      id="deshboard"
      className={`min-h-screen w-full p-4 sm:p-6 grid grid-cols-1 gap-6 ${darkMode ? "text-white" : "text-black"}`}
    >
      {/* URL + Button */}
      <div className={`flex justify-between items-center p-4 rounded-lg ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <p className={`${darkMode ? "text-white" : "text-black"} sm:text-xl lg:text-3xl`}>
          URL - <a href={`${data.Metrices_Data.URL}`} target="_blank" className="text-blue-400 hover:underline">{data.Metrices_Data.URL}</a>
        </p>
        <a href="/">
          <button className={`font-semibold lg:py-2 lg:px-4  sm:pr-4 sm:pl-2 rounded-lg shadow-md transition ${btnBg}`}>
            Check for Other
          </button>
        </a>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-indigo-200 via-blue-400 to-indigo-200 rounded-2xl shadow-xl p-6 text-center flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-20
       lg:gap-30">
        <CircularProgress value={totalScore} size={120} stroke={10} />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Overall Score</h2>
          <p className="text-4xl sm:text-5xl font-extrabold mt-2">{totalScore.toFixed(1)}/100</p>
          <p className="text-gray-200 text-sm sm:text-base mt-1">Website Health Index</p>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Grade - {data.Overall_Data.grade}</h1>
          <p className="text-lg sm:text-xl mt-1 font-semibold">AIO Compatibility - {data.Overall_Data.badge}</p>
        </div>
      </div>

      {/* Section Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(sectionScores).map(([key, value], index) => (
          <div
            key={key}
            className={`rounded-xl p-4 shadow-lg border ${cardBorder} text-center ${cardBg}`}
          >
            <h3 className={`text-xs sm:text-sm ${sectionText}`}>{sectionLabels[key]} Score</h3>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
              {value.toFixed(1)}/{sectionOutOf[key]}
            </p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className={`rounded-xl p-4 shadow-lg border ${cardBorder} ${cardBg}`}>
        <h3 className="text-base sm:text-lg font-semibold mb-4">Top Fixes Needed</h3>
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
                label={({ name }) => (name.length > 14 ? name.slice(0, 14) + "..." : name)}
              >
                {topFixes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px", color: darkMode ? "white" : "black" }} // ✅ legend text color
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className={`rounded-xl p-4 shadow-lg border ${cardBorder} ${cardBg}`}>
        <h3 className="sm:text-2xl font-semibold text-green-500 mb-4">
          👉 Recommendations to improve Website Performance -
        </h3>
        {data.Overall_Data.recommendations.map((val, index) => (
          <div key={index} className="text-base sm:text-lg p-2 pl-6 font-semibold mb-4">
            {index + 1} - {val}
          </div>
        ))}
      </div>
    </div>
  );
}
