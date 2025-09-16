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
  Database,
  FileText,
} from "lucide-react";


export default function Sidebar({ children ,data}) {
  const [isOpen, setIsOpen] = useState(true);

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

  // Download Button
  const downloadAsTxt = (data, 
    filename = `${data.result.url.split("/")[2].split('.')[0]}.txt`

) => {
    // Convert object to readable text
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
              str += `${space}  - Item ${idx + 1}:\n${formatObject(
                item,
                indent + 4
              )}`;
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
  
    // Create blob and trigger download
    const blob = new Blob([textContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }; 
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
          <a href="#deshboard" className="text-4xl font-bold text-green-400 ">Result</a>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-2 space-y-2 overflow-y-auto ">
          
           <a href={`${menuItems[0].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[0].icon} <pre> </pre> {menuItems[0].name} </a>
           <a href={`${menuItems[1].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[1].icon} <pre> </pre> {menuItems[1].name} </a>
           <a href={`${menuItems[2].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[2].icon} <pre> </pre> {menuItems[2].name} </a>
           <a href={`${menuItems[3].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[3].icon} <pre> </pre> {menuItems[3].name} </a>
           <a href={`${menuItems[4].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[4].icon} <pre> </pre> {menuItems[4].name} </a>
           <a href={`${menuItems[5].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[5].icon} <pre> </pre> {menuItems[5].name} </a>
           <a href={`${menuItems[6].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[6].icon} <pre> </pre> {menuItems[6].name} </a>
           <a href={`${menuItems[7].link}`} className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition">{menuItems[7].icon} <pre> </pre> {menuItems[7].name} </a>
           <button
      onClick={() => downloadAsTxt(data)}
      className="flex items-center space-x-3 p-4  rounded-md hover:bg-gray-700 transition"
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
