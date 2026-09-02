// App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PageBackground from "./components/PageBackground";
import Welcome from "./components/Welcome";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Navbar, { SidebarProvider } from "./components/layout/Navbar";
import MainLayout from "./components/layout/MainLayout";
import ServiceCategories from "./components/pages/services/ServiceCategoreis";
import Services from "./components/pages/services/Services";
import ServiceDetails from "./components/pages/services/ServiceDetails";
import Booking from "./components/pages/services/Booking";

/* ============================================= */
/* PROTECTED LAYOUT                               */
/* Only renders Navbar + Sidebar when a customer  */
/* is logged in. Otherwise redirects to /login.   */
/* ============================================= */
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const customer = localStorage.getItem("customer");

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <Navbar />
      <MainLayout>{children}</MainLayout>
    </SidebarProvider>
  );
};

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
        <Routes>
          {/* ========================================= */}
          {/* AUTH - Navbar is NOT rendered here */}
          {/* ========================================= */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ========================================= */}
          {/* DASHBOARD - lands here after login */}
          {/* ========================================= */}
          <Route
            path="/navbar"
            element={
              <ProtectedLayout>
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white">
                    Dashboard
                  </h1>
                </div>
              </ProtectedLayout>
            }
          />

          {/* ========================================= */}
          {/* ALL SERVICE CATEGORIES */}
          {/* ========================================= */}
          <Route
            path="/services"
            element={
              <ProtectedLayout>
                <ServiceCategories />
              </ProtectedLayout>
            }
          />

          {/* ========================================= */}
          {/* SERVICES INSIDE CATEGORY */}
          {/* ========================================= */}
          <Route
            path="/services/:categoryId"
            element={
              <ProtectedLayout>
                <Services />
              </ProtectedLayout>
            }
          />

          {/* ========================================= */}
          {/* SERVICE DETAILS */}
          {/* ========================================= */}
          <Route
            path="/services/:categoryId/:serviceId"
            element={
              <ProtectedLayout>
                <ServiceDetails />
              </ProtectedLayout>
            }
          />

          {/* ========================================= */}
          {/* BOOKING */}
          {/* ========================================= */}
          <Route
            path="/services/:categoryId/:serviceId/booking"
            element={
              <ProtectedLayout>
                <Booking />
              </ProtectedLayout>
            }
          />

          {/* ========================================= */}
          {/* FALLBACK */}
          {/* ========================================= */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;