import React from "react";

export default function CircularProgress({ value = 65, size = 120, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const textColor =
    value < 50
      ? "text-red-600"
      : value < 90
      ? "text-orange-500"
      : "text-green-600";

  const backGroundColor =
    value < 50
      ? "fill-red-200"
      : value < 90
      ? "fill-orange-200"
      : "fill-green-200";

  const progressColor =
    value < 50
      ? "text-red-600"
      : value < 90
      ? "text-orange-500"
      : "text-green-600";
  const progressColorBg =
    value < 50
      ? "text-red-200"
      : value < 90
      ? "text-orange-200"
      : "text-green-200";

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background filled circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`${backGroundColor}`}
        />
        {/* Track circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          className={`${progressColorBg}`}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ${progressColor}`}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Center text */}
      <span className={`absolute text-xl font-semibold ${textColor}`}>
        {value}%
      </span>
    </div>
  );
}