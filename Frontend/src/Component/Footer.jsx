import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

export default function Footer() {
  const { darkMode } = useContext(ThemeContext); // ✅ ThemeContext use

  const footerClass = darkMode
    ? "lg:pl-64 sm:pr-6 relative bottom-0 flex bg-gray-900 text-gray-200 py-6 pt-8"
    : "lg:pl-64 sm:pr-6 relative bottom-0 flex bg-gray-200 text-gray-800 py-6 pt-8";

  const linkHoverClass = darkMode
    ? "hover:text-blue-400 transition"
    : "hover:text-blue-500 transition";

  return (
    <footer className={footerClass}>
      <div className="container w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          <a className={linkHoverClass} href="https://www.sltechsoft.com">
            &copy; {new Date().getFullYear()} Success Leader Technologies.
          </a>{" "}
          All rights reserved.
        </p>

        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/about" className={linkHoverClass}>
            About
          </a>
          <a href="https://sltechsoft.com/service" className={linkHoverClass}>
            Services
          </a>
          <a href="https://sltechsoft.com/" className={linkHoverClass}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
