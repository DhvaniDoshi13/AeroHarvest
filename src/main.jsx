import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import SensorProvider from "./Context/SensorContext.jsx"; // ✅ Correct default import
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SensorProvider> {/* ✅ Wrap App inside SensorProvider */}
      <App />
    </SensorProvider>
  </React.StrictMode>
);
