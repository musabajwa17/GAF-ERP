"use client";
import { useState, useEffect } from "react";
import { Droplets, Plus, Trash2, Calendar } from "lucide-react";

const API_URL = "https://earthscansystems.com/erp/irrigation/";

const cropWaterData = {
  wheat: { name: "Wheat", waterPerSession: 25, duration: 45, frequency: "Every 7 days", icon: "🌾" },
  rice: { name: "Rice", waterPerSession: 50, duration: 90, frequency: "Daily", icon: "🌾" },
  corn: { name: "Corn", waterPerSession: 30, duration: 60, frequency: "Every 5 days", icon: "🌽" },
  cotton: { name: "Cotton", waterPerSession: 35, duration: 70, frequency: "Every 10 days", icon: "🌱" },
  tomato: { name: "Tomato", waterPerSession: 20, duration: 40, frequency: "Every 3 days", icon: "🍅" },
  potato: { name: "Potato", waterPerSession: 28, duration: 55, frequency: "Every 5 days", icon: "🥔" },
  vegetables: { name: "Vegetables", waterPerSession: 22, duration: 45, frequency: "Every 3 days", icon: "🥬" },
  fruits: { name: "Fruits", waterPerSession: 32, duration: 65, frequency: "Every 4 days", icon: "🍎" },
};

const moisturingMethods = {
  drip: { name: "Drip Irrigation", efficiency: 0.95, multiplier: 1.0 },
  sprinkler: { name: "Sprinkler", efficiency: 0.75, multiplier: 1.2 },
  flood: { name: "Flood Irrigation", efficiency: 0.5, multiplier: 1.8 },
  micro: { name: "Micro Sprinkler", efficiency: 0.85, multiplier: 1.1 },
};

export default function IrrigationManagement() {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    fieldName: "",
    zone: "",
    crop: "wheat",
    method: "drip",
    startTime: "06:00",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;

  // ✅ Fetch all irrigation schedules (GET)
  const fetchSchedules = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch schedules");

      const data = await response.json();
      const scheduleList = Array.isArray(data) ? data : data.data || [];
      setSchedules(scheduleList);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // ✅ Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add new schedule (POST)
  const addSchedule = async () => {
    if (!formData.fieldName || !formData.zone) {
      alert("Please fill in all fields");
      return;
    }

    const cropData = cropWaterData[formData.crop];
    const methodData = moisturingMethods[formData.method];
    const waterAmount = Math.round(cropData.waterPerSession * methodData.multiplier);
    const duration = Math.round(cropData.duration * methodData.multiplier);

    const newSchedule = {
      field_name: formData.fieldName,
      zone: formData.zone,
      crop: formData.crop,
      crop_name: cropData.name,
      method: formData.method,
      method_name: methodData.name,
      water_amount: waterAmount,
      duration: duration,
      frequency: cropData.frequency,
      start_time: formData.startTime,
      efficiency: methodData.efficiency,
      status: "Scheduled",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSchedule),
      });

      if (response.ok) {
        alert("Irrigation schedule added successfully!");
        fetchSchedules();
        setFormData({
          fieldName: "",
          zone: "",
          crop: "wheat",
          method: "drip",
          startTime: "06:00",
        });
      } else {
        const errorData = await response.json();
        console.error("Error adding schedule:", errorData);
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  // ✅ Delete schedule (DELETE)
  const deleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Schedule deleted successfully!");
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete schedule:", errorData);
        alert("Failed to delete schedule!");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const totalWater = schedules.reduce((sum, s) => sum + (s.water_amount || 0), 0);
  const totalDuration = schedules.reduce((sum, s) => sum + (s.duration || 0), 0);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Droplets className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Smart Irrigation Scheduling
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Schedule irrigation for fields and zones with automatic water allocation
          </p>
        </div> */}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-green-600" />
            Create Irrigation Schedule
          </h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Field Name</label>
                <input
                  type="text"
                  name="fieldName"
                  value={formData.fieldName}
                  onChange={handleInputChange}
                  placeholder="e.g., North Field A"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zone Number</label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  placeholder="e.g., Zone 1 or A-1"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                >
                  {Object.entries(cropWaterData).map(([key, crop]) => (
                    <option key={key} value={key}>
                      {crop.icon} {crop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Irrigation Method</label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                >
                  {Object.entries(moisturingMethods).map(([key, method]) => (
                    <option key={key} value={key}>
                      {method.name} ({Math.round(method.efficiency * 100)}% efficient)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={addSchedule}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add to Schedule
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {schedules.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6" /> Irrigation Schedule Overview
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {["Field", "Zone", "Water (mm)", "Duration", "Frequency", "Start Time", "Efficiency", "Status", "Action"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{s.field_name}</td>
                      <td className="px-6 py-4">{s.zone}</td>
                      {/* <td className="px-6 py-4">{s.crop_name}</td>
                      <td className="px-6 py-4">{s.method_name}</td> */}
                      <td className="px-6 py-4 font-bold text-blue-600">{s.water_amount}</td>
                      <td className="px-6 py-4">{s.duration}</td>
                      <td className="px-6 py-4">{s.frequency}</td>
                      <td className="px-6 py-4">{s.start_time}</td>
                      <td className="px-6 py-4">{Math.round(s.efficiency * 100)}%</td>
                      <td className="px-6 py-4">{s.status}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteSchedule(s.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Schedules Yet</h3>
            <p className="text-gray-600">
              Create your first irrigation schedule using the form above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}