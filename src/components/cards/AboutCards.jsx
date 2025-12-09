"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Cloud, Users, Package, Database } from "lucide-react";

const cards = [
  { 
    id: 1, 
    img: "/crop1.jpg", 
    title: "Land Planning", 
    desc: "GIS Farm Mapping", 
    desc1: "IoT Data Logger Setup", 
    desc2: "AI Analysis On Logger Data",
    icon: Database,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50"
  },
  { 
    id: 2, 
    img: "/crop2.jpg", 
    title: "Crop Management", 
    desc: "Crop Sowing", 
    desc1: "Irrigation Alerts", 
    desc2: "AI Crop Plan Sowing To Harvest",
    icon: Sparkles,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50"
  },
  { 
    id: 3, 
    img: "/crop3.jpg", 
    title: "Forecasting & Predictions", 
    desc: "Real-Time Weather Forecasting", 
    desc1: "Yield Prediction", 
    desc2: "Plant Disease Prediction",
    icon: Cloud,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50"
  },
  { 
    id: 4, 
    img: "/crop4.jpg", 
    title: "Labor & Inventory", 
    desc: "Labor Record", 
    desc1: "Role Managements", 
    desc2: "Assets and Land Record",
    icon: Users,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50"
  },
  { 
    id: 5, 
    img: "/crop5.jpg", 
    title: "Post Harvesting", 
    desc: "Farm Warehouse & Management", 
    desc1: "Crop Packaging & Shipping", 
    desc2: "Finance & Profit Calculation",
    icon: Package,
    gradient: "from-amber-500 to-yellow-500",
    bgGradient: "from-amber-50 to-yellow-50"
  },
  { 
    id: 6, 
    img: "/crop6.jpg", 
    title: "FarmLink CMS & Farm.Ai", 
    desc: "User Managements", 
    desc1: "Farm Insights and Stats", 
    desc2: "Contract Farming",
    icon: TrendingUp,
    gradient: "from-teal-500 to-green-500",
    bgGradient: "from-teal-50 to-green-50"
  },
];

const animations = [
  { initial: { x: -150, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  { initial: { y: -150, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  { initial: { x: 150, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  { initial: { x: -150, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  { initial: { y: 150, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  { initial: { x: 150, opacity: 0 }, animate: { x: 0, opacity: 1 } },
];

export default function AboutCards({ playAnimation }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl w-full px-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isHovered = hoveredCard === card.id;
        
        return (
          <motion.div
            key={card.id}
            className="cursor-pointer group relative"
            initial={animations[index].initial}
            animate={playAnimation ? animations[index].animate : {}}
            transition={{
              duration: 0.9,
              delay: 0.7 + index * 0.3,
              ease: "easeOut",
            }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glow effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
            
            {/* Card */}
            <div className={`relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-3xl shadow-xl group-hover:shadow-2xl p-6 flex flex-col h-full transform group-hover:-translate-y-2 transition-all duration-500 border border-white/50`}>
              
              {/* Icon Badge */}
              {/* <div className={`absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl shadow-lg flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                <Icon className="w-7 h-7 text-white" />
              </div> */}

              {/* Image Container */}
              <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden mb-5 shadow-md">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Beta badge if needed */}
                {/* {index >= 0 && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-md z-20">
                    ✨ AI Powered
                  </div>
                )} */}
              </div>

              {/* Title */}
              <h3 className={`text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                {card.title}
              </h3>

              {/* Features List */}
              <div className="space-y-3 flex-grow">
                {[card.desc, card.desc1, card.desc2].map((desc, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`min-w-6 h-6 rounded-full bg-gradient-to-br ${card.gradient} flex items-center justify-center mt-0.5 shadow-sm`}>
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                      {desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Hover indicator */}
              <motion.div
                className={`mt-6 h-1 bg-gradient-to-r ${card.gradient} rounded-full`}
                initial={{ width: "0%" }}
                animate={{ width: isHovered ? "100%" : "30%" }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}