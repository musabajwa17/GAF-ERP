'use client';
import { Mail, MapPin, Linkedin, Globe, ArrowRight, Phone, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderContext() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleQuote = () => {
    // Add your quote logic here
    console.log("Get a quote clicked");
  };

  const handleRegister = () => {
    router.push("/register");
  }
  return (
    <header className="bg-gradient-to-r from-[#1a4d43] via-[#183c36] to-[#0f2e28] border-b border-emerald-800/30">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-20 py-2.5">
        {/* Left Section - Contact Info */}
        <div className="flex items-center gap-6">
          <a 
            href="mailto:contact@escan-systems.com"
            className="group flex items-center gap-2 hover:opacity-90 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-200">
              <Mail size={14} className="text-emerald-300" />
            </div>
            <span className="text-xs font-medium text-white/90 group-hover:text-white">
              contact@escan-systems.com
            </span>
          </a>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <MapPin size={14} className="text-emerald-300" />
            </div>
            <span className="text-xs font-medium text-white/90">
              Victoria, Australia
            </span>
          </div>
        </div>

        {/* Right Section - Social & Actions */}
        <div className="flex items-center gap-3">
          {/* Social Links */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/20">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-200 group"
              title="Follow us on LinkedIn"
            >
              <Linkedin size={14} className="text-white" />
            </a>
            <button
              className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all duration-200 group"
              title="Visit our website"
            >
              <Globe size={14} className="text-white" />
            </button>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={handleQuote}
            className="group relative px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Get a Quote</span>
            <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          {/* <button
            onClick={handleLogin}
            className="group relative px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span>Login</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:animate-pulse" />
          </button>
            <button
            onClick={handleRegister}
            className="group relative px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <span>Sign Up</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:animate-pulse" />
          </button> */}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden px-4 py-3 space-y-3">
        {/* Contact Info Row */}
        <div className="flex items-center justify-between gap-2">
          <a 
            href="mailto:contact@escan-systems.com"
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Mail size={12} className="text-emerald-300" />
            </div>
            <span className="text-[10px] font-medium text-white/90 truncate">
              contact@escan-systems.com
            </span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <MapPin size={12} className="text-emerald-300" />
          </div>
          <span className="text-[10px] font-medium text-white/90">
            Victoria, Australia
          </span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <Linkedin size={14} className="text-white" />
            </a>
            <button className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
              <Globe size={14} className="text-white" />
            </button>
          </div>

          {/* Buttons */}
          <button 
            onClick={handleQuote}
            className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold rounded-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <span>Get Quote</span>
            <ArrowRight size={12} />
          </button>

          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-semibold rounded-lg active:scale-95 transition-all duration-200 shadow-lg shadow-emerald-500/30"
          >
            Login
          </button>
        </div>
      </div>

      {/* Decorative Bottom Line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
    </header>
  );
}
