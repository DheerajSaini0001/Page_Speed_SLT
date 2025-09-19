import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import AboutPage from "./Pages/AboutPage";
import { ThemeProvider } from "./ThemeContext"; // ThemeContext import

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider> {/* ✅ Wrap the app with ThemeProvider */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
