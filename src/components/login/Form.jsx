"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GuestRoute from "../contact/ProtectedPage/GuestRoute";

export default function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [errors, setErrors] = useState({});
const [apiError, setApiError] = useState("");
const [loading, setLoading] = useState(false);
console.log(email, password);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const response = await fetch("https://earthscansystems.com/auth/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Assuming the API returns access and refresh tokens
          localStorage.setItem("access", data.tokens.access);
          console.log("Tokens", data.tokens)
          localStorage.setItem("refresh", data.tokens.refresh);
          router.push("/dashboard"); // Redirect to dashboard
        } else {
          setApiError(data.detail || "Invalid credentials. Please try again.");
        }
      } catch (err) {
        setApiError("An error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    <GuestRoute redirectTo="/dashboard">
    <section className="w-full h-screen  flex items-center justify-center bg-[#f7f7f7]">
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center  overflow-hidden bg-white/90 backdrop-blur-md">
        
        {/* Left Side */}
       <div className="hidden lg:flex w-1/2 h-full relative border-r border-emerald-200 overflow-hidden">
  {/* Animated gradient background */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700"  style={{
    backgroundImage: `url("https://img.freepik.com/free-photo/farmer-rice-field-with-laptop_1150-6048.jpg?t=st=1762428760~exp=1762432360~hmac=5dc90bd790aa918a726f62206d25c9daab3cf5aab95428ec49f5ffb53977898a&w=1480")`,
    backgroundSize: "cover",
    backgroundPosition: "right",
    height: "100vh",
    width: "100%",
  }}>
        <span  className="absolute left-0 top-0 h-full w-g inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 opacity-35"></span>

    {/* Animated mesh gradient overlay */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
    
    {/* Geometric pattern overlay */}
    <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
      backgroundSize: '32px 32px'
    }}></div>
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
    {/* Animated lock icon container */}
    <div className="relative mb-8">
      {/* Outer glow rings */}
      <div className="absolute inset-0 -m-8">
        <div className="w-full h-full rounded-full bg-white/10 animate-ping"></div>
      </div>
      <div className="absolute inset-0 -m-6">
        <div className="w-full h-full rounded-full bg-white/20 animate-pulse"></div>
      </div>
      
      {/* Main lock container */}
      <div className="relative w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-500">
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Lock icon with keyhole */}
        <div className="relative">
          {/* Lock body */}
          <div className="w-16 h-20 bg-white rounded-lg shadow-xl relative">
            {/* Lock shackle */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-10 border-4 border-white rounded-t-full"></div>
            
            {/* Keyhole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <div className="w-1.5 h-4 bg-emerald-600 mx-auto mt-0.5"></div>
            </div>
            
            {/* Shine highlight */}
            <div className="absolute top-2 left-2 w-2 h-6 bg-gradient-to-b from-white/60 to-transparent rounded-full"></div>
          </div>
          
          {/* Animated sparkles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-yellow-200 rounded-full animate-pulse animation-delay-1000"></div>
        </div>
      </div>
    </div>

    {/* Welcome text */}
    <div className="space-y-6">
      <h2 className="text-5xl font-bold text-white drop-shadow-2xl tracking-tight">
        Welcome Back!
      </h2>
      
      {/* Animated underline */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-1 bg-white/60 rounded-full animate-pulse"></div>
        <div className="w-20 h-1.5 bg-white rounded-full"></div>
        <div className="w-12 h-1 bg-white/60 rounded-full animate-pulse animation-delay-1000"></div>
      </div>
      
      <p className="text-2xl text-white/95 font-light drop-shadow-lg">
        Secure Access to Your Dashboard
      </p>
      
      <p className="text-lg text-white/80 max-w-md leading-relaxed drop-shadow-md">
        Enter your credentials to unlock a world of agricultural insights and management tools
      </p>
      
      {/* Feature badges */}
      <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
        <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium shadow-lg">
          🔒 Secure Login
        </div>
        <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium shadow-lg">
          ⚡ Fast Access
        </div>
        <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium shadow-lg">
          🌱 Smart Farming
        </div>
      </div>
    </div>
  </div>

  {/* Bottom decorative wave */}
  <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
    <svg viewBox="0 0 1200 120" className="w-full h-full">
      <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="white"/>
    </svg>
  </div>
</div>


        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center shadow-2xl p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl text-green-600 font-extrabold mb-2">Login</h1>
              <p className="text-gray-600">Welcome back! Please login to your account.</p>
            </div>

            {apiError && (
              <p className="text-red-500 text-center mb-4 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> {apiError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <div
                  className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all ${
                    errors.email
                      ? "border-red-500"
                      : email
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                >
                  <User className={`h-6 w-6 ${
                    errors.email ? "text-red-500" : email ? "text-green-500" : "text-gray-400"
                  }`} />
                  <input
                    className="w-full p-2 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                  />
                  {email && (
                    <div className="flex-shrink-0">
                      {errors.email ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div
                  className={`flex items-center gap-3 border-2 bg-white px-4 py-3 rounded-xl shadow-sm transition-all ${
                    errors.password
                      ? "border-red-500"
                      : password
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                >
                  <Lock className={`h-6 w-6 ${
                    errors.password ? "text-red-500" : password ? "text-green-500" : "text-gray-400"
                  }`} />
                  <input
                    className="w-full p-2 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-lg"
                    type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                  {password && (
                    <div className="flex-shrink-0">
                      {errors.password ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all text-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-green-600 hover:underline font-semibold">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    </GuestRoute>
    
<style jsx>{`
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .animation-delay-1000 {
    animation-delay: 1s;
  }
`}</style>
    </>
    
  );
}
