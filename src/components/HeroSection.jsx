"use client";
import { useState, useEffect, useRef } from "react";
import {
  Sprout,
  Droplets,
  Sun,
  Package,
  TrendingUp,
  Calendar,
  Leaf,
  Truck,
  BarChart3,
  Settings,
  CheckCircle2,
} from "lucide-react";

export default function HeroSection() {
  const [currentStage, setCurrentStage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const preloadRef = useRef(false);

  const stages = [
    {
      id: 0,
      name: "Pre-Season",
      subtitle: "Planning & Preparation",
      description:
        "Data-driven planning, soil insights, and field mapping lay the foundation for a successful crop season.",
      image: "https://images.pexels.com/photos/1615785/pexels-photo-1615785.jpeg",
      color: "from-blue-600 to-cyan-500",
      icon: Calendar,
      features: [
        { icon: Settings, label: "Data Planning", value: "100%" },
        { icon: Leaf, label: "Soil Analysis", value: "Complete" },
        { icon: BarChart3, label: "Field Mapping", value: "Active" },
      ],
    },
    {
      id: 1,
      name: "In-Season",
      subtitle: "Operations & Monitoring",
      description:
        "Real-time monitoring and streamlined operations optimize labor, irrigation, and inputs for peak efficiency.",
      image: "https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg",
      color: "from-green-600 to-emerald-500",
      icon: Sprout,
      features: [
        { icon: Droplets, label: "Irrigation", value: "Optimized" },
        { icon: Sun, label: "Monitoring", value: "Real-time" },
        { icon: TrendingUp, label: "Growth Rate", value: "+24%" },
      ],
    },
    {
      id: 2,
      name: "Harvest",
      subtitle: "Execution & Yield Capture",
      description:
        "Smart scheduling and digital yield capture ensure maximum output with minimal losses.",
      image: "https://images.pexels.com/photos/2131784/pexels-photo-2131784.jpeg",
      color: "from-amber-600 to-orange-500",
      icon: Package,
      features: [
        { icon: Calendar, label: "Scheduling", value: "Smart" },
        { icon: CheckCircle2, label: "Yield Capture", value: "Digital" },
        { icon: TrendingUp, label: "Output", value: "Maximized" },
      ],
    },
    {
      id: 3,
      name: "Post-Harvest",
      subtitle: "Storage & Logistics",
      description:
        "Efficient storage, logistics, and traceability unlock full market value and buyer confidence.",
      image: "https://panorama.solutions/sites/default/files/img_9917.jpg",
      color: "from-purple-600 to-indigo-500",
      icon: Truck,
      features: [
        { icon: Package, label: "Storage", value: "Efficient" },
        { icon: Truck, label: "Logistics", value: "Tracked" },
        { icon: BarChart3, label: "Market Value", value: "Optimized" },
      ],
    },
  ];

  // Preload images to avoid flashes on stage change
  useEffect(() => {
    if (preloadRef.current) return;
    preloadRef.current = true;
    const loaders = stages.map(
      (s) =>
        new Promise((res) => {
          const img = new Image();
          img.src = s.image;
          img.onload = () => res(true);
          img.onerror = () => res(true);
        })
    );
    Promise.all(loaders).then(() => {
      // small delay so first render still looks smooth
      setTimeout(() => setImagesLoaded(true), 80);
    });
  }, [stages]);

  // auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % stages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [stages.length]);

  const currentData = stages[currentStage];
  const StageIcon = currentData.icon;

  // SVG ring geometry
  const R = 80; // radius used in viewBox (same as original)
  const circumference = 2 * Math.PI * R;
  const segmentLength = circumference / stages.length;
  const gap = 6; // small gap between segments (px along stroke length)
  const visibleLength = Math.max(0, segmentLength - gap);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background images (preloaded and crossfaded) */}
      <div className="absolute inset-0 pointer-events-none">
        {stages.map((stage, idx) => (
          <div
            key={idx}
            aria-hidden
            className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-900 ease-in-out will-change-opacity transform-gpu"
            style={{
              backgroundImage: `url(${stage.image})`,
              opacity: imagesLoaded ? (idx === currentStage ? 1 : 0.0) : idx === 0 ? 1 : 0,
              filter: "brightness(0.95) contrast(1.02) saturate(1.02)",
              transitionProperty: "opacity, transform",
            }}
          />
        ))}

        {/* subtle overlay — reduced opacity so image is visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.62) 0%, rgba(17,24,39,0.56) 50%, rgba(17,24,39,0.62) 100%)",
            transition: "background-color 500ms ease",
            pointerEvents: "none",
          }}
        />

        {/* soft grid pattern (subtle) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
            opacity: 0.12,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8 lg:-mt-16">
            {/* Stage Indicator */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentData.color} flex items-center justify-center shadow-md`}
              >
                <StageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold uppercase tracking-wider">
                  {currentData.subtitle}
                </p>
                <h1 className="text-white text-2xl font-bold">{currentData.name}</h1>
              </div>
            </div>

            {/* Main Title */}
            <div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Smart Farming
                <span
                  className={`block bg-gradient-to-r ${currentData.color} bg-clip-text text-transparent`}
                >
                  End-to-End
                </span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">{currentData.description}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                className={`px-8 py-4 bg-gradient-to-r ${currentData.color} text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300`}
              >
                Get Started
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-2 pt-4">
              {stages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStage(idx)}
                  className="group relative h-1.5 flex-1 bg-white/12 rounded-full overflow-hidden cursor-pointer"
                >
                  <div
                    className={`h-full bg-gradient-to-r ${stages[idx].color} transition-all duration-500 ${
                      idx === currentStage ? "w-full" : "w-0"
                    }`}
                    style={{ transitionTimingFunction: "cubic-bezier(.2,.9,.3,1)" }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Infographic */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Center Circle visualizer */}
              <div className="relative w-full aspect-square">
                {/* Rotating Ring SVG */}
              <svg
  className="absolute inset-0 w-full h-full -rotate-90 transition-transform duration-1000 ease-in-out"
  viewBox="0 0 200 200"
>
  {stages.map((stage, idx) => {
    const isActive = idx === currentStage;
    const angle = (idx * 360) / stages.length;
    const circumference = 2 * Math.PI * 80;
    const segmentLength = circumference / stages.length;

    return (
      <g key={idx} transform={`rotate(${angle} 100 100)`}>
        {/* Background segment */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={
            isActive
              ? `url(#gradient${idx})`
              : "rgba(255,255,255,0.1)"
          }
          strokeWidth="4"
          strokeDasharray={`${segmentLength} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-1500 ease-in-out"
          style={{
            filter: isActive
              ? "drop-shadow(0 0 8px rgba(255,255,255,0.5))"
              : "none",
          }}
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient
            id={`gradient${idx}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={
                idx === 0
                  ? "#3b82f6"
                  : idx === 1
                  ? "#5fb43f"
                  : idx === 2
                  ? "#a1683d"
                  : "#5fb43f"
              }
            />
            <stop
              offset="100%"
              stopColor={
                idx === 0
                  ? "#3b82f6"
                  : idx === 1
                  ? "#5fb43f"
                  : idx === 2
                  ? "#f59e0b"
                  : "#8b5cf6"
              }
            />
          </linearGradient>
        </defs>
      </g>
    );
  })}
</svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out">
                  <div className="text-center">
                    <div
                      className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${currentData.color} flex items-center justify-center mb-4 shadow-2xl transform transition-all duration-700 ease-in-out`}
                      style={{
                        boxShadow: `0 10px 40px ${
                          currentStage === 0
                            ? "rgba(59,130,246,0.35)"
                            : currentStage === 1
                            ? "rgba(16,185,129,0.35)"
                            : currentStage === 2
                            ? "rgba(245,158,11,0.35)"
                            : "rgba(139,92,246,0.35)"
                        }`,
                      }}
                    >
                      <StageIcon className="w-16 h-16 text-white transition-transform duration-700 ease-in-out" />
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-1 transition-opacity duration-500">
                      {currentData.name}
                    </h3>
                    <p className="text-white text-sm font-medium transition-opacity duration-500">
                      Stage {currentStage + 1} of {stages.length}
                    </p>
                  </div>
                </div>

                {/* Stage Labels (buttons) */}
                {stages.map((stage, idx) => {
                  const angle = (idx * 360) / stages.length - 90;
                  const x = 50 + 45 * Math.cos((angle * Math.PI) / 180);
                  const y = 50 + 45 * Math.sin((angle * Math.PI) / 180);
                  const Icon = stage.icon;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentStage(idx)}
                      className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer ${
                        idx === currentStage
                          ? `bg-gradient-to-br ${stage.color} shadow-2xl scale-105`
                          : "bg-white/8 backdrop-blur-sm hover:bg-white/16 scale-90 hover:scale-100"
                      }`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: `translate(-50%, -50%) ${idx === currentStage ? "scale(1.05)" : "scale(0.95)"}`,
                        boxShadow:
                          idx === currentStage
                            ? `0 10px 30px ${
                                idx === 0
                                  ? "rgba(59,130,246,0.28)"
                                  : idx === 1
                                  ? "rgba(16,185,129,0.28)"
                                  : idx === 2
                                  ? "rgba(245,158,11,0.28)"
                                  : "rgba(139,92,246,0.28)"
                              }`
                            : "none",
                      }}
                    >
                      <Icon className={`w-8 h-8 transition-colors duration-400 ${idx === currentStage ? "text-white" : "text-slate-400"}`} />
                    </button>
                  );
                })}
              </div>

              {/* Feature Cards Below */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                {currentData.features.map((feature, idx) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="relative bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 group overflow-hidden"
                      style={{
                        animation: `slideUp 0.6s ease-out ${idx * 0.08}s both`,
                      }}
                    >
                      {/* subtle glassy overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${currentData.color} opacity-0 group-hover:opacity-8 transition-opacity duration-500`}
                        style={{ pointerEvents: "none" }}
                      />

                      <div className="relative z-10">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentData.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 shadow-md`}
                        >
                          <FeatureIcon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-white text-xs font-semibold mb-1  transition-colors duration-300">
                          {feature.label}
                        </p>
                        <p className={`text-sm font-bold bg-gradient-to-r ${currentData.color} bg-clip-text text-transparent`}>
                          {feature.value}
                        </p>
                      </div>

                      {/* Shimmer */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* small helper to reduce flicker on transforms */
        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}
