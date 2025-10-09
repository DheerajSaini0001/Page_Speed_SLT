import React, { useState } from 'react';

/**
 * A collapsible dropdown component styled with Tailwind CSS.
 *
 * @param {object} props - The properties for the component.
 * @param {string} props.title - The title to display, e.g., "PASSED AUDITS".
 * @param {object[]} props.items - An array of objects, each object contains metric details.
 */
const AuditDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto font-sans border-b border-gray-200 pb-3 mb-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium text-gray-800 tracking-wide">
          {title}
          <span className="ml-2 font-normal text-gray-500">({items.length})</span>
        </h3>
        <button
          onClick={handleToggle}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium py-1 px-2 focus:outline-none"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Collapsible section */}
      {isOpen && (
        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-700 text-sm shadow-sm"
            >
              {/* If object type */}
              {typeof item === 'object' && item.metric ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-gray-800">{item.metric}</h4>
                    <span className="text-xs font-medium">{item.severity}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 text-sm text-gray-600 mb-2">
                    <p><strong>Current:</strong> {item.current}</p>
                    <p><strong>Recommended:</strong> {item.recommended}</p>
                  </div>
                  <p className="text-gray-700 italic">{item.suggestion}</p>
                </div>
              ) : (
                // fallback for plain strings
                <div>{item}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditDropdown;
