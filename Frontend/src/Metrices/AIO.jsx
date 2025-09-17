import React from "react";

export default function AIO({ data }) {
  if (!data || !data.Metrices) {
    return (
      <div >
     
      </div>
    );
  }

const ScoreBadge = ({ score, out }) => (
  <span
    className="px-2.5 py-1 rounded-full text-white font-semibold text-sm
               bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
               shadow-md transform transition-transform hover:scale-110"
  >
    {score}/{out}
  </span>
);


  return (
    <div id="AIOReadiness" className="min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300  m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        AIO (AI-Optimization) Readiness{" "}
        <span className="text-white">
          ({data.Metrices?.AIO_Readiness?.AIO_Readiness_Score_Total} out of 10)
        </span>
      </h1>
      <h1 className="text-3xl font-extrabold text-white mb-6">
        AIO Compatibility Badge -{" "}
        <span className="text-white">
          {data.Metrices?.AIO_Readiness?.AIO_Compatibility_Badge}
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Entity & Organization Clarity{" "}
          <span className="text-white">
            ({data.Metrices?.AIO_Readiness?.Entity_and_Organization_Clarity?.Total_Score_G1 || 0} out of 4)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Organization JSON-LD Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Entity_and_Organization_Clarity?.Organization_JSON_LD_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Consistent NAP Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Entity_and_Organization_Clarity?.Consistent_NAP_Score ?? 0} out={1} />
          </div>
          <div className="flex justify-between items-center">
            <span>Humans/Policies Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Entity_and_Organization_Clarity?.Humans_or_Policies_Score ?? 0} out={1} />
          </div>
        </div>
      </div>

      {/* Delivery & Render */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Content Answerability & Structure{" "}
          <span className="text-white">
            ({data.Metrices?.AIO_Readiness?.Content_Answerability_and_Structure?.Total_Score_G2 || 0} out of 3)
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">

          <div className="flex justify-between items-center">
            <span>FAQ/How-To-JSON-LD Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Content_Answerability_and_Structure?.FAQ_or_How_To_JSON_LD_Score ?? 0} out={1.5} />
          </div>
          <div className="flex justify-between items-center">
            <span>Section Anchors/TOC Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Content_Answerability_and_Structure?.Section_Anchors_or_TOC_Score ?? 0} out={1} />
          </div>
          <div className="flex justify-between items-center">
            <span>Descriptive Media Captions/Figcaptions Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Content_Answerability_and_Structure?.Descriptive_Media_Captions_or_Figcaptions_Score ?? 0} out={0.5} />
          </div>
        </div>
      </div>

            {/* Crawlability & Hygiene */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Product/Inventory Schema & Feeds{" "}
          <span className="text-white">
            ({data.Metrices?.AIO_Readiness?.Product_or_Inventory_Schema_and_Feeds?.Total_Score_G3 || 0} out of 2)
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">

          <div className="flex justify-between items-center">
            <span>Correct Schema Types Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Product_or_Inventory_Schema_and_Feeds?.Correct_Schema_Types_Score ?? 0} out={1.5} />
          </div>
          <div className="flex justify-between items-center">
            <span>Feed Availability Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Product_or_Inventory_Schema_and_Feeds?.Feed_Availability_Score ?? 0} out={0.5} />
          </div>
        </div>
      </div>
      {/* Crawlability & Hygiene */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Crawl Friendliness for Knowledge Agents{" "}
          <span className="text-white">
            ({data.Metrices?.AIO_Readiness?.Crawl_Friendliness_for_Knowledge_Agents?.Total_Score_G4 || 0} out of 1)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Robots Allowlist Score</span>
            <ScoreBadge score={data.Metrices?.AIO_Readiness?.Crawl_Friendliness_for_Knowledge_Agents?.Robots_Allowlist_Score ?? 0} out={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
