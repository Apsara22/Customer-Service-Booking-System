// App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PageBackground from "./components/PageBackground";
import Welcome from "./components/Welcome";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Navbar, { SidebarProvider } from "./components/layout/Navbar";
import MainLayout from "./components/layout/MainLayout";
import ServiceCategories from "./components/pages/services/ServiceCategoreis";
import Services from "./components/pages/services/Services";
import ServiceDetails from "./components/pages/services/ServiceDetails";

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <PageBackground />

      {showWelcome ? (
        <Welcome />
      ) : (
        <SidebarProvider>
          <Navbar />
          <Routes>
            {/* ========================================= */}
            {/* AUTH */}
            {/* ========================================= */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* ========================================= */}
            {/* ALL SERVICE CATEGORIES */}
            {/* ========================================= */}
            <Route
              path="/services"
              element={
                <MainLayout>
                  <ServiceCategories />
                </MainLayout>
              }
            />

            {/* ========================================= */}
            {/* SERVICES INSIDE CATEGORY */}
            {/* ========================================= */}
            <Route
              path="/services/:categoryId"
              element={
                <MainLayout>
                  <Services />
                </MainLayout>
              }
            />

            {/* ========================================= */}
            {/* SERVICE DETAILS */}
            {/* ========================================= */}
            <Route
              path="/services/:categoryId/:serviceId"
              element={
                <MainLayout>
                  <ServiceDetails />
                </MainLayout>
              }
            />

            {/* ========================================= */}
            {/* BOOKING */}
            {/* ========================================= */}
            <Route
              path="/services/:categoryId/:serviceId/booking"
              element={
                <MainLayout>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">
                      Booking Page
                    </h1>
                    <p className="mt-3 text-white/60">
                      Select your date and time.
                    </p>
                  </div>
                </MainLayout>
              }
            />

            {/* ========================================= */}
            {/* FALLBACK */}
            {/* ========================================= */}
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        </SidebarProvider>
      )}
    </BrowserRouter>
  );
};

export default App;