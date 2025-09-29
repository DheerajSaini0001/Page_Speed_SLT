import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X, AlertTriangle } from "lucide-react";
import CircularProgress from "../Component/CircularProgress";

export default function Technical_Performance({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) return <div />;

  // ScoreBadge with descriptive text
  const ScoreBadge = ({ score, out,unit, des }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;
    return (
      <span
        className={`px-2.5 mobilebutton flex items-center gap-1.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform ${cssscore}`}
      >
        {hasValue} {out} {unit} {des}
      </span>
    );
  };

  const containerBg = darkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black" : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  // Check if any metric failed
  const hasError1 =
    data.Technical_Performance.Core_Web_Vitals.LCP.Score === 0 ||
    data.Technical_Performance.Core_Web_Vitals.CLS.Score === 0 ||
    data.Technical_Performance.Core_Web_Vitals.INP.Score === 0 ;
    const hasError2=
    data.Technical_Performance.Delivery_and_Render.TTFB.Score === 0 ||
    data.Technical_Performance.Delivery_and_Render.Compression.Score === 0 ||
    data.Technical_Performance.Delivery_and_Render.Caching.Score === 0 ||
    data.Technical_Performance.Delivery_and_Render.HTTP.Score === 0 ;
    const hasError3=
    data.Technical_Performance.Crawlability_and_Hygiene.Sitemap.Score === 0 ||
    data.Technical_Performance.Crawlability_and_Hygiene.Robots.Score === 0 ||
    data.Technical_Performance.Crawlability_and_Hygiene.Broken_Links.Score === 0 ||
    data.Technical_Performance.Crawlability_and_Hygiene.Redirect_Chains.Score === 0;

  return (
    <div
      id="TechnicalPerformance"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`responsive text-heading-25 flex items-center justify-center sm:gap-10 text-3xl font-extrabold mb-6 ${textColor}`}>
        Technical Performance
        <CircularProgress
          value={data.Technical_Performance.Technical_Performance_Score_Total}
          size={70}
          stroke={5}
        />
      </h1>

      {/* Core Web Vitals */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Core Web Vitals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Largest Contentful Paint (LCP)</span>
            <ScoreBadge
              score={data.Technical_Performance.Core_Web_Vitals.LCP.Score}
              out={data.Technical_Performance.Core_Web_Vitals.LCP.Time}
              unit={"Sec"}
              des={data.Technical_Performance.Core_Web_Vitals.LCP.Score ? "Good" : "Poor"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Cumulative Layout Shift (CLS)</span>
            <ScoreBadge
              score={data.Technical_Performance.Core_Web_Vitals.CLS.Score}
              out={data.Technical_Performance.Core_Web_Vitals.CLS.Time}
              des={data.Technical_Performance.Core_Web_Vitals.CLS.Score ? "Good" : "Poor"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Interaction to Next Paint (INP)</span>
            <ScoreBadge
              score={data.Technical_Performance.Core_Web_Vitals.INP.Score}
              out={data.Technical_Performance.Core_Web_Vitals.INP.Time}
              unit={"Sec"}
              des={data.Technical_Performance.Core_Web_Vitals.INP.Score ? "Good" : "Poor"}
            />
          </div>
        </div>

        {/* Warnings */}
        {hasError1 && <hr className="text-black mt-3" />}
        <div className="p-1 mt-2">
          {data.Technical_Performance.Core_Web_Vitals.LCP.Score === 0 && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> LCP is greater than 2.5 sec</h1>
          )}
          {data.Technical_Performance.Core_Web_Vitals.CLS.Score === 0 && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> CLS is greater than .1 sec</h1>
          )}
          {data.Technical_Performance.Core_Web_Vitals.INP.Score === 0 && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> INP is greater than 2 sec</h1>
          )}
        </div>
      </div>

      {/* Delivery & Render */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Delivery & Render</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Time to First Byte (TTFB)</span>
            <ScoreBadge
              score={data.Technical_Performance.Delivery_and_Render.TTFB.Score}
              out={data.Technical_Performance.Core_Web_Vitals.INP.Time}
              unit={"Sec"}
              des={data.Technical_Performance.Delivery_and_Render.TTFB.Score ? "Good" : "Poor"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Compression</span>
            <ScoreBadge
              score={data.Technical_Performance.Delivery_and_Render.Compression.Score}
              out={data.Technical_Performance.Delivery_and_Render.Compression.Score ? "Good" : "Poor"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Caching</span>
            <ScoreBadge
              score={data.Technical_Performance.Delivery_and_Render.Caching.Score}
              out={data.Technical_Performance.Delivery_and_Render.Caching.Score ? "Good" : "Poor"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>HTTP/2 or HTTP/3</span>
            <ScoreBadge
              score={data.Technical_Performance.Delivery_and_Render.HTTP.Score}
              out={data.Technical_Performance.Delivery_and_Render.HTTP.Score ? "Supported" : "Missing"}
            />
          </div>
        </div>
        {hasError2 && <hr className="text-black mt-3" />}
        <div className="p-1 mt-2">
          {!data.Technical_Performance.Delivery_and_Render.TTFB.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> Time to First Byte greater than 2 sec</h1>
          )}
          {!data.Technical_Performance.Delivery_and_Render.Compression.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" />Text compression is Missing </h1>
          )}
          {!data.Technical_Performance.Delivery_and_Render.Caching.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> Long term caching is not avalible</h1>
          )}
          {!data.Technical_Performance.Delivery_and_Render.HTTP.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> HTTP2/HTTP3 is not Enable </h1>
          )}
        </div>
      </div>

      {/* Crawlability & Hygiene */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Crawlability & Hygiene</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Sitemap</span>
            <ScoreBadge
              score={data.Technical_Performance.Crawlability_and_Hygiene.Sitemap.Score}
              out={data.Technical_Performance.Crawlability_and_Hygiene.Sitemap.Score ? "Found" : "Missing"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Robots</span>
            <ScoreBadge
              score={data.Technical_Performance.Crawlability_and_Hygiene.Robots.Score}
              out={data.Technical_Performance.Crawlability_and_Hygiene.Robots.Score ? "OK" : "Issue"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Broken Links</span>
            <ScoreBadge
              score={data.Technical_Performance.Crawlability_and_Hygiene.Broken_Links.Score}
              out={data.Technical_Performance.Crawlability_and_Hygiene.Broken_Links.Score ? "None" : "Found"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Redirect Chains</span>
            <ScoreBadge
              score={data.Technical_Performance.Crawlability_and_Hygiene.Redirect_Chains.Score}
              out={data.Technical_Performance.Crawlability_and_Hygiene.Redirect_Chains.Score ? "OK" : "Issue"}
            />
          </div>

        </div>
 {hasError3 && <hr className="text-black mt-3" />}
        <div className="p-1 mt-2">
          {!data.Technical_Performance.Crawlability_and_Hygiene.Sitemap.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> Sitemap file missing</h1>
          )}
          {!data.Technical_Performance.Crawlability_and_Hygiene.Robots.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> Robots.txt issue</h1>
          )}
          {!data.Technical_Performance.Crawlability_and_Hygiene.Broken_Links.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> Broken links found</h1>
          )}
          {!data.Technical_Performance.Crawlability_and_Hygiene.Redirect_Chains.Score && (
            <h1 className="flex gap-2 warn"><AlertTriangle size={20} className="text-red-700" /> Redirect issues</h1>
          )}
        </div>
      </div>
    </div>
  );
}
