import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X } from "lucide-react"; // Imported Check and X icons

export default function Conversion_Lead_Flow({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data || !data.Metrices_Data) return <div />;

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
  const containerBg = darkMode
    ? "bg-zinc-900 border-gray-700 text-white"
    : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div
      id="ConversionLeadFlow"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className="text-3xl font-extrabold mb-6 text-heading-25">
        Conversion Lead Flow{" "}
        
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Primary CTAs Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Conversion_and_Lead_Flow.Primary_CTAs_Score ??
                0
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Forms Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Conversion_and_Lead_Flow.Forms_Score ?? 0
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Thank-You/Success State Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Conversion_and_Lead_Flow
                  .Thank_You_or_Success_State_Score ?? 0
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>
              Tracking of Form Submits/Events Score
            </span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Conversion_and_Lead_Flow
                  .Tracking_Of_Form_Submits_or_Events_Score ?? 0
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Contact Info Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Conversion_and_Lead_Flow.Contact_Info_Score ??
                0
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Load on CRM/Webhook Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Conversion_and_Lead_Flow
                  .Load_On_CRM_or_Webhook_Score ?? 0
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}