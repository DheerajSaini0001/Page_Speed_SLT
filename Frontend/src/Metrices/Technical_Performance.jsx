import React from "react";

export default function Technical_Performance({ data }) {
  if (!data || !data.jsonData) {
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
    <div id="TechnicalPerformance" className="min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300  m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        Technical Performance{" "}
        <span className="text-white">
          ({data.jsonData?.A?.Technical_Performance_Score_Total.toFixed(1)} out of 28)
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Core Web Vitals{" "}
          <span className="text-white">
            ({data.jsonData?.A?.A1?.Total_Score_A1.toFixed(1) || 0} out of 12)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Largest Contentful Paint (LCP) Score</span>
            <ScoreBadge score={data.jsonData?.A?.A1?.LCP_Score.toFixed(1) ?? 0} out={5} />
          </div>
          <div className="flex justify-between items-center">
            <span>Cumulative Layout Shift (CLS) Score</span>
            <ScoreBadge score={data.jsonData?.A?.A1?.CLS_Score.toFixed(1) ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span>Interaction to Next Paint (INP) Score</span>
            <ScoreBadge score={data.jsonData?.A?.A1?.INP_Score.toFixed(1) ?? 0} out={4} />
          </div>
        </div>
      </div>

      {/* Delivery & Render */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Delivery & Render{" "}
          <span className="text-white">
            ({data.jsonData?.A?.A2?.Total_Score_A2.toFixed(1) || 0} out of 8)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Time to First Byte (TTFB) Score</span>
            <ScoreBadge score={data.jsonData?.A?.A2?.TTFB_Score.toFixed(1) ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span>Compression Score</span>
            <ScoreBadge score={data.jsonData?.A?.A2?.Compression_Score.toFixed(1) ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Caching Score</span>
            <ScoreBadge score={data.jsonData?.A?.A2?.Caching_Score.toFixed(1) ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>HTTP/2 or HTTP/3 Score</span>
            <ScoreBadge score={data.jsonData?.A?.A2?.HTTP_Score.toFixed(1) ?? 0} out={1} />
          </div>
        </div>
      </div>

      {/* Crawlability & Hygiene */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Crawlability & Hygiene{" "}
          <span className="text-white">
            ({data.jsonData?.A?.A3?.Total_Score_A3.toFixed(1) || 0} out of 8)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Sitemap Score</span>
            <ScoreBadge score={data.jsonData?.A?.A3?.Sitemap_Score.toFixed(1) ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Robots Score</span>
            <ScoreBadge score={data.jsonData?.A?.A3?.Robots_Score.toFixed(1) ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Broken Links Score</span>
            <ScoreBadge score={data.jsonData?.A?.A3?.Broken_Links_Score.toFixed(1) ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Redirect Chains Score</span>
            <ScoreBadge score={data.jsonData?.A?.A3?.Redirect_Chains_Score.toFixed(1) ?? 0} out={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
