import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, Meta } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/Auth/SignUpPage";
import LoginPage from "./pages/Auth/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AuthContext from "./context/AuthContext";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ThemeContext from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";

const App = () => {
  const { me, checkAuth, checkingAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    checkAuth();
  }, []);

  if (checkingAuth && !me) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            me ? (
              <ChatProvider>
                <HomePage />
              </ChatProvider>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/signup"
          element={!me ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!me ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={me ? <ProfilePage /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
