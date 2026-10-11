import React from "react";
import { createRoot } from "react-dom/client";
import "../../prototype/v1/styles.css";
import "./auth.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
