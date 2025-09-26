import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X } from "lucide-react";
import { AlertTriangle } from "lucide-react";

export default function AIO({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) return <div />;

  const ScoreBadge = ({ score, out, des }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;

    return (
      <span
        className={`${
          darkMode
            ? "px-2.5 flex py-1 rounded-full text-white font-semibold text-sm shadow-md transform transition-transform"
            : "px-2.5 flex py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform"
        } ${cssscore}`}
      >
        {hasValue} {out} {des}
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
      id="AIOReadiness"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className="text-3xl font-extrabold mb-6">
        AIO (AI-Optimization) Readiness
      </h1>

      <h1 className={`font-extrabold mb-6 text-xl ${textColor}`}>
        AIO Compatibility -{" "}
        <span className={`${textColor} text-xl`}>
          {data.AIO_Compatibility_Badge
            ? "Compatible"
            : "Not Compatible"}
        </span>
      </h1>

      {/* Entity & Organization Clarity */}
      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
          Entity & Organization Clarity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>Organization JSON-LD</span>
            <ScoreBadge
              score={data.AIO_Readiness.Entity_and_Organization_Clarity.Organization_JSON_LD_Score.Score}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Consistent NAP</span>
            <ScoreBadge
              score={data.AIO_Readiness.Entity_and_Organization_Clarity.Consistent_NAP.Score}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Humans/Policies</span>
            <ScoreBadge
              score={data.AIO_Readiness.Entity_and_Organization_Clarity.Humans_or_Policies.Score}
            />
          </div>
        </div>
      </div>

      {/* Content Answerability & Structure */}
      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
          Content Answerability & Structure
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>FAQ/How-To JSON-LD</span>
            <ScoreBadge
              score={data.AIO_Readiness.Content_Answerability_and_Structure.FAQ_or_How_To_JSON_LD.Score}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Section Anchors/TOC</span>
            <ScoreBadge
              score={data.AIO_Readiness.Content_Answerability_and_Structure.Section_Anchors_or_TOC.Score}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Descriptive Media Captions / Figcaptions</span>
            <ScoreBadge
              score={data.AIO_Readiness.Content_Answerability_and_Structure.Descriptive_Media_Captions_or_Figcaptions.Score}
            />
          </div>
        </div>
      </div>

      {/* Product/Inventory Schema & Feeds */}
      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
          Product/Inventory Schema & Feeds
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>Correct Schema Types </span>
            <ScoreBadge
              score={data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Correct_Schema_Types.Score}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Feeds Availability</span>
            <ScoreBadge
              score={data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Feed_Availability.Score}
            />
          </div>
        </div>
      </div>

      {/* Crawl Friendliness for Knowledge Agents */}
      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
          Crawl Friendliness for Knowledge Agents
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>Robots Allowlist</span>
            <ScoreBadge
              score={data.AIO_Readiness.Crawl_Friendliness_for_Knowledge_Agents.Robots_Allowlist.Score}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
