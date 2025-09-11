import React from 'react';


export default function UX_Content_Structure({ data }) {
  if (!data || !data.jsonData) {
    return (
      <div >
     
      </div>
    );
  }

  const ScoreBadge = ({ score }) => (
    <span
      className={`px-2 py-1 rounded-full text-white font-semibold text-xs ${
        score >= 8
          ? "bg-green-500"
          : score >= 5
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
    >
      {score}
    </span>
  );

  return (
    <div id="UXContentStructure" className="min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300  m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-amber-100 mb-6">
        UX Content Structure{" "}
        <span className="text-gray-100">
          ({data.jsonData?.E?.UX_and_Content_Structure_Score_Total.toFixed(1)} out of 10)
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Mobile Friendliness Score</span>
            <ScoreBadge score={data.jsonData?.E.Mobile_Friendliness_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Navigation Depth Score</span>
            <ScoreBadge score={data.jsonData?.E.Navigation_Depth_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Layout Shift On interactions Score</span>
            <ScoreBadge score={data.jsonData?.E.Layout_Shift_On_interactions_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Readability Score</span>
            <ScoreBadge score={data.jsonData?.E.Readability_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Intrusive Interstitials Score</span>
            <ScoreBadge score={data.jsonData?.E.Intrusive_Interstitials_Score.toFixed(1) ?? 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

