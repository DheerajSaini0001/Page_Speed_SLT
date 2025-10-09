import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X, AlertTriangle } from "lucide-react";
import CircularProgress from "../Component/CircularProgress";
import AuditDropdown from "../Component/AuditDropdown";

export default function UX_Content_Structure({ data }) {
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

 
  return (
    <div
      id="UXContentStructure"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`responsive text-heading-25 flex sm:gap-10 justify-center items-center text-3xl font-extrabold mb-6 text-center ${textColor}`}>
        UX Content Structure
       
        <CircularProgress
          value={data.UX_or_Content_Structure.Percentage}
          size={70}
          stroke={5}
        />
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Navigation Clarity</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Navigation_Clarity.Score}
              textGood="Mobile friendly"
              textBad="Not mobile friendly"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Breadcrumbs</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Breadcrumbs.Score}
              textGood="Navigation depth OK"
              textBad="Navigation depth too deep"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}> Clickable Logo</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Clickable_Logo.Score}
              textGood="Stable layout"
              textBad="Layout shifts detected"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Mobile Responsiveness</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Mobile_Responsiveness.Score}
              textGood="Responsive design"
              textBad="Not responsive"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Paragraph Length and Spacing</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Paragraph_Length_and_Spacing.Score}
              textGood="Good paragraph length and spacing"
              textBad="Poor paragraph length and spacing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Font Style and Size Consistency</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Font_Style_and_Size_Consistency.Score}
              textGood="Consistent font style and size"
              textBad="Inconsistent font style and size"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Contrast and Color Harmony</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Contrast_and_Color_Harmony.Score}
              textGood="Good contrast and color harmony"
              textBad="Poor contrast and color harmony"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Whitespace Usage</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Whitespace_Usage.Score}
              textGood="Good whitespace usage"
              textBad="Poor whitespace usage"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Content Relevance</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Content_Relevance.Score}
              textGood="Relevant content"
              textBad="Irrelevant content"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Call to Action Clarity</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Call_to_Action_Clarity.Score}
              textGood="Clear call to action"
              textBad="Unclear call to action"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Multimedia Balance</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Multimedia_Balance.Score}
              textGood="Well-balanced multimedia"
              textBad="Poor multimedia balance"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Internal Linking Quality</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Internal_Linking_Quality.Score}
              textGood="High-quality internal links"
              textBad="Low-quality internal links"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>User Journey Continuity</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.User_Journey_Continuity.Score}
              textGood="Smooth user journey"
              textBad="Disjointed user journey"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Error and Empty State Handling</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Error_and_Empty_State_Handling.Score}
              textGood="Effective error and empty state handling"
              textBad="Ineffective error and empty state handling"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Interactive Feedback</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Interactive_Feedback.Score}
              textGood="Effective interactive feedback"
              textBad="Ineffective interactive feedback"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Sticky Navigation</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Sticky_Navigation.Score}
              textGood="Effective sticky navigation"
              textBad="Ineffective sticky navigation"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Scroll Depth Logic</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Scroll_Depth_Logic.Score}
              textGood="Effective scroll depth logic"
              textBad="Ineffective scroll depth logic"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Loading Indicators</span>

            <ScoreBadge
              score={data.UX_or_Content_Structure.Loading_Indicators.Score}
              textGood="Effective loading indicators"
              textBad="Ineffective loading indicators"
            />
          </div>
        </div>
        
      </div>
        <AuditDropdown items={data.UX_or_Content_Structure.Passed} title="Passed Audits" darkMode={darkMode} />
        <AuditDropdown items={data.UX_or_Content_Structure.Warning} title="Warning" darkMode={darkMode} />
        <AuditDropdown items={data.UX_or_Content_Structure.Improvements} title="Failed Audits" darkMode={darkMode} />
    </div>
  );
}
