import React from 'react';

export default function Technical_Performance() {
  const scores = {
    LCP: 8,
    CLS: 10,
    INP: 7,
    TTFB: 6,
    Compression: 8,
    Caching: 7,
    HTTP: 10,
    Sitemap: 5,
    Robots: 6,
    BrokenLinks: 4,
    RedirectChains: 7,
  };

  const ScoreBadge = ({ score }) => (
    <span className={`px-2 py-1 rounded-full text-white font-semibold text-xs ${
      score >= 8
        ? 'bg-green-500'
        : score >= 5
        ? 'bg-yellow-500'
        : 'bg-red-500'
    }`}>
      {score}
    </span>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-start p-6 space-y-6'>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Technical Performance <span className='text-gray-500'>(out of 28)</span></h1>

      {/* Core Web Vitals */}
      <div className='w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-100 to-indigo-50 hover:scale-105 transition-transform duration-300'>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Core Web Vitals <span className='text-gray-500'>(out of 12)</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>LCP Score</span>
            <ScoreBadge score={scores.LCP} />
          </div>
          <div className="flex justify-between items-center">
            <span>CLS Score</span>
            <ScoreBadge score={scores.CLS} />
          </div>
          <div className="flex justify-between items-center">
            <span>INP Score</span>
            <ScoreBadge score={scores.INP} />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className='w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 bg-gradient-to-r from-purple-100 to-purple-50 hover:scale-105 transition-transform duration-300'>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery & Render <span className='text-gray-500'>(out of 8)</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>TTFB Score</span>
            <ScoreBadge score={scores.TTFB} />
          </div>
          <div className="flex justify-between items-center">
            <span>Compression Score</span>
            <ScoreBadge score={scores.Compression} />
          </div>
          <div className="flex justify-between items-center">
            <span>Caching Score</span>
            <ScoreBadge score={scores.Caching} />
          </div>
          <div className="flex justify-between items-center">
            <span>HTTP/2 or HTTP/3 Score</span>
            <ScoreBadge score={scores.HTTP} />
          </div>
        </div>
      </div>

      {/* Crawlability & Hygiene */}
      <div className='w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 bg-gradient-to-r from-pink-100 to-pink-50 hover:scale-105 transition-transform duration-300'>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Crawlability & Hygiene <span className='text-gray-500'>(out of 8)</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span>Sitemap Score</span>
            <ScoreBadge score={scores.Sitemap} />
          </div>
          <div className="flex justify-between items-center">
            <span>Robots Score</span>
            <ScoreBadge score={scores.Robots} />
          </div>
          <div className="flex justify-between items-center">
            <span>Broken Links Score</span>
            <ScoreBadge score={scores.BrokenLinks} />
          </div>
          <div className="flex justify-between items-center">
            <span>Redirect Chains Score</span>
            <ScoreBadge score={scores.RedirectChains} />
          </div>
        </div>
      </div>
    </div>
  );
}
