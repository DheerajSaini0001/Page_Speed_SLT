import React from "react";

export default function AIO({ data }) {
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
    <div id="AIOReadiness" className="min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300  m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-amber-100 mb-6">
        AIO (AI-Optimization) Readiness{" "}
        <span className="text-gray-100">
          ({data.jsonData?.G?.AIO_Readiness_Score_Total.toFixed(1)} out of 10)
        </span>
      </h1>
      <h1 className="text-3xl font-extrabold text-amber-100 mb-6">
        AIO Compatibility Badge -{" "}
        <span className="text-gray-100">
          {data.jsonData?.G?.AIO_Compatibility_Badge}
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Entity & Organization Clarity{" "}
          <span className="text-white">
            ({data.jsonData?.G?.G1?.Total_Score_G1 || 0} out of 4)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Organization JSON-LD Score</span>
            <ScoreBadge score={data.jsonData?.G?.G1?.Organization_JSON_LD_Score.toFixed(1) ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Consistent NAP Score</span>
            <ScoreBadge score={data.jsonData?.G?.G1?.Consistent_NAP_Score ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Humans/Policies Score</span>
            <ScoreBadge score={data.jsonData?.G?.G1?.Humans_or_Policies_Score ?? 0} />
          </div>
        </div>
      </div>

      {/* Delivery & Render */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Content Answerability & Structure{" "}
          <span className="text-white">
            ({data.jsonData?.G?.G2?.Total_Score_G2 || 0} out of 3)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>FAQ/How-To-JSON-LD Score</span>
            <ScoreBadge score={data.jsonData?.G?.G2?.FAQ_or_How_To_JSON_LD_Score ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Section Anchors/TOC Score</span>
            <ScoreBadge score={data.jsonData?.G?.G2?.Section_Anchors_or_TOC_Score ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Descriptive Media Captions/Figcaptions Score</span>
            <ScoreBadge score={data.jsonData?.G?.G2?.Descriptive_Media_Captions_or_Figcaptions_Score ?? 0} />
          </div>
        </div>
      </div>

            {/* Crawlability & Hygiene */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Product/Inventory Schema & Feeds{" "}
          <span className="text-white">
            ({data.jsonData?.G?.G3?.Total_Score_G3 || 0} out of 2)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Correct Schema Types Score</span>
            <ScoreBadge score={data.jsonData?.A?.A3?.Correct_Schema_Types_Score ?? 0} />
          </div>
          <div className="flex justify-between items-center">
            <span>Feed Availability Score</span>
            <ScoreBadge score={data.jsonData?.A?.A3?.Feed_Availability_Score ?? 0} />
          </div>
        </div>
      </div>
      {/* Crawlability & Hygiene */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Crawl Friendliness for Knowledge Agents{" "}
          <span className="text-white">
            ({data.jsonData?.G?.G4?.Total_Score_G4 || 0} out of 1)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Robots Allowlist Score</span>
            <ScoreBadge score={data.jsonData?.A?.A3?.Robots_Allowlist_Score ?? 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
