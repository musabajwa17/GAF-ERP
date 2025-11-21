"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  User,
  Map,
  Calendar,
  ClipboardList,
  DollarSign,
  Tag,
  Clock,
} from "lucide-react";
// import Sidebar from "../../../components/sidebar/Sidebar";
import ProtectedPage from "../contact/ProtectedPage/AuthorizedPage";

// 🌐 Backend API base URL
const API_URL = "https://earthscansystems.com/erp/contracts/";

export default function FarmingForm() {
  const [formData, setFormData] = useState({
    farmerName: "",
    contractorName: "",
    area: "",
    landUnit: "Acre",
    fieldName: "",
    money: "",
    startingDate: "",
    contractTime: "",
    timeUnit: "Months",
  });

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  // ✅ Fetch all contracts (GET request)
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) throw new Error("Failed to fetch contracts");
      const data = await response.json();
      setContracts(data.data || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Post a new contract (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Contract saved successfully!");
        setFormData({
          farmerName: "",
          contractorName: "",
          area: "",
          landUnit: "Acre",
          fieldName: "",
          money: "",
          startingDate: "",
          contractTime: "",
          timeUnit: "Months",
        });
        fetchContracts(); // reload list
      } else {
        alert("❌ Failed to save: " + JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const inputClasses =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 outline-none bg-white";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <ProtectedPage>
      <div className="h-screen overflow-hidden w-full bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 flex flex-col lg:flex-row items-start gap-6">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 overflow-y-scroll h-full">
          {/* Left: Form */}
          <div className="flex-1 max-w-3xl mx-auto lg:mx-0">
            <div className="bg-white rounded-t-2xl shadow-sm border-b border-gray-200 p-5 md:p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Farming Contract
                </h1>
              </div>
              <p className="text-gray-600 ml-12 text-sm md:text-base">
                Create and manage your agricultural contracts efficiently
              </p>
            </div>

            <div className="bg-white rounded-b-2xl shadow-lg p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Farmer Name */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" /> Farmer Name
                      </div>
                    </label>
                    <input
                      type="text"
                      name="farmerName"
                      value={formData.farmerName}
                      onChange={(e) =>
                        setFormData({ ...formData, farmerName: e.target.value })
                      }
                      placeholder="Enter farmer's name"
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Contractor Name */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" /> Contractor Name
                      </div>
                    </label>
                    <input
                      type="text"
                      name="contractorName"
                      value={formData.contractorName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contractorName: e.target.value,
                        })
                      }
                      placeholder="Enter contractor's name"
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Area */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-purple-600" /> Area
                      </div>
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="Enter land area"
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Land Unit */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-600" /> Land Unit
                      </div>
                    </label>
                    <select
                      name="landUnit"
                      value={formData.landUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, landUnit: e.target.value })
                      }
                      className={inputClasses}
                    >
                      <option value="Acre">Acre</option>
                      <option value="Hectare">Hectare</option>
                      <option value="Km²">Km²</option>
                    </select>
                  </div>

                  {/* Field Name */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-yellow-600" /> Field Name
                      </div>
                    </label>
                    <input
                      type="text"
                      name="fieldName"
                      value={formData.fieldName}
                      onChange={(e) =>
                        setFormData({ ...formData, fieldName: e.target.value })
                      }
                      placeholder="Enter field name"
                      className={inputClasses}
                    />
                  </div>

                  {/* Money */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" /> Money
                      </div>
                    </label>
                    <input
                      type="number"
                      name="money"
                      value={formData.money}
                      onChange={(e) =>
                        setFormData({ ...formData, money: e.target.value })
                      }
                      placeholder="Enter contract amount"
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Starting Date */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-600" /> Starting Date
                      </div>
                    </label>
                    <input
                      type="date"
                      name="startingDate"
                      value={formData.startingDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startingDate: e.target.value,
                        })
                      }
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Contract Time */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" /> Contract Time
                      </div>
                    </label>
                    <input
                      type="text"
                      name="contractTime"
                      value={formData.contractTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contractTime: e.target.value,
                        })
                      }
                      placeholder="e.g. 1, 6, 12"
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Time Unit */}
                  <div>
                    <label className={labelClasses}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" /> Time Unit
                      </div>
                    </label>
                    <select
                      name="timeUnit"
                      value={formData.timeUnit}
                      onChange={(e) =>
                        setFormData({ ...formData, timeUnit: e.target.value })
                      }
                      className={inputClasses}
                    >
                      <option value="Months">Months</option>
                      <option value="Years">Years</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Save Contract
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Saved Contracts */}
          <div className="w-full lg:w-[380px] bg-gradient-to-br  from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 h-fit mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClipboardList className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                Saved Contracts
              </h2>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : contracts.length === 0 ? (
              <p className="text-center text-gray-500">No contracts found</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {contracts.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-green-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-gray-900 mb-1">
                          {c.farmerName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">→</span>
                          <span>{c.contractorName}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">
                          {idx + 1}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <div>
                        {c.fieldName} • {c.area} {c.landUnit}
                      </div>
                      <div>
                        {c.startingDate} • {c.contractTime} {c.timeUnit}
                      </div>
                      <div className="mt-1 font-semibold text-green-700">
                        💰 {c.money} PKR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
