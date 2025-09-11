import React from 'react';


export default function Accessibility({ data }) {
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
    <div id="accessibility" className=" min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300  m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-amber-100 mb-6">
        Accessibility{" "}
        <span className="text-gray-100">
          ({data.jsonData?.C?.Accessibility_Score_Total.toFixed(1)} out of 12)
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Color Contrast Score</span>
            <ScoreBadge score={data.jsonData?.C.Color_Contrast_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Focusable/Keyword Nav Score</span>
            <ScoreBadge score={data.jsonData?.C.Focusable_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>ARIA/Labelling Score</span>
            <ScoreBadge score={data.jsonData?.C.ARIA_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Alt/Text Equivalents Score</span>
            <ScoreBadge score={data.jsonData?.C.Alt_or_Text_Equivalents_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Skip Links/Landmarks Score</span>
            <ScoreBadge score={data.jsonData?.C.Skip_Links_or_Landmarks_Score.toFixed(1) ?? 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

