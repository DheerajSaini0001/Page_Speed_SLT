import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X, AlertTriangle } from "lucide-react";
import CircularProgress from "../Component/CircularProgress";

export default function AIO({ data }) {
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

  // Determine if any score failed
  const hasError1 =
    data.AIO_Readiness.Entity_and_Organization_Clarity.Organization_JSON_LD_Score.Score === 0 ||
    data.AIO_Readiness.Entity_and_Organization_Clarity.Consistent_NAP.Score === 0 ||
    data.AIO_Readiness.Entity_and_Organization_Clarity.Humans_or_Policies.Score === 0 ;
    const hasError2 =
    data.AIO_Readiness.Content_Answerability_and_Structure.FAQ_or_How_To_JSON_LD.Score === 0 ||
    data.AIO_Readiness.Content_Answerability_and_Structure.Section_Anchors_or_TOC.Score === 0 ||
    data.AIO_Readiness.Content_Answerability_and_Structure.Descriptive_Media_Captions_or_Figcaptions.Score === 0;

    const hasError3=
    data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Correct_Schema_Types.Score === 0 ||
    data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Feed_Availability.Score === 0;

    const hasError4=
    data.AIO_Readiness.Crawl_Friendliness_for_Knowledge_Agents.Robots_Allowlist.Score === 0;
    

  return (
    <div
      id="AIOReadiness"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`responsive text-heading-25 flex sm:gap-10 justify-center items-center text-3xl font-extrabold mb-6 text-center ${textColor}`}>
        AIO (AI-Optimization) Readiness
        <CircularProgress
          value={data.AIO_Readiness.AIO_Readiness_Score_Total}
          size={70}
          stroke={5}
        />
      </h1>

      {/* Entity & Organization Clarity */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Entity & Organization Clarity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>Organization JSON-LD</span>
            <ScoreBadge
              score={data.AIO_Readiness.Entity_and_Organization_Clarity.Organization_JSON_LD_Score.Score}
              textGood="JSON-LD present"
              textBad="JSON-LD missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Consistent NAP</span>
            <ScoreBadge
              score={data.AIO_Readiness.Entity_and_Organization_Clarity.Consistent_NAP.Score}
              textGood="NAP consistent"
              textBad="NAP inconsistent"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Humans/Policies</span>
            <ScoreBadge
              score={data.AIO_Readiness.Entity_and_Organization_Clarity.Humans_or_Policies.Score}
              textGood="Humans/policies defined"
              textBad="Humans/policies missing"
            />
          </div>
        </div>

        {/* Conditionally show errors */}
        {hasError1 && <hr className="text-black mt-3" />}
        <div className="flex flex-col p-1 mt-2 gap-2">
          {data.AIO_Readiness.Entity_and_Organization_Clarity.Organization_JSON_LD_Score.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> Organization schema is missing or incomplete — key fields like name, logo, URL, contact info, or social links are not fully defined.
            </h1>
          )}
          {data.AIO_Readiness.Entity_and_Organization_Clarity.Consistent_NAP.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> Phone numbers, emails, or addresses are inconsistent across the page (header, footer, or body), which can confuse users and harm trust/SEO.
            </h1>
          )}
          {data.AIO_Readiness.Entity_and_Organization_Clarity.Humans_or_Policies.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> Required site policies (About, Contact, Privacy, Terms, etc.) are missing or incomplete — not enough compliance information.
            </h1>
          )}
        </div>
      </div>

      {/* Content Answerability & Structure */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Content Answerability & Structure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>FAQ/How-To JSON-LD</span>
            <ScoreBadge
              score={data.AIO_Readiness.Content_Answerability_and_Structure.FAQ_or_How_To_JSON_LD.Score}
              textGood="JSON-LD present"
              textBad="JSON-LD missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Section Anchors/TOC</span>
            <ScoreBadge
              score={data.AIO_Readiness.Content_Answerability_and_Structure.Section_Anchors_or_TOC.Score}
              textGood="Anchors/TOC present"
              textBad="Anchors/TOC missing"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className={textColor}>Descriptive Media Captions / Figcaptions</span>
            <ScoreBadge
              score={data.AIO_Readiness.Content_Answerability_and_Structure.Descriptive_Media_Captions_or_Figcaptions.Score}
              textGood="Captions present"
              textBad="Captions missing"
            />
          </div>
        </div>
          {hasError2 && <hr className="text-black mt-3" />}
          <div className="flex flex-col p-1 mt-2 gap-2">
          { data.AIO_Readiness.Content_Answerability_and_Structure.FAQ_or_How_To_JSON_LD.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> No FAQ or HowTo structured data detected — page is missing schema markup for FAQs or instructional content.
            </h1>
          )}
          {data.AIO_Readiness.Content_Answerability_and_Structure.Section_Anchors_or_TOC.Score === 0&& (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> No headings have IDs — page cannot support anchor links or an automatic table of contents.
            </h1>
          )}
          {data.AIO_Readiness.Content_Answerability_and_Structure.Descriptive_Media_Captions_or_Figcaptions.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> Images on the page lack descriptive captions figcaption, which may reduce accessibility and content clarity.
            </h1>
          )}
        </div>
      </div>

      {/* Product/Inventory Schema & Feeds */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Product/Inventory Schema & Feeds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>Correct Schema Types</span>
            <ScoreBadge
              score={data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Correct_Schema_Types.Score}
              textGood="Schema correct"
              textBad="Schema missing/incorrect"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Feeds Availability</span>
            <ScoreBadge
              score={data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Feed_Availability.Score}
              textGood="Feeds present"
              textBad="Feeds missing"
            />
          </div>
        </div>
        {hasError3 && <hr className="text-black mt-3" />}
        <div className="flex flex-col p-1 mt-2 gap-2">
          {data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Correct_Schema_Types.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> The page is missing product-related structured data (JSON-LD) — search engines may not understand product info.
            </h1>
          )}
          {data.AIO_Readiness.Product_or_Inventory_Schema_and_Feeds.Feed_Availability.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> The page does not provide an RSS, Atom, or JSON feed — users cannot subscribe to content updates.
            </h1>
          )}
          
        </div>
      </div>

      {/* Crawl Friendliness */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Crawl Friendliness for Knowledge Agents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className={textColor}>Robots Allowlist</span>
            <ScoreBadge
              score={data.AIO_Readiness.Crawl_Friendliness_for_Knowledge_Agents.Robots_Allowlist.Score}
              textGood="Robots allowlisted"
              textBad="Robots disallowed/missing"
            />
          </div>
        </div>
        {hasError4 && <hr className="text-black mt-3" />}
        <div className="flex flex-col p-1 mt-2 gap-2">
          {data.AIO_Readiness.Crawl_Friendliness_for_Knowledge_Agents.Robots_Allowlist.Score === 0 && (
            <h1 className={`warn flex gap-2 items-center ${textColor}`}>
              <AlertTriangle className="text-red-600" size={20} /> robots.txt contains Disallow:  — search engines are prevented from crawling the site.
            </h1>
          )}
         
        </div>
      </div>
    </div>
  );
}
