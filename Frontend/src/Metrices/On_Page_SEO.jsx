import React from 'react';


export default function On_Page_SEO({ data }) {
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
    <div id="OnPageSEO" className="min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        On-Page SEO{" "}
        <span className="text-white">
          ({data.jsonData?.B?.On_Page_SEO_Score_Total.toFixed(1)} out of 22)
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Essentials{" "}
          <span className="text-white">
            ({data.jsonData?.B?.B1?.Total_Score_B1.toFixed(1) || 0} out of 12)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Unique Title Score</span>
            <ScoreBadge score={data.jsonData?.B?.B1?.Unique_Title_Score.toFixed(1) ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span>Meta Description Score</span>
            <ScoreBadge score={data.jsonData?.B?.B1?.Meta_Description_Score.toFixed(1) ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Canonical Score</span>
            <ScoreBadge score={data.jsonData?.B?.B1?.Canonical_Score.toFixed(1) ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>H1 Score</span>
            <ScoreBadge score={data.jsonData?.B?.B1?.H1_Score.toFixed(1) ?? 0} out={3} />
          </div>
        </div>
      </div>

      {/* Delivery & Render */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Media & Semantics{" "}
          <span className="text-white">
            ({data.jsonData?.B?.B2?.Total_Score_B2.toFixed(1) || 0} out of 6)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Image ALT Score</span>
            <ScoreBadge score={data.jsonData?.B?.B2?.Image_ALT_Score.toFixed(1) ?? 0} out={3}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Heading Hierarcy Score</span>
            <ScoreBadge score={data.jsonData?.B?.B2?.Heading_Hierarchy_Score.toFixed(1) ?? 0} out={2}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Descriptive Links Score</span>
            <ScoreBadge score={data.jsonData?.B?.B2?.Descriptive_Links_Score.toFixed(1) ?? 0} out={1} />
          </div>
        </div>
      </div>

      {/* Crawlability & Hygiene */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <h2 className="text-xl font-bold text-white mb-4">
          Structure & Uniqueness{" "}
          <span className="text-white">
            ({data.jsonData?.B?.B3?.Total_Score_B3.toFixed(1) || 0} out of 6)
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>URL Slugs Score</span>
            <ScoreBadge score={data.jsonData?.B?.B3?.URL_Slugs_Score.toFixed(1) ?? 0} out={2}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Duplicate Content Score</span>
            <ScoreBadge score={data.jsonData?.B?.B3?.Duplicate_Content_Score.toFixed(1) ?? 0} out={3}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Pagination Tags Score</span>
            <ScoreBadge score={data.jsonData?.B?.B3?.Pagination_Tags_Score.toFixed(1) ?? 0} out={1}/>
          </div>
        </div>
      </div>
    </div>
  );
}

