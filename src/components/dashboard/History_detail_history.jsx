import { X, Leaf, Calendar, MapPin, Sprout, Filter, Cloud, Sun } from "lucide-react";
import React, { useState } from "react";

function HistoryDetailHistory({ setShowhistorydetailhistory }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedCrop, setselectedCrop] = useState("");

  const historyData = [
    { year: 2021, season: "Kharif", field: "Field A", crop: "Rice", yield: "4.2 tons", status: "Completed", mechine: "Tractor", manpower: "5 Workers" },
    { year: 2022, season: "Rabi", field: "Field B", crop: "Wheat", yield: "3.8 tons", status: "Completed", mechine: "Plough", manpower: "4 Workers" },
    { year: 2023, season: "Kharif", field: "Field C", crop: "Sugarcane", yield: "65 tons", status: "Completed", mechine: "Harvester", manpower: "6 Workers" },
    { year: 2024, season: "Rabi", field: "Field A", crop: "Gram", yield: "2.1 tons", status: "In Progress", mechine: "Seeder", manpower: "3 Workers" },
  ];

  const filteredData = historyData.filter((item) => {
    return (
      (selectedYear ? item.year === Number(selectedYear) : true) &&
      (selectedSeason ? item.season === selectedSeason : true) &&
      (selectedField ? item.field === selectedField : true) &&
      (selectedCrop ? item.crop === selectedCrop : true)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeasonColor = (season) => {
    return season === "Kharif"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="fixed top-0 inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Main Container */}
      <div className="w-full max-w-6xl h-[700px] bg-white rounded-2xl shadow-2xl overflow-y-scroll scrollbar-hide border border-gray-200">

        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-green-800 via-emerald-700 to-teal-800 px-8 py-8 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4">
              <Leaf size={120} />
            </div>
            <div className="absolute bottom-4 left-4">
              <Sprout size={100} />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Calendar size={150} />
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md border border-white/30 shadow-lg">
                <Leaf size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Field History Dashboard</h1>
                <p className="text-green-100 text-lg mt-1 font-light">Comprehensive crop cycle tracking & analytics</p>
              </div>
            </div>

            <button
              onClick={() => setShowhistorydetailhistory(false)}
              className="bg-white/20 hover:bg-white/30 cursor-pointer text-white p-3 rounded-xl transition-all duration-300 backdrop-blur border border-white/30 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 bg-gray-50/50">

          {/* Enhanced Filters Section */}
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Filter size={20} className="text-green-700" />
                </div>
                Filter Records
              </h2>
              <div className="text-sm text-gray-500">
                {filteredData.length} record{filteredData.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Crop Filter */}
              <div className="relative">
                <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Sprout size={16} />
                  Crop Type
                </label>
                <select
                  className="w-full px-4 py-3.5 bg-white border-2 z-50 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-700 font-medium hover:border-gray-300"
                  value={selectedCrop}
                  onChange={(e) => setselectedCrop(e.target.value)}
                >
                  <option value="">All Crops</option>
                  <option value="Rice">🌾 Rice</option>
                  <option value="Wheat">🌾 Wheat</option>
                  <option value="Sugarcane">🌱 Sugarcane</option>
                  <option value="Gram">🫘 Gram</option>
                </select>
              </div>

              {/* Year Filter */}
              <div className="relative">
                <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Harvest Year
                </label>
                <select
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-700 font-medium hover:border-gray-300"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Season Filter */}
              <div className="relative">
                <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Leaf size={16} />
                  Growing Season
                </label>
                <select
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-700 font-medium hover:border-gray-300"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                >
                  <option value="">All Seasons</option>
                  <option value="Kharif">🌧️ Kharif</option>
                  <option value="Rabi">☀️ Rabi</option>
                </select>
              </div>

              {/* Field Filter */}
              <div className="relative">
                <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin size={16} />
                  Field Location
                </label>
                <select
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none appearance-none cursor-pointer text-gray-700 font-medium hover:border-gray-300"
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                >
                  <option value="">All Fields</option>
                  <option value="Field A">Field A</option>
                  <option value="Field B">Field B</option>
                  <option value="Field C">Field C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced History Table */}
          <div className="overflow-x-scroll scrollbar-hide w-[1100px] rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full   divide-gray-200">
              <thead className="w-full">
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-green-600" />
                      Year
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <Leaf size={18} className="text-green-600" />
                      Season
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-green-600" />
                      Field
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <Sprout size={18} className="text-green-600" />
                      Crop
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    Yield
                  </th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    Machine
                  </th>
                    <th className="px-8 py-5 text-left font-bold text-gray-700 text-sm uppercase tracking-wider">
                    Manpower
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 w-full">
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-green-50/50 transition-all duration-200 group cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <Calendar size={18} className="text-green-700" />
                          </div>
                          <span className="font-semibold text-gray-800 text-lg">{row.year}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${getSeasonColor(row.season)}`}>
                          <div className="mr-2">
                            {row.season === "Kharif" ? <Cloud /> : <Sun />}
                          </div>
                          <div>
                            {row.season}
                          </div>
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-gray-100 text-gray-800 w-[100px] h-[40px] flex justify-center items-center gap-2 rounded-full text-sm font-semibold border border-gray-200">

                          <MapPin />
                          <div>
                            {row.field}
                          </div>
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Sprout size={16} className="text-amber-700" />
                          </div>
                          <span className="font-semibold text-gray-800">{row.crop}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-medium text-gray-700 flex bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                          {row.yield}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center justify-center h-[40px] w-[100px]  rounded-full text-sm font-semibold border ${getStatusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(row.status)}`}>
                          {row.mechine}
                        </span>
                      </td>
                    <td className="px-8 py-5">
                        <span className={`flex items-center justify-center h-[40px] w-[100px]  rounded-full text-sm font-semibold border ${getStatusColor(row.status)}`}>
                          {row.manpower}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-16 text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Sprout size={32} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600 text-lg">No records found</p>
                          <p className="text-gray-500 mt-1">Try adjusting your filters to see more results</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Enhanced Footer */}
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-l-4 border-green-500 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-semibold text-lg">
                  📊 Agricultural Insights
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Track your farming progress and make data-driven decisions for better yields
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-800 font-bold text-xl">{filteredData.length}</p>
                <p className="text-green-700 text-sm">Total Records</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryDetailHistory;