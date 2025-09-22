import React, { useState, useContext } from "react";
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
  Database,
  FileText,
} from "lucide-react";
import { ThemeContext } from "../ThemeContext"; // ✅ ThemeContext import

export default function Sidebar({ children, data }) {
  const [isOpen, setIsOpen] = useState(true);
  const { darkMode } = useContext(ThemeContext); // ✅ ThemeContext

  const menuItems = [
    { name: "Technical Performance", link: "#TechnicalPerformance", icon: <Gauge size={20} /> },
    { name: "On Page SEO", link: "#OnPageSEO", icon: <Image size={20} /> },
    { name: "Accessibility", link: "#accessibility", icon: <Accessibility size={20} /> },
    { name: "Security/Compliance", link: "#SecurityCompliance", icon: <Shield size={20} /> },
    { name: "UX & Content Structure", link: "#UXContentStructure", icon: <Layout size={20} /> },
    { name: "Conversion & Lead Flow", link: "#ConversionLeadFlow", icon: <TrendingUp size={20} /> },
    { name: "AIO (AI-Optimization) Readiness", link: "#AIOReadiness", icon: <Brain size={20} /> },
    { name: "Raw Data", link: "#Rawdata", icon: <Database size={20} /> },
  ];

  const downloadAsTxt = (data, filename = `${data.Overall_Data.url.split("/")[2].split('.')[0]}.txt`) => {
    const formatObject = (obj, indent = 0) => {
      let str = "";
      const space = " ".repeat(indent);
      Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          str += `${space}${key}:\n${formatObject(value, indent + 2)}`;
        } else if (Array.isArray(value)) {
          str += `${space}${key}:\n`;
          value.forEach((item, idx) => {
            if (typeof item === "object") {
              str += `${space}  - Item ${idx + 1}:\n${formatObject(item, indent + 4)}`;
            } else {
              str += `${space}  - ${item}\n`;
            }
          });
        } else {
          str += `${space}${key}: ${value}\n`;
        }
      });
      return str;
    };

    const textContent = formatObject(data);
    const blob = new Blob([textContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Theme-based classes
  const sidebarBg = darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black";
  const sidebarBorder = darkMode ? "border-gray-700" : "border-gray-300";
  const hoverClass = darkMode ? "hover:bg-gray-700 hover:text-blue-500" : "hover:bg-gray-200 hover:text-blue-600";

  return (
    <div className="flex fixed overflow-y-auto">
      {/* Sidebar */}
      <aside
        className={`min-h-screen  sm: mt-[-10px] lg:mt-6 mb-0 overflow-y-hidden  fixed top-12 left-0 h-[calc(100%-3rem)] w-64 shadow-lg transform transition-transform duration-300
          ${isOpen ? "translate-x-0 " : "-translate-x-full"} 
          sm:translate-x-0 sm:static sm:top-0 sm:h-full
          ${sidebarBg} ${sidebarBorder}
        `}
      >
        
        <div className={`flex flex-col justify-center items-center text-2xl py-4 border-b ${sidebarBorder}`}>
          <a href="#deshboard" className={darkMode?"text-4xl font-bold text-green-100":"text-4xl font-bold text-green-500"}>Result</a>
        </div>

        {/* Menu */}
        <nav className=" flex-1 p-2 space-y-2 -y-auto">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`flex items-center space-x-3 p-4 rounded-md transition ${hoverClass}`}
            >
              {item.icon} <pre> </pre> {item.name}
            </a>
          ))}

          {/* Download Button */}
          <button
            onClick={() => downloadAsTxt(data)}
            className={`flex items-center space-x-3 p-4 w-full rounded-md transition ${hoverClass}`}
          >
            <FileText className="w-5 h-5" />
            <pre> </pre>
            Download TXT
          </button>
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
