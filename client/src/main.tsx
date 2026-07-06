import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import { BackendStatusProvider } from "./lib/backendStatus";
import { AuthProvider, RequireAuth } from "./lib/auth";
import AppsLayout from "./apps/AppsLayout";
import AppsHub from "./apps/AppsHub";
import MundialApp from "./apps/mundial/MundialApp";
import FinanzasApp from "./apps/finanzas/FinanzasApp";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BackendStatusProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/apps"
            element={
              <AuthProvider>
                <RequireAuth>
                  <AppsLayout />
                </RequireAuth>
              </AuthProvider>
            }
          >
            <Route index element={<AppsHub />} />
            <Route path="mundial" element={<MundialApp />} />
            <Route path="finanzas" element={<FinanzasApp />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BackendStatusProvider>
  </StrictMode>,
);
