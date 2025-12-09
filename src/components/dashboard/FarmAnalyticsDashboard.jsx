"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Package,
  Sprout,
  MapPin,
  Leaf,
} from "lucide-react";

const FarmAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Sample Data
  const productionData = [
    { month: "Jan", wheat: 240, corn: 180, rice: 150 },
    { month: "Feb", wheat: 280, corn: 210, rice: 170 },
    { month: "Mar", wheat: 320, corn: 240, rice: 190 },
    { month: "Apr", wheat: 380, corn: 280, rice: 220 },
    { month: "May", wheat: 420, corn: 320, rice: 250 },
    { month: "Jun", wheat: 460, corn: 360, rice: 280 },
  ];

  const financeData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
    { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
    { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
    { month: "May", revenue: 70000, expenses: 42000, profit: 28000 },
    { month: "Jun", revenue: 75000, expenses: 45000, profit: 30000 },
  ];

  const cropDistribution = [
    { name: "Wheat", value: 35, color: "#4ade80" },
    { name: "Corn", value: 28, color: "#facc15" },
    { name: "Rice", value: 22, color: "#60a5fa" },
    { name: "Soybeans", value: 15, color: "#a78bfa" },
  ];

  const inventoryData = [
    { item: "Seeds", stock: 850, threshold: 500 },
    { item: "Fertilizer", stock: 620, threshold: 400 },
    { item: "Pesticides", stock: 380, threshold: 300 },
    { item: "Equipment", stock: 95, threshold: 50 },
    { item: "Fuel", stock: 720, threshold: 600 },
  ];

  const fieldProductivity = [
    { field: "Field A", yield: 4.8, area: 50 },
    { field: "Field B", yield: 5.2, area: 45 },
    { field: "Field C", yield: 4.5, area: 60 },
    { field: "Field D", yield: 5.5, area: 40 },
    { field: "Field E", yield: 4.9, area: 55 },
  ];

  // ✅ Reusable Card
  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-gradient-to-br from-white to-green-50 hover:from-green-50 hover:to-white rounded-2xl p-6 shadow-md border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span
          className={`text-sm font-semibold ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );

  // ✅ Render Tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Production"
                value="1,240 tons"
                change={12}
                icon={Sprout}
                color="bg-green-500"
              />
              <StatCard
                title="Revenue"
                value="$351K"
                change={8}
                icon={DollarSign}
                color="bg-blue-500"
              />
              <StatCard
                title="Active Fields"
                value="5"
                change={0}
                icon={MapPin}
                color="bg-purple-500"
              />
              <StatCard
                title="Inventory Items"
                value="2,665"
                change={-3}
                icon={Package}
                color="bg-orange-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Area Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Production Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={productionData}>
                    <defs>
                      <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="wheat"
                      stroke="#4ade80"
                      fill="url(#colorWheat)"
                    />
                    <Area
                      type="monotone"
                      dataKey="corn"
                      stroke="#fbbf24"
                      fill="#fef3c7"
                    />
                    <Area
                      type="monotone"
                      dataKey="rice"
                      stroke="#60a5fa"
                      fill="#dbeafe"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Crop Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cropDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {cropDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "finance":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Farm Finance Overview
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#4ade80" />
                <Bar dataKey="expenses" fill="#f87171" />
                <Bar dataKey="profit" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "inventory":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Inventory Status
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="item" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#4ade80" />
                <Bar dataKey="threshold" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "fields":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Field Productivity
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={fieldProductivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="yield" stroke="#4ade80" />
                <Line type="monotone" dataKey="area" stroke="#60a5fa" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return <p className="text-gray-500">Select a section to view analytics.</p>;
    }
  };

  // ✅ Full Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
 

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 ">
        <div className="max-w-7xl mx-auto px-6 flex space-x-6 overflow-x-auto scrollbar-hide">
          {["overview", "fields", "finance", "inventory"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-3 border-b-2 font-semibold text-sm capitalize tracking-wide transition-all ${
                activeTab === tab
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-green-600 hover:border-green-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default FarmAnalyticsDashboard;
