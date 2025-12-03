import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Lock,
  MapPin,
  Droplet,
  FileText,
  Users,
  Cloud,
  Layers,
  Bug,
  Package,
  TrendingUp,
  BarChart3,
  Shield,
  MessageSquare,
  User,
  Settings,
  LogOut,
  AreaChartIcon,
  LandPlot,
  RectangleCircle,
  Tractor,
  GitGraphIcon,
} from "lucide-react";
import Image from "next/image";
// dashboard content components
import dynamic from "next/dynamic";

// Leaflet map must only render on client
const FieldMapping = dynamic(
  () => import("@/components/dashboard/FieldMapping.jsx"),
  { ssr: false }
);
import Content from "../dashboard/Content";
import SoilHealth from "../dashboard/SoilHealth";
import ContractMapping from "../dashboard/ContractMapping";
import IrrigationManagement from "../dashboard/IrrigationManagement";
import Labormanagement from "../dashboard/Labormanagement";
import InventaryManagement from "../dashboard/InventaryManagement";
import WeatherForecast from "../dashboard/WeatherForecast";
import CropSowing from "../dashboard/CropSowing";
import PestManagement from "../dashboard/PestManagement";
import LandPreparation from "../dashboard/LandPreparation";
import Link from "next/link";
import Harvestschedule from "../dashboard/harvestschedule";
import Shippingandlogistics from "../dashboard/shippingandlogistics";
import FarmAnalyticsDashboard from "../dashboard/FarmAnalyticsDashboard";
import Fields from "../dashboard/Fields";
import CropPreparation from "../dashboard/CropPreparation";
import AdminInventoryManagement from "../dashboard/AdminInventory";
import FinanceManagement from "../dashboard/FinanceManagement";
import FieldAllocation from "../dashboard/FieldAllocation";
export default function Sidebar() {
  const [openStage, setOpenStage] = useState("Stage 1 (Pre-Season)");
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const userEmail = "musabajwa17@gmail.com";

  const stages = [
    {
      name: "Stage 1 (Pre-Season)",
      icon: MapPin,
      color: "emerald",
      items: [
        { name: "Land Registration", icon: Layers },
       // { name: "My Lands", icon: MapPin },
        { name: "Land Preparation", icon: AreaChartIcon },
        { name: "Crop Planner", icon: FileText },
      ],
    },
    {
      name: "Stage 2 (In-Season)",
      icon: Cloud,
      color: "blue",
      items: [
        { name: "Irrigation Management", icon: Droplet },
        { name: "Labor Management", icon: Users },
        { name: "Weather Forecast", icon: Cloud },
        { name: "Crop Management", icon: Layers },
        { name: "Inventory", icon: Package },
        { name: "Pest Monitoring", icon: Bug },
      ],
    },
    {
      name: "Stage 3 (Harvest Season)",
      icon: TrendingUp,
      color: "amber",
      items: [
        { name: "Harvest Scheduling", icon: TrendingUp },
        { name: "Shipping and Logistics", icon: Package },
      ],
    },
    {
      name: "Stage 4 (Post Harvest)",
      icon: BarChart3,
      color: "purple",
      items: [{ name: "Farm Analytics Dashboard", icon: BarChart3 }],
    },
    {
      name: "Allocation ",
      icon: MapPin,
      color: "emerald",
      items: [
        { name: "Land Registration", icon: Layers },
        { name: "Field Allocation", icon: MapPin },
        // { name: "Land Preparation", icon: AreaChartIcon },
        // { name: "Crop Planner", icon: FileText },
      ],
    },
  ];

  const handleStageClick = (stageName) => {
    setOpenStage(openStage === stageName ? null : stageName);
  };

  const handleItemClick = (itemName) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected", itemName);
    }
    setSelected(itemName);
  };

  const renderStageSection = (stagesData) => {
    return stagesData.map((stage, index) => {
      const StageIcon = stage.icon;
      const isOpen = openStage === stage.name;
      const isLocked = stage.locked;

      return (
        <div key={index} className="mb-2">
          <button
            onClick={() => handleStageClick(stage.name)}
            disabled={isLocked}
            className={`group cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              isLocked
                ? "opacity-50 cursor-not-allowed bg-slate-100"
                : isOpen
                ? "bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md border-l-4 border-emerald-500"
                : "hover:bg-slate-50 border-l-4 border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isLocked
                    ? "bg-slate-200"
                    : isOpen
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-200 group-hover:bg-emerald-100"
                }`}
              >
                <StageIcon
                  className={`w-4 h-4 ${
                    isLocked
                      ? "text-slate-400"
                      : isOpen
                      ? "text-white"
                      : "text-slate-600 group-hover:text-emerald-600"
                  }`}
                />
              </div>
              <span
                className={`text-left text-sm ${
                  isLocked ? "text-slate-400" : "text-slate-700"
                }`}
              >
                {stage.name}
              </span>
            </div>

            {isLocked ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-normal">
                  Coming Soon
                </span>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            ) : (
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 pl-4 border-l-2 border-emerald-200 space-y-1">
              {stage.items.map((item, i) => {
                const ItemIcon = item.icon;
                const isSelected = selected === item.name;

                return (
                  <button
                    key={i}
                    onClick={() => handleItemClick(item.name)}
                    className={`group cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                      isSelected
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 font-medium"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <ItemIcon
                      className={`w-4 h-4 transition-all duration-200 ${
                        isSelected
                          ? "text-white"
                          : "text-slate-400 group-hover:text-emerald-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex w-full items-start h-screen overflow-hidden">
        <aside className="w-80 h-full self-start bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-2xl flex flex-col overflow-hidden  border-r border-slate-200/60">
          {/* Logo Section - INCREASED HEIGHT */}
          <div className="w-full flex justify-start pl-5 gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-[1.7rem] items-center shadow-lg">
            <Tractor className="w-7 h-7" />
            <h1 className="text-2xl font-bold tracking-tight">GAF ERP</h1>
          </div>

          {/* Farm ERP Section Heading */}
          <div className="px-4 pt-6 pb-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Farm ERP
            </h2>
          </div>

          {/* Farm ERP Section - Always Open */}
          <nav className="flex-1 overflow-y-auto py-0 px-4 custom-scrollbar">
            <div className="space-y-1">{renderStageSection(stages)}</div>
          </nav>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-4"></div>

          {/* Inventory ERP Section - DIRECT CLICK */}
          {/* <div className="px-4 pt-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-blue-600" />
              Inventory ERP
            </h2>
            <button
              onClick={() => handleItemClick("Admin Inventory Management")}
              className={`group cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                selected === "Admin Inventory Management"
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 font-medium"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200"
              }`}
            >
              <Package
                className={`w-4 h-4 transition-all duration-200 ${
                  selected === "Admin Inventory Management"
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-500"
                }`}
              />
              <span>Inventory Management</span>
            </button>
          </div> */}

          {/* Finance ERP Section - DIRECT CLICK */}
          {/* <div className="px-4 pt-4 pb-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              Finance ERP
            </h2>
            <button
              onClick={() => handleItemClick("Finance Management")}
              className={`group cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                selected === "Finance Management"
                  ? "bg-slate-600 text-white shadow-lg shadow-slate-500/30 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-700 border border-slate-200"
              }`}
            >
              <BarChart3
                className={`w-4 h-4 transition-all duration-200 ${
                  selected === "Finance Management"
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <span>Finance Management</span>
            </button>
          </div> */}

          {/* Footer */}
          <div className="border-t border-slate-200/60 px-6 py-4 bg-white/80 backdrop-blur-sm">
            <p className="text-xs text-center text-slate-400">
              © {new Date().getFullYear()} LIMS. All rights reserved.
            </p>
          </div>

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>
        </aside>

        {/* Main area: header + content */}
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10">
            {/* Dynamic page header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-[1.08REM]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    {/* dynamic icon */}
                    {(() => {
                      const map = {
                        Dashboard: Layers,
                        //"My Lands": MapPin,
                        "Land Registration": Layers,
                        "Soil Health": Droplet,
                        "Crop Planner": FileText,
                        "Irrigation Management": Droplet,
                        "Labor Management": Users,
                        "Weather Forecast": Cloud,
                        "Crop Management": Layers,
                        "Inventory": Package,
                        "Pest Monitoring": Bug,
                        "Land Preparation": LandPlot,
                        "Harvest Scheduling": TrendingUp,
                        "Shipping and Logistics": Package,
                        "Farm Analytics Dashboard": BarChart3,
                        "Admin Inventory Management": Package,
                        "Finance Management": BarChart3,
                      };

                      const key = selected || "Dashboard";
                      const Icon = map[key] || Layers;
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    {/* dynamic title and description */}
                    {(() => {
                      const map = {
                        Dashboard: ["Dashboard", "Overview and quick insights"],
                    //    "My Lands": ["My Lands", "View and manage your lands"],
                        "Land Registration": [
                          "Land Registration",
                          "Draw and manage your agricultural fields",
                        ],
                        "Soil Health": [
                          "Soil Health",
                          "Monitor soil properties and reports",
                        ],
                        "Crop Planner": [
                          "Crop Planner",
                          "Manage Crop and plans",
                        ],
                        "Irrigation Management": [
                          "Irrigation Management",
                          "Manage irrigation schedules and devices",
                        ],
                        "Labor Management": [
                          "Labor Management",
                          "Assign and track labor tasks",
                        ],
                        "Weather Forecast": [
                          "Weather Forecast",
                          "Latest weather predictions for your area",
                        ],
                        "Crop Management": [
                          "Crop Management",
                          "Plan and track sowing activities",
                        ],
                        Inventory: [
                          "Inventory",
                          "Track inventory and supplies",
                        ],
                        "Pest Monitoring": [
                          "Pest Monitoring",
                          "Monitor pests and interventions",
                        ],
                        "Land Preparation": [
                          "Land Preparation",
                          "Prepare your Land with digital tech",
                        ],
                        "Harvest Scheduling": [
                          "Harvest Scheduling",
                          "Schedule your Harvest",
                        ],
                        "Shipping and Logistics": [
                          "Shipping and Logistics",
                          "Ship your stock",
                        ],
                        "Farm Analytics Dashboard": [
                          "Farm Analytics Dashboard",
                          "Manage your Finance Records",
                        ],
                        "Admin Inventory Management": [
                          "Inventory Management",
                          "Manage and track inventory items",
                        ],
                        "Finance Management": [
                          "Finance Management",
                          "Manage your finance records",
                        ],
                      };

                      const key = selected || "Dashboard";
                      const [title, desc] = map[key] || map["Dashboard"];
                      return (
                        <>
                          <h1 className="text-2xl font-bold text-white">
                            {title}
                          </h1>
                          <p className="text-emerald-50 text-sm">{desc}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* profile / dropdown (bg white) */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex cursor-pointer items-center gap-2 bg-white text-green-900 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
                  >
                    <User size={18} />
                    <span className="text-sm">{userEmail}</span>
                    <ChevronDown size={16} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-[9999]">
                      <button
                        className="flex items-center gap-2 cursor-pointer w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User size={16} /> Profile
                      </button>
                      <button
                        className="flex items-center gap-2 cursor-pointer w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Settings size={16} /> Settings
                      </button>
                      <Link
                        href={"/login"}
                        className="flex items-center gap-2 cursor-pointer w-full px-4 py-2 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          try {
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("access");
                              localStorage.removeItem("refresh");
                            }
                          } catch (e) {
                            console.error("Error clearing auth tokens:", e);
                          }
                          setMenuOpen(false);
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area - RENDERING ALL ACTUAL COMPONENTS */}
          <div className="flex-1">
            <div className="bg-white w-full h-[90vh] overflow-auto">
              {/* render selected content */}
              {(() => {
                const selectedItem =
                  typeof window !== "undefined"
                    ? localStorage.getItem("selected")
                    : selected;
                switch (selectedItem) {
                  //case "My Lands":
                   // return <Fields />;
                  case "Land Registration":
                    return <FieldMapping />;
                  case "Soil Health":
                    return <SoilHealth />;
                  case "Crop Planner":
                    return <CropPreparation />;
                  case "Irrigation Management":
                    return <IrrigationManagement />;
                  case "Labor Management":
                    return <Labormanagement />;
                  case "Weather Forecast":
                    return <WeatherForecast />;
                  case "Crop Management":
                    return <CropSowing />;
                  case "Inventory":
                    return <InventaryManagement />;
                  case "Pest Monitoring":
                    return <PestManagement />;
                  case "Harvest Scheduling":
                    return <Harvestschedule />;
                  case "Shipping and Logistics":
                    return <Shippingandlogistics />;
                  case "Farm Analytics Dashboard":
                    return <FarmAnalyticsDashboard />;
                  case "Land Preparation":
                    return <LandPreparation />;
                  case "Admin Inventory Management":
                    return <AdminInventoryManagement />;
                  case "Finance Management":
                    return <FinanceManagement />;
                  case "Field Allocation":
                    return <FieldAllocation />;
                  default:
                    return <Content />;
                }
              })()}
            </div>
          </div>
        </main>
      </div>
          
    </>
  );
}
