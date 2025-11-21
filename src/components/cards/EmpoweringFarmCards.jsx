'use client';
import { useState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
const EmpoweringFarmsCards = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  const farmData = [
    {
      id: 1,
      title: "Pre-Season",
      description: "Pre-season is where farming success begins. Farmers prepare their land, analyze soil health, plan crops, and secure contracts.",
      image: "https://images.pexels.com/photos/1615785/pexels-photo-1615785.jpeg",
    },
    {
      id: 2,
      title: "In-Season",
      description: "In-season is the heartbeat of farming, where daily operations define crop outcomes. From irrigation and labor management to pest control and weather alerts, efficiency is critical.",
      image: "https://images.pexels.com/photos/3876417/pexels-photo-3876417.jpeg",
    },
    {
      id: 3,
      title: "Harvest",
      description: "With CROP ERP, farmers optimize machinery, labor, and logistics while maintaining full transparency. Every crop is harvested at peak value.",
      image: "https://images.pexels.com/photos/5231144/pexels-photo-5231144.jpeg",
    },
    {
      id: 4,
      title: "Post-Harvest",
      description: "Post-harvest is where value is unlocked beyond the farm. Proper storage, cold-chain management, and logistics ensure crop quality reaches the market intact.",
      image: "https://images.pexels.com/photos/34082490/pexels-photo-34082490.jpeg",
    },
    {
      id: 5,
      title: "GreenBot.Ai",
      description: "With GreenBot.ai, farmers gain confidence in decision-making, minimize crop losses, and maximize value every step of the lifecycle.",
      image: "https://images.pexels.com/photos/8566524/pexels-photo-8566524.jpeg",
    },
  ];

  const handleWheel = (e) => {
    if (scrollContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (scrollContainerRef.current) {
      scrollContainerRef.current.dataset.startX = touch.clientX.toString();
      scrollContainerRef.current.dataset.scrollLeft = scrollContainerRef.current.scrollLeft.toString();
    }
  };

  const handleTouchMove = (e) => {
    if (!scrollContainerRef.current?.dataset.startX) return;

    e.preventDefault();
    const touch = e.touches[0];
    const startX = parseFloat(scrollContainerRef.current.dataset.startX);
    const scrollLeft = parseFloat(scrollContainerRef.current.dataset.scrollLeft);
    const diffX = startX - touch.clientX;

    scrollContainerRef.current.scrollLeft = scrollLeft + diffX;
  };

  const handleTouchEnd = () => {
    if (scrollContainerRef.current) {
      delete scrollContainerRef.current.dataset.startX;
      delete scrollContainerRef.current.dataset.scrollLeft;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 my-10 flex flex-col justify-center">

      <div className="text-center my-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
          Agricultural Solutions
        </h1>
        <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Discover our comprehensive farm management solutions tailored for different agricultural sectors
        </p>
      </div>


      <div
        className="mt-4"
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
          {farmData.map((farm, index) => (
            <div
              key={farm.id}
                className="group relative w-full h-80 md:h-150 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex-shrink-0"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={farm.image}
                alt={farm.title}
                fill
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
  hoveredIndex === index
    ? 'scale-110 -m-2 z-10'
    : 'scale-100 m-0 z-0'
}`}

              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <div
                className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-20 transition-all duration-1000 ${
                  hoveredIndex === index ? 'translate-y-[-25px]' : 'translate-y-0'
                }`}
              >
                <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                  {farm.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4">
                  {farm.description}
                </p>
                <button
                  className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 border border-white/30 cursor-pointer ${
                    hoveredIndex === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  READ MORE
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      hoveredIndex === index ? 'translate-x-1' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmpoweringFarmsCards;

