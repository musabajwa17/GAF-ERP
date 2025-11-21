"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  LandPlot,
  MapPin,
  Maximize2,
} from "lucide-react";
// import Sidebar from "@/components/sidebar/Sidebar";
import { useRouter } from "next/navigation";
import ProtectedPage from "../contact/ProtectedPage/AuthorizedPage";
import History_detail_history from "../dashboard/History_detail_history";

export default function Fields() {
  const [allFields, setAllFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showhistorydetailhistory, setShowhistorydetailhistory] = useState(false);
  // const router = useRouter(); 



  // ✅ Fetch API data
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://earthscansystems.com/farmerdatauser/userfarm/",{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access")}`, // ✅ add this line
   
             },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fields");
        }
        const data = await response.json();

        // ✅ Ensure array
        if (Array.isArray(data)) {
          setAllFields(data);
        } else {
          setAllFields([data]);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // ✅ Filter logic
  const filteredFields = allFields.filter(
    (farm) =>
      farm.farm_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.farm_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-48 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 p-4"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <ProtectedPage>
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50  flex gap-3 h-screen  overflow-hidden">
      {/* <Sidebar /> */}
      <div className="w-full p-3 h-screen overflow-y-scroll">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-[var(--color)] bg-clip-text text-transparent mb-2">
                Registered Fields
              </h1>
              <p className="text-gray-600">
                Manage and monitor all your fields
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700">
                  {allFields.length}
                </div>
                <div className="text-sm text-gray-500">
                  Total Fields
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Farm Id or name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-200 bg-white/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        {showhistorydetailhistory &&
           <History_detail_history setShowhistorydetailhistory={setShowhistorydetailhistory} />
        }
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredFields.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white/70 rounded-2xl">
              <LandPlot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                No Fields Found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search
              </p>
            </div>
          ) : (
            filteredFields.map((farm, index) => (
              <div
                key={index}
              onClick={()=>{setShowhistorydetailhistory(true)}}
                className="group cursor-pointer active:scale-90 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
               
                {/* Card Header */}
                <div className="bg-green-700 p-6 text-white relative">
                  <div className="flex items-start justify-between mb-2">
                    <LandPlot className="w-8 h-8 text-white/80" />
                    <span className="text-xs underline underline-offset-2">
                      {farm.farm_id}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{farm.farm_name}</h2>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Area */}
                  <div className="flex items-center gap-3">
                    <Maximize2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {farm.area}
                      </p>
                      <p className="text-sm text-gray-500">{farm.unit}</p>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-green-700" />
                      <h4 className="font-semibold text-green-800 text-sm uppercase tracking-wide">
                        Coordinates
                      </h4>
                    </div>
                    <div className="max-h-24 overflow-y-auto scrollbar-hide">
                      {farm.coordinates?.map((coord, coordIndex) => (
                        <div
                          key={coordIndex}
                          className="text-sm text-gray-700"
                        >
                          {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </ProtectedPage>
  );
}
