import React, { useContext } from "react";
import Assets from '../assets/Assets.js';
import Footer from "../Component/Footer";
import { ThemeContext } from "../ThemeContext"; // ThemeContext import

export default function AboutPage() {
  const { theme } = useContext(ThemeContext); // ThemeContext se theme access

  const bgClass = theme === "dark" 
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black" 
    : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300";

  const textClass = theme === "dark" ? "text-white" : "text-gray-900";
  const subTextClass = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const navClass = theme === "dark" ? "bg-gray-900 border-b border-gray-700" : "bg-white border-b border-gray-300";

  return (
    <>
      <div className={`${bgClass} min-h-screen py-12 px-6`}>
        {/* Navbar */}
        <nav className={`fixed top-0 left-0 w-full h-16 ${navClass} flex items-center justify-between px-6 z-50`}>
          <a href="/">
            <div className="flex flex-col-reverse justify-center items-center gap-4 font-serif text-4xl font-bold bg-gradient-to-r from-sky-200 via-rose-200 to-orange-200 bg-clip-text text-transparent">
              <img src={Assets.Logo} alt="Site Audit Logo" className="h-12 w-12" />
              <span>Site Audits</span>
            </div>
          </a>
        </nav>

        {/* Main Content */}
        <div className="mt-20 max-w-6xl mx-auto">
          {/* Heading */}
          <h1 className={`text-4xl font-bold mb-6 text-center ${textClass}`}>
            About Our Site Audit Tool
          </h1>
          <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${subTextClass}`}>
            Our Site Audit tool helps developers, marketers, and businesses
            improve their website performance, SEO, and accessibility. 
            We aim to simplify the process of finding issues and boosting online presence.
          </p>

          {/* Sections */}
          <section className="grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl text-gray-100 mb-4 font-extrabold">Our Mission</h2>
              <p className="text-gray-100">
                👉 To empower website owners and developers by providing actionable 
                insights that enhance site speed, SEO performance, and user experience.
              </p>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl text-gray-100 mb-4 font-extrabold">What We Offer</h2>
              <ul className="list-disc list-inside text-gray-100 space-y-2">
                <li>Comprehensive SEO Audits</li>
                <li>Performance & Speed Optimization Tips</li>
                <li>Accessibility & Compliance Checks</li>
                <li>Detailed Reporting Dashboard</li>
              </ul>
            </div>
          </section>

          {/* Team */}
          <section className="mt-20 text-center px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>Meet the Team</h2>
            <p className={`mb-10 max-w-2xl mx-auto ${subTextClass}`}>
              We are a passionate group of developers and analysts committed 
              to making the web faster and more accessible for everyone.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {[Assets.Aditya, Assets.Dheeraj, Assets.Piyush, Assets.Mayank].map((img, idx) => {
                const names = ["Aditya", "Dheeraj", "Piyush", "Mayank"];
                const roles = ["Senior FullStack Developer", "FullStack Developer", "Backend Developer", "Backend Developer"];
                return (
                  <div key={idx} className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                      <img src={img} alt={names[idx]} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg text-gray-100 font-extrabold">{names[idx]}</h3>
                    <p className="text-sm text-gray-100">{roles[idx]}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <Footer/>
    </>
  );
}
