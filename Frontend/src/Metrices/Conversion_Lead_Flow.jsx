import React from 'react';


export default function Conversion_Lead_Flow({ data }) {
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
    <div id="ConversionLeadFlow" className="min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300  m-4 flex flex-col items-center justify-start p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-white mb-6">
        Conversion Lead Flow{" "}
        <span className="text-white">
          ({data.Metrices?.Conversion_and_Lead_Flow?.Conversion_and_Lead_Flow_Score_Total} out of 10)
        </span>
      </h1>

      {/* Core Web Vitals */}
      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span> Primary CTAs Score</span>
            <ScoreBadge score={data.Metrices?.Conversion_and_Lead_Flow. Primary_CTAs_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Forms Score</span>
            <ScoreBadge score={data.Metrices?.Conversion_and_Lead_Flow.Forms_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Thank-You/Success State Score</span>
            <ScoreBadge score={data.Metrices?.Conversion_and_Lead_Flow.Thank_You_or_Success_State_Score ?? 0} out={1} />
          </div>
          <div className="flex justify-between items-center">
            <span>Tracking of Form Submits/Events Score</span>
            <ScoreBadge score={data.Metrices?.Conversion_and_Lead_Flow.Tracking_Of_Form_Submits_or_Events_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Contact Info Score</span>
            <ScoreBadge score={data.Metrices?.Conversion_and_Lead_Flow.Contact_Info_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Load on CRM/Webhook Score</span>
            <ScoreBadge score={data.Metrices?.Conversion_and_Lead_Flow.Load_On_CRM_or_Webhook_Score ?? 0} out={1} />
          </div>
        </div>
      </div>
    </div>
  );
}

