'use client';
import { useState } from 'react';
import { Sprout, Users, BarChart3, Shield, Globe, Zap } from 'lucide-react';

export default function AgriERPFeatures() {
  const features = [
    {
      icon: Sprout,
      title: "Crop Management",
      description: "Track and monitor crop cycles, yields, and health metrics in real-time for optimal harvest planning."
    },
    {
      icon: Users,
      title: "Grower Network",
      description: "Manage comprehensive grower profiles, contracts, and communication channels in one centralized platform."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Access powerful insights with advanced reporting tools to make data-driven agricultural decisions."
    },
    {
      icon: Shield,
      title: "Compliance Tracking",
      description: "Ensure regulatory compliance with automated tracking of certifications, permits, and safety standards."
    },
    {
      icon: Globe,
      title: "Supply Chain Integration",
      description: "Seamlessly connect with suppliers, distributors, and partners for end-to-end visibility."
    },
    {
      icon: Zap,
      title: "Automation Tools",
      description: "Streamline operations with intelligent automation for scheduling, reminders, and workflow management."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
          Leverage AgriERP's Advanced Features for Grower Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-lg transition-all duration-500 cursor-pointer group"
      style={{ backgroundColor: '#f4f7f9' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Static content */}
      <div className="relative z-10 p-8 h-full flex flex-col">
        <div className="text-green-600">
          <Icon size={48} strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-bold mt-6 mb-4 text-gray-800">
          {title}
        </h3>
        
        <p className="text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>

      {/* Green overlay with content that slides from bottom */}
      <div
        className="absolute inset-0 bg-green-800 transition-all duration-900 ease-out flex flex-col justify-end z-20"
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(100%)'
        }}
      >
        <div className="p-8 text-white">
          <h3 className="text-xl font-bold mb-4">
            {title}
          </h3>
          
          <p className="text-sm leading-relaxed mb-6">
            {description}
          </p>
          
          <button className="px-6 py-2 rounded-md font-semibold bg-white text-green-600 hover:bg-gray-100">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}