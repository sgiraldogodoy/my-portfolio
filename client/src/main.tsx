import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import TechStackPreview from "./pages/TechStackPreview.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tech-stack-preview" element={<TechStackPreview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
