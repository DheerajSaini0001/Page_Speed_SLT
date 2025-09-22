import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

export default function On_Page_SEO({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data || !data.Metrices_Data) return <div />;

  const ScoreBadge = ({ score, out }) => {
    const badgeBg = darkMode
      ? "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-black"
      : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white";

    return (
      <span className={darkMode? "px-2.5 py-1 rounded-full   text-black bg-white font-semibold text-sm shadow-md transform transition-transform hover:scale-110":" px-2.5 py-1 rounded-full text-white bg-black font-semibold text-sm shadow-md transform transition-transform hover:scale-110"}>
        {score}/{out}
      </span>
    );
  };

  const containerBg = darkMode
    ? "bg-gray-900 border-gray-700 text-white"
    : "bg-gray-100 border-gray-300 text-black";

  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";

  return (
    <div
      id="OnPageSEO"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className="text-3xl font-extrabold mb-6">
        On-Page SEO{" "}
        <span className="text-custom-18">
          ({data.Metrices_Data?.On_Page_SEO?.On_Page_SEO_Score_Total}/22)
        </span>
      </h1>

      {/* Essentials */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-4">
          Essentials{" "}
          <span>
            ({data.Metrices_Data?.On_Page_SEO?.Essentials?.Total_Score_B1 || 0}/10)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span>Unique Title Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Essentials?.Unique_Title_Score ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span>Meta Description Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Essentials?.Meta_Description_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>Canonical Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Essentials?.Canonical_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span>H1 Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Essentials?.H1_Score ?? 0} out={3} />
          </div>
        </div>
      </div>

      {/* Media & Semantics */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-4">
          Media & Semantics{" "}
          <span>
            ({data.Metrices_Data?.On_Page_SEO?.Media_and_Semantics?.Total_Score_B2 || 0}/6)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4  text-sm">
          <div className="flex justify-between items-center">
            <span>Image ALT Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Media_and_Semantics?.Image_ALT_Score ?? 0} out={3}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Heading Hierarchy Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Media_and_Semantics?.Heading_Hierarchy_Score ?? 0} out={2}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Descriptive Links Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Media_and_Semantics?.Descriptive_Links_Score ?? 0} out={1} />
          </div>
        </div>
      </div>

      {/* Structure & Uniqueness */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-4">
          Structure & Uniqueness{" "}
          <span>
            ({data.Metrices_Data?.On_Page_SEO?.Structure_and_Uniqueness?.Total_Score_B3 || 0}/6)
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span>URL Slugs Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Structure_and_Uniqueness?.URL_Slugs_Score ?? 0} out={2}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Duplicate Content Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Structure_and_Uniqueness?.Duplicate_Content_Score ?? 0} out={3}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Pagination Tags Score</span>
            <ScoreBadge score={data.Metrices_Data?.On_Page_SEO?.Structure_and_Uniqueness?.Pagination_Tags_Score ?? 0} out={1}/>
          </div>
        </div>
      </div>
    </div>
  );
}
