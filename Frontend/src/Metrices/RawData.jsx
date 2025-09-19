import { FileText } from "lucide-react";
import React, { useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const RawData = ({ data }) => {
  const { darkMode } = useContext(ThemeContext);
  const [openKeys, setOpenKeys] = useState({});

  const toggleKey = (key) => {
    setOpenKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Download Function
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

  const renderData = (obj, parentKey = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const uniqueKey = parentKey ? `${parentKey}.${key}` : key;

      const textColor = darkMode ? "text-white" : "text-black";

      if (value && typeof value === "object" && !Array.isArray(value)) {
        return (
          <div key={uniqueKey} className={`pl-4 mb-2 border-l ${darkMode ? "border-gray-700" : "border-gray-400"}`}>
            <h4
              className={`cursor-pointer font-semibold hover:${darkMode ? "text-blue-400" : "text-blue-600"} ${textColor}`}
              onClick={() => toggleKey(uniqueKey)}
            >
              {key} {openKeys[uniqueKey] ? "▼" : "▶"}
            </h4>
            {openKeys[uniqueKey] && renderData(value, uniqueKey)}
          </div>
        );
      } else if (Array.isArray(value)) {
        return (
          <div key={uniqueKey} className="pl-4 mb-2">
            <h4 className={`font-semibold ${textColor}`}>{key}:</h4>
            <ul className="list-disc list-inside pl-4">
              {value.map((item, idx) =>
                typeof item === "object" ? (
                  <li key={idx}>{renderData(item, `${uniqueKey}[${idx}]`)}</li>
                ) : (
                  <li key={idx} className={textColor}>{item}</li>
                )
              )}
            </ul>
          </div>
        );
      } else {
        return (
          <p key={uniqueKey} className={`pl-4 ${textColor}`}>
            {key}: {value !== null ? value.toString() : "null"}
          </p>
        );
      }
    });
  };

  const containerBg = darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300";
  const cardBg = darkMode ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black" : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";

  return (
    <div id="Rawdata" className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}>
      <h1 className={`text-3xl font-extrabold mb-6 ${darkMode ? "text-white" : "text-black"}`}>
        Raw Data
      </h1>

      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        {data ? renderData(data) : <p className={darkMode ? "text-white" : "text-black"}>Loading data...</p>}
      </div>

      <button
        onClick={() => downloadAsTxt(data)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition ${darkMode ? "bg-green-600 hover:bg-green-700 text-white hover:text-black" : "bg-green-400 hover:bg-green-500 text-black hover:text-white"}`}
      >
        <FileText className="w-5 h-5" />
        Download TXT
      </button>
    </div>
  );
};

export default RawData;
