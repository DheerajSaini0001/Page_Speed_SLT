import React, { useState } from "react";

const RawData = ({ data }) => {
  const [openKeys, setOpenKeys] = useState({});

  const toggleKey = (key) => {
    setOpenKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
     <h1 className="text-3xl font-extrabold text-amber-100 mb-6">
        Raw Data </h1>

      <div className="w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-blue-900 via-gray-900 to-black
 hover:scale-105 transition-transform duration-300 ">
        {data ? renderData(data) : <p className="text-white">Loading data...</p>}
      </div>
    </div>
  );
};

export default RawData;
