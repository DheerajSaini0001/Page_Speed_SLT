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
              className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900"
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
            <h4 className="font-semibold text-gray-700">{key}:</h4>
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
          <p key={uniqueKey} className="pl-4 text-gray-600">
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
                 justify-start p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Raw SEO Data Viewer</h2>
      <div className="bg-white shadow rounded p-4">
        {data ? renderData(data) : <p>Loading data...</p>}
      </div>
    </div>
  );
};

export default RawData;
