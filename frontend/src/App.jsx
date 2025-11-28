import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Sidebar from "./components/Sidebar";
import { supabase } from "./supabaseClient";
import Auth from "./components/auth";
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Check for existing session on load
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Initial session:", data.session);
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    // ✅ Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-200">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Home page (only for logged OUT users) */}
        <Route
          path="/"
          element={!session ? <Home /> : <Navigate to="/sidebar" replace />}
        />
        <Route
          path="/auth"
          element={!session ? <Auth /> : <Navigate to="/sidebar" replace />}
        />

        {/* Sidebar (protected, only when logged IN) */}
        <Route
          path="/sidebar"
          element={session ? <Sidebar /> : <Navigate to="/" replace />}
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={session ? "/sidebar" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}
