import { Download } from "lucide-react";
import React, { useState } from "react";
import { FileText } from "lucide-react";

const RawData = ({ data }) => {
  const [openKeys, setOpenKeys] = useState({});

  const toggleKey = (key) => {
    setOpenKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
console.log(data);

// Download Function 
 const downloadAsTxt = (data, 
  filename = `${data.Overall_Data.url.split("/")[2].split('.')[0]}.txt`
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

const renderData = (obj, parentKey = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const uniqueKey = parentKey ? `${parentKey}.${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        return (
          <div key={uniqueKey} className="pl-4 mb-2 border-l border-gray-300">
            <h4
              className="cursor-pointer font-semibold text-white hover:text-blue-500"
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
            <h4 className="font-semibold text-white">{key}:</h4>
            <ul className="list-disc list-inside pl-4">
              {value.map((item, idx) =>
                typeof item === "object" ? (
                  <li key={idx}>{renderData(item, `${uniqueKey}[${idx}]`)}</li>
                ) : (
                  <li key={idx}>{item}</li>
                )
              )}
            </ul>
          </div>
        );
      } else {
        return (
          <p key={uniqueKey} className="pl-4 text-white">
            {key}: {value !== null ? value.toString() : "null"}
          </p>
        );
      }
    });
  };

  return (
    <div id="Rawdata" className=" min-h-fit pt-20 pb-16 bg-gray-900 border border-gray-700 rounded-2xl 
                 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 
                 transition-all duration-300 m-4 flex flex-col items-center 
                 justify-start p-6 space-y-6 ">
     <h1 className="text-3xl font-extrabold text-white mb-6">
        Raw Data </h1>

      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300 ">
        {data ? renderData(data) : <p className="text-white">Loading data...</p>}
      </div>
      <button
      onClick={() => downloadAsTxt(data)}
      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:text-black hover:bg-green-700"
    >
      <FileText className="w-5 h-5" />
      Download TXT
    </button>
    </div>
  );
};

export default RawData;
