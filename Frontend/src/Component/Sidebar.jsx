import React, { useState } from "react";
import {
  Accessibility,
  Gauge,
  Image,
  Shield,
  Layout,
  TrendingUp,
  Menu,
  Brain,
  X,
} from "lucide-react";

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Technical Performance", link: "#TechnicalPerformance", icon: <Gauge size={20} /> },
    { name: "On Page SEO", link: "#OnPageSEO", icon: <Image size={20} /> },
    { name: "Accessibility", link: "#accessibility", icon: <Accessibility size={20} /> },
    { name: "Security/Compliance", link: "#SecurityCompliance", icon: <Shield size={20} /> },
    { name: "UX & Content Structure", link: "#UXContentStructure", icon: <Layout size={20} /> },
    { name: "Conversion & Lead Flow", link: "#ConversionLeadFlow", icon: <TrendingUp size={20} /> },
    { name: "AIO (AI-Optimization) Readiness", link: "#AIOReadiness", icon: <Brain size={20} /> },
  ];

  return (
    <div className="flex fixed">
      {/* Top Navbar */}
   

      {/* Sidebar */}
      <aside
        className={`fixed top-12 left-0 h-[calc(100%-3rem)] w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 sm:static sm:top-0 sm:h-full
        `}
      >
        {/* Logo */}
        <div className="  flex flex-col justify-center items-center text-2xl py-4 border-b border-gray-700">
          Logo
        </div>

        {/* Menu */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto ">
          {menuItems.map((item) => (
           <a href="/" className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{item.icon} {item.name}</a>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="h-fit"
          onClick={() => setIsOpen(false)}
        />
      )}

    
    </div>
  );
}
