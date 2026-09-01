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
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="*"
            element={<Navigate to="/register" replace />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;