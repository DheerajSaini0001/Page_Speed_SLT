import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { Check, X, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import CircularProgress from "../Component/CircularProgress"; // Imported CircularProgress

export default function Security_Compilance({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) return <div />;

  // ScoreBadge with descriptive text
  const ScoreBadge = ({ score, textGood, textBad }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;
    return (
      <span className={`px-2.5 flex items-center gap-1.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform ${cssscore}`}>
        {hasValue} {score ? textGood : textBad}
      </span>
    );
  };

  const containerBg = darkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black" : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  // Check if any metric failed
  const hasError = 
    data.Security_or_Compliance.HTTPS.Score === 0 ||
    data.Security_or_Compliance.HSTS.Score === 0 ||
    data.Security_or_Compliance.Security_Headers.Score === 0 ||
    data.Security_or_Compliance.Cookie_Banner_and_Consent_Mode.Score === 0 ||
    data.Security_or_Compliance.Error_Pages.Score === 0;

  return (
    <div
      id="SecurityCompliance"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`flex sm:gap-10 justify-center items-center text-3xl font-extrabold mb-6 text-center ${textColor}`}>
        Security/Compliance 
         <CircularProgress
                  value={data.Security_or_Compliance.Security_or_Compliance_Score_Total}
                  size={70}
                  stroke={5}
                />

        
      </h1>

      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div className="flex justify-between items-center">
            <span className={textColor}>Hypertext Transfer Protocol Secure (HTTPS)</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.HTTPS.Score} 
              textGood="HTTPS enabled" 
              textBad="HTTPS missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>HTTP Strict Transport Security (HSTS)</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.HSTS.Score} 
              textGood="HSTS enabled" 
              textBad="HSTS missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Security Headers</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Security_Headers.Score} 
              textGood="Headers present" 
              textBad="Headers missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Cookie Banner & Consent Mode</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Cookie_Banner_and_Consent_Mode.Score} 
              textGood="Banner found" 
              textBad="Banner missing"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>404/500 Handling</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Error_Pages.Score} 
              textGood="Custom error page" 
              textBad="No error page"
            />

          </div>
        </div>

        {/* Conditionally show error messages */}
        {hasError && <hr className="text-black mt-3" />}
        <div className="p-1 mt-2">
          {data.Security_or_Compliance.HTTPS.Score === 0 && (
            <h1 className="flex gap-2 text-black"><AlertTriangle className='text-red-600' size={20} /> HTTPS not enabled</h1>
          )}
          {data.Security_or_Compliance.HSTS.Score === 0 && (
            <h1 className="flex gap-2 text-black"><AlertTriangle className='text-red-600' size={20} /> HSTS missing</h1>
          )}
          {data.Security_or_Compliance.Security_Headers.Score === 0 && (
            <h1 className="flex gap-2 text-black"><AlertTriangle className='text-red-600' size={20} /> Security headers missing</h1>
          )}
          {data.Security_or_Compliance.Cookie_Banner_and_Consent_Mode.Score === 0 && (
            <h1 className="flex gap-2 text-black"><AlertTriangle className='text-red-600' size={20} /> Cookie banner / consent missing</h1>
          )}
          {data.Security_or_Compliance.Error_Pages.Score === 0 && (
            <h1 className="flex gap-2 text-black"><AlertTriangle className='text-red-600' size={20} /> Custom error pages not found</h1>
          )}
        </div>
      </div>
    </div>
  );
}
