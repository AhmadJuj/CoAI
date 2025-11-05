import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  MessageSquare,
  FileText,
  Users,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
// ✅ Supabase client
const supabaseUrl = "https://mudsmruncvpvouusgtrx.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // ✅ Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Handle Auth (Login / Signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        // 🔹 LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Logged in successfully ✅");
      } else {
        // 🔹 SIGNUP
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }, // store extra user info
          },
        });
        if (error) throw error;
        setSuccessMsg("Check your email to confirm your account 📧");
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };
  const  Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#06B6D4] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#06B6D4]/20 rounded-lg">
              <FileText className="w-6 h-6 text-[#06B6D4]" />
            </div>
            <span className="text-xl font-bold text-blue-200">DocHub</span>
          </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-[#E2E8F0] hover:text-blue-200 transition-colors">
              Features
            </a>
            <a href="#about" className="text-[#E2E8F0] hover:text-blue-200 transition-colors">
              About
            </a>
            <a href="#pricing" className="text-[#E2E8F0] hover:text-blue-200 transition-colors">
              Pricing
            </a>
           <Link to="/auth">
            <button className="bg-[#06B6D4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0891b2] transition-colors">
              Get Started
            </button>
           </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#06B6D4]/30">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-[#E2E8F0] hover:text-blue-200 transition-colors px-2 py-1">
                Features
              </a>
              <a href="#about" className="text-[#E2E8F0] hover:text-blue-200 transition-colors px-2 py-1">
                About
              </a>
              <a href="#pricing" className="text-[#E2E8F0] hover:text-blue-200 transition-colors px-2 py-1">
                Pricing
              </a>
              <Link to="/auth">
              <button className="bg-[#06B6D4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0891b2] transition-colors mt-2">
                Get Started
              </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
  return (
    <>
    <Navbar/>
    <div className="flex min-h-screen items-center justify-center bg-[#1E293B]">
      <div className="w-full max-w-md rounded-2xl bg-[#0F172A] p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-200 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* ✅ Error & Success */}
        {errorMsg && (
          <p className="mb-4 text-red-400 text-center text-sm">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="mb-4 text-green-400 text-center text-sm">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#E2E8F0]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-[#06B6D4] bg-[#1E293B] p-3 text-white focus:border-[#06B6D4] focus:outline-none"
                />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#E2E8F0]">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#06B6D4] bg-[#1E293B] p-3 text-white focus:border-[#06B6D4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E2E8F0]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#06B6D4] bg-[#1E293B] p-3 text-white focus:border-[#06B6D4] focus:outline-none"
              />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-200 py-3 font-semibold text-black transition hover:bg-black hover:text-blue-200 hover:border-blue-400 border border-transparent disabled:opacity-50"
            >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#E2E8F0]">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-200 font-medium hover:underline hover:text-blue-400"
            >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
            </>
  );
}
