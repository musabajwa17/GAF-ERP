"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AboutCards from "./cards/AboutCards";
export default function AboutErp() {
  const [playAnimation, setPlayAnimation] = useState(false);

  useEffect(() => {
    setPlayAnimation(true);
  }, []);

  return (
  <div className="w-full min-h-screen bg-gradient-to-r from-[#20544d] to-[#2b887b] flex flex-col items-center text-white px-4 sm:px-6 py-10 sm:py-20">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={playAnimation ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center"
      >
        What Is CropERP
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={playAnimation ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-24 sm:w-48 md:w-80 h-1 bg-white mt-6 sm:mt-10 mb-4 origin-left"
      ></motion.div>
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={playAnimation ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="max-w-2xl text-center my-8 sm:my-12 text-xs sm:text-sm md:text-base leading-relaxed"
      >
        A CropERP is an Enterprise Farm management Solution designed by ESS.
        Aligning the crop Lifecycle Stages yet offering different features from
        land preparing to growing, from harvesting to Packaging and then to the
        market doorstep.
      </motion.p>

      <AboutCards playAnimation={playAnimation} />
    </div>
  );
}
