import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function Security_Compilance({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data || !data.Metrices_Data) {
    return <div></div>;
  }

  const ScoreBadge = ({ score, out }) => (
    <span
      className={`px-2.5 py-1 rounded-full text-white font-semibold text-sm
                  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                  shadow-md transform transition-transform hover:scale-110`}
    >
      {score}/{out}
    </span>
  );

  const containerBg = darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300";
  const cardBg = darkMode ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black" : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div
      id="SecurityCompliance"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`text-3xl font-extrabold mb-6 ${textColor}`}>
        Security/Compliance{" "}
        <span className={textColor}>
          ({data.Metrices_Data?.Security_or_Compliance?.Security_or_Compliance_Score_Total} out of 8)
        </span>
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>HTTPS Score</span>
            <ScoreBadge score={data.Metrices_Data?.Security_or_Compliance.HTTPS_Score ?? 0} out={2} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>HSTS Score</span>
            <ScoreBadge score={data.Metrices_Data?.Security_or_Compliance.HSTS_Score ?? 0} out={1} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Security Headers Score</span>
            <ScoreBadge score={data.Metrices_Data?.Security_or_Compliance.Security_Headers_Score ?? 0} out={3} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Cookie Banner & Consent Mode Score</span>
            <ScoreBadge score={data.Metrices_Data?.Security_or_Compliance.Cookie_Banner_and_Consent_Mode_Score ?? 0} out={1} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>404/500 handling Score</span>
            <ScoreBadge score={data.Metrices_Data?.Security_or_Compliance.Error_Pages_Score ?? 0} out={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
