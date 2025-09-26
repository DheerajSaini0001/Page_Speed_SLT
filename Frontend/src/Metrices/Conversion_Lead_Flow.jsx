import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X, AlertTriangle } from "lucide-react";
import CircularProgress from "../Component/CircularProgress";

export default function Conversion_Lead_Flow({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) return <div />;

  // ScoreBadge with descriptive text
  const ScoreBadge = ({ score, textGood, textBad }) => {
    const cssscore = score ? "mobilebutton bg-green-300" : "mobilebutton bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;
    return (
      <span
        className={`px-2.5 flex items-center gap-1.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform ${cssscore}`}
      >
        {hasValue} {score ? textGood : textBad}
      </span>
    );
  };

  const containerBg = darkMode
    ? "bg-zinc-900 border-gray-700 text-white"
    : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  // Check if any Conversion metric failed
  const hasError =
    data.Conversion_and_Lead_Flow.Primary_CTAs.Score === 0 ||
    data.Conversion_and_Lead_Flow.Forms.Score === 0 ||
    data.Conversion_and_Lead_Flow.Thank_You_or_Success_State.Score === 0 ||
    data.Conversion_and_Lead_Flow.Tracking_Of_Form_Submits_or_Events.Score === 0 ||
    data.Conversion_and_Lead_Flow.Contact_Info.Score === 0 ||
    data.Conversion_and_Lead_Flow.Load_On_CRM_or_Webhook.Score === 0;

  return (
    <div
      id="ConversionLeadFlow"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`responsive text-heading-25 flex sm:gap-10 justify-center items-center text-3xl font-extrabold mb-6 text-center ${textColor}`}>
        Conversion Lead Flow
        <CircularProgress
          value={data.Conversion_and_Lead_Flow.Conversion_and_Lead_Flow_Score_Total}
          size={70}
          stroke={5}
        />
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Primary (Call-to-Actions) CTAs</span>
            <ScoreBadge
              score={data.Conversion_and_Lead_Flow.Primary_CTAs.Score}
              textGood="CTAs implemented"
              textBad="CTAs missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Forms</span>
            <ScoreBadge
              score={data.Conversion_and_Lead_Flow.Forms.Score}
              textGood="Forms functional"
              textBad="Forms missing or broken"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Thank-You/Success State</span>
            <ScoreBadge
              score={data.Conversion_and_Lead_Flow.Thank_You_or_Success_State.Score}
              textGood="Success page implemented"
              textBad="Success page missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Tracking of Form Submits/Events</span>
            <ScoreBadge
              score={data.Conversion_and_Lead_Flow.Tracking_Of_Form_Submits_or_Events.Score}
              textGood="Tracking implemented"
              textBad="Tracking missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Contact Info</span>
            <ScoreBadge
              score={data.Conversion_and_Lead_Flow.Contact_Info.Score ?? 0}
              textGood="Contact info present"
              textBad="Contact info missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Load on CRM/Webhook</span>
            <ScoreBadge
              score={data.Conversion_and_Lead_Flow.Load_On_CRM_or_Webhook.Score}
              textGood="Data flows to CRM"
              textBad="CRM/Webhook integration missing"
            />
          </div>
        </div>

        {/* Conditionally show error messages */}
        {hasError && <hr className="text-black mt-3" />}
        <div className="flex flex-col p-1 mt-2 gap-2">
          {data.Conversion_and_Lead_Flow.Primary_CTAs.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> No prominent CTA found above the fold
            </h1>
          )}
          {data.Conversion_and_Lead_Flow.Forms.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> Some forms on this page do not contain any input, textarea, or select elements.
            </h1>
          )}
          {data.Conversion_and_Lead_Flow.Thank_You_or_Success_State.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> No 'Thank You' or success page link found
            </h1>
          )}
          {data.Conversion_and_Lead_Flow.Tracking_Of_Form_Submits_or_Events.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> No tracking/analytics scripts found
            </h1>
          )}
          {data.Conversion_and_Lead_Flow.Contact_Info.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} />Some Contact info are missing
            </h1>
          )}
          {data.Conversion_and_Lead_Flow.Load_On_CRM_or_Webhook.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} />  No CRM/contact forms found
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
