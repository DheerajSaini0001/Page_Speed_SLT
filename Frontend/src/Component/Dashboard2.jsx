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

  if (!data || !data.result) return <div />;


  if (!data || !data.result) {
    return (
      <div>
      </div>
    );
  }

console.log(data);

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

  const { sectionScores, topFixes, totalScore } = data.result;

  const sectionData = Object.entries(sectionScores).map(([key, value]) => ({
    name: sectionLabels[key],
    score: value,
    outOf: sectionOutOf[key]
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
    <div className="min-h-screen w-full  text-white p-4 sm:p-6 grid grid-cols-1 gap-6">
     
<div class="flex justify-between items-center bg-gray-900 p-4 rounded-lg">
  <p class="text-white text-xl">
    URL:- <a href={`${data.jsonData.URL}`} target="-blank" class="text-blue-400 hover:underline">{data.jsonData.URL}</a>
  </p>
 <a href="/"> <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition">
    Check for More
  </button></a>
</div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-xl p-6 text-center flex flex-col sm:flex-row sm:justify-center sm:items-center gap-30">
        <CircularProgress value={totalScore} size={120} stroke={10} />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Overall Score</h2>
          <p className="text-4xl sm:text-5xl font-extrabold mt-2">{totalScore.toFixed(1)}/100</p>
          <p className="text-gray-200 text-sm sm:text-base mt-1">Website Health Index</p>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Grade - {data.result.grade}</h1>
          <p className="text-lg sm:text-xl mt-1 font-semibold">AIO Compatibility - {data.result.badge}</p>
        </div>
      </div>

      {/* Section Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(sectionScores).map(([key, value], index) => (
          <div
            key={key}
            className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 text-center"
          >
            <h3 className="text-xs sm:text-sm text-gray-400">{sectionLabels[key]} Score</h3>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
              {value.toFixed(1)}/{sectionOutOf[key]}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Section Scores</h3>
        <div className="w-full h-64 sm:h-72 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectionData}>
              <XAxis dataKey="name" stroke="#aaa" tick={{ fontSize: 10 }} />
              <YAxis stroke="#aaa" tick={{ fontSize: 10 }} />
              <Tooltip />
              
              <Bar dataKey="score">
                {sectionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
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
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
         <h3 className=" sm:text-2xl font-semibold text-bold text-green-500 text-2xl mb-4 ">👉 Recommendations to improve Webite Performance :-</h3>
        {data.result.recommendations.map((val,index)=>(
          <div className="text-base sm:text-lg p-2 pl-6 font-semibold mb-4">
            {index+1} - {val}
          </div>
        ))}
      </div>
    </div>
  );
}
