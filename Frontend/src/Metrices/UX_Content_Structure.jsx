import React from 'react';


export default function UX_Content_Structure({ data }) {
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
    <div id="UXContentStructure" className="min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300  m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        UX Content Structure{" "}
        <span className="text-white">
          ({data.jsonData?.E?.UX_and_Content_Structure_Score_Total} out of 10)
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Mobile Friendliness Score</span>
            <ScoreBadge score={data.jsonData?.E.Mobile_Friendliness_Score ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span>Navigation Depth Score</span>
            <ScoreBadge score={data.jsonData?.E.Navigation_Depth_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Layout Shift On interactions Score</span>
            <ScoreBadge score={data.jsonData?.E.Layout_Shift_On_interactions_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Readability Score</span>
            <ScoreBadge score={data.jsonData?.E.Readability_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Intrusive Interstitials Score</span>
            <ScoreBadge score={data.jsonData?.E.Intrusive_Interstitials_Score ?? 0} out={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

