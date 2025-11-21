"use client";

import { useState } from "react";
import { Chrome, Facebook, Linkedin, Mail, Globe, ArrowRight, Sparkles, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const solutions = [
    "Farm Management",
    "Crop Planning",
    "Harvest Tracking",
    "Market Analysis"
  ];

  const features = [
    "Real-time Monitoring",
    "Analytics Dashboard",
    "Automated Reports",
    "Mobile App",
    "Notifications",
    "Multi-User Access",
    "Integration APIs"
  ];

  const navigation = [
    "Home",
    "About Us",
    "Services",
    "Blog",
    "Contact",
    "FAQs"
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", color: "from-blue-600 to-blue-400", href: "#" },
    { icon: Chrome, name: "Website", color: "from-green-600 to-emerald-400", href: "https://escan-systems.com" },
    { icon: Linkedin, name: "LinkedIn", color: "from-cyan-600 to-blue-500", href: "https://www.linkedin.com/company/earth-scan-systems/posts/?feedView=all" }
  ];

  return (
    <footer className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl animate-pulse delay-500"></div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Company Info Section */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl">
                <img src="/logo1.png" alt="Logo" className="w-28 h-28 object-contain rounded-full" />
              </div>
            </div>

            {/* Get in Touch Header */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Get in Touch
                </h3>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"></div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col space-y-3 w-full">
              <a
                href="mailto:contact@escan-systems.com"
                className="group flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Email</span>
                  <span className="text-sm text-teal-400 group-hover:text-teal-300 transition-colors">contact@escan-systems.com</span>
                </div>
              </a>

              <a
                href="https://escan-systems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Website</span>
                  <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">escan-systems.com</span>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    className="group relative"
                  >
                    <div className={`absolute -inset-1 bg-gradient-to-r ${social.color} rounded-xl blur opacity-0 group-hover:opacity-60 transition duration-300`}></div>
                    <div className="relative w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Solutions */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-white">Solutions</h3>
            </div>
            <ul className="space-y-3">
              {solutions.map((item, index) => (
                <li
                  key={index}
                  onMouseEnter={() => setHoveredLink(`sol-${index}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRight className={`w-4 h-4 text-teal-400 transition-transform duration-300 ${hoveredLink === `sol-${index}` ? 'translate-x-1' : ''}`} />
                  <span className={`text-gray-400 group-hover:text-white transition-colors duration-300 ${hoveredLink === `sol-${index}` ? 'font-semibold' : ''}`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Features */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-white">Features</h3>
            </div>
            <ul className="space-y-3">
              {features.map((item, index) => (
                <li
                  key={index}
                  onMouseEnter={() => setHoveredLink(`feat-${index}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRight className={`w-4 h-4 text-blue-400 transition-transform duration-300 ${hoveredLink === `feat-${index}` ? 'translate-x-1' : ''}`} />
                  <span className={`text-gray-400 group-hover:text-white transition-colors duration-300 ${hoveredLink === `feat-${index}` ? 'font-semibold' : ''}`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-white">Navigation</h3>
            </div>
            <ul className="space-y-3">
              {navigation.map((item, index) => (
                <li
                  key={index}
                  onMouseEnter={() => setHoveredLink(`nav-${index}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group flex items-center gap-2 cursor-pointer"
                >
                  <ArrowRight className={`w-4 h-4 text-purple-400 transition-transform duration-300 ${hoveredLink === `nav-${index}` ? 'translate-x-1' : ''}`} />
                  <span className={`text-gray-400 group-hover:text-white transition-colors duration-300 ${hoveredLink === `nav-${index}` ? 'font-semibold' : ''}`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 px-8 py-1 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Earth-Scan-Systems. All Rights Reserved
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">
              Designed with <span className="text-red-400">♥</span> by <span className="font-semibold text-white">CropERP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent blur-sm"></div>
    </footer>
  );
}