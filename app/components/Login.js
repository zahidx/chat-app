"use client";
import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Both fields are required!");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Save email if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      window.location.href = "/chatroom";
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/chatroom";
    } catch (error) {
      toast.error("Google login failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="p-8 rounded-xl w-full max-w-sm bg-gray-900 shadow-lg animate-fadeIn">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full bg-gray-800 p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-gray-800 p-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-gray-400 text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
            <a href="#" className="text-sm text-green-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-50">
            Don't have an account?{" "}
            <a href="#signup" className="font-semibold text-red-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-3">
          <button
            onClick={handleGoogleLogin}
            className="p-3 w-36 bg-blue-700 rounded-xl flex justify-center items-center"
          >
            <FaGoogle className="text-white text-2xl" />
            <span className="ml-2 text-white font-semibold">Google</span>
          </button>
        </div>
      </div>

      {/* ✅ Kept only one ToastContainer */}
      <ToastContainer autoClose={1500} />
    </div>
  );
}
