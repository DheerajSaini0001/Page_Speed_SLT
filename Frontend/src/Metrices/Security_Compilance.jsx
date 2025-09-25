import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { Check, X } from "lucide-react"; // Imported Check and X icons

export default function Security_Compilance({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) {
    return <div></div>;
  }

  // Updated ScoreBadge to match the other components' style and logic
  const ScoreBadge = ({ score }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform  ${cssscore}`}
      >
        {hasValue}
      </span>
    );
  };

  // Theme-based classes
  const containerBg = darkMode ? "bg-zinc-900 border-gray-700" : "bg-gray-100 border-gray-300";
  const cardBg = darkMode ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black" : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div
      id="SecurityCompliance"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`text-3xl font-extrabold mb-6 text-heading-25 ${textColor}`}>
        Security/Compliance{" "}
       
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>HTTPS</span>
            <ScoreBadge score={data.Security_or_Compliance.HTTPS.Score} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>HSTS</span>
            <ScoreBadge score={data.Security_or_Compliance.HSTS.Score} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Security Headers</span>
            <ScoreBadge score={data.Security_or_Compliance.Security_Headers.Score} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Cookie Banner & Consent Mode</span>
            <ScoreBadge score={data.Security_or_Compliance.Cookie_Banner_and_Consent_Mode.Score} />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>404/500 handling</span>
            <ScoreBadge score={data.Security_or_Compliance.Error_Pages.Score} />
          </div>
        </div>
      </div>
    </div>
  );
}