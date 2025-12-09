"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  Search,
  MapPin,
  Wheat,
  CloudSun,
  CalendarDays,
  Package,
  FileText,
  Hash,
  X,
  Save,
  Settings,
  Sprout,
  Box,
  Sparkles,
  Edit,
  Inbox
} from "lucide-react";


const API_BASE_URL = "https://earthscansystems.com/erp";

export default function HarvestScheduling() {
  // ----- Tabs -----
  const [activeTab, setActiveTab] = useState("schedule"); // schedule | yield | records

  // ----- Original schedule states -----
  const [startDate, setStartDate] = useState({ month: 6, year: 2024, day: 5 });
  const [endDate, setEndDate] = useState({ month: 7, year: 2024, day: 7 });
  const [formData, setFormData] = useState({
    crop: "",
    field: "",
    estimated_yield: "",
    crew: "",
    machinery: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [harvestData, setHarvestData] = useState([]); // schedules from backend
  const [loading, setLoading] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // ----- Fetch schedules (original) -----
  const fetchHarvestSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/harvest-schedules/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setHarvestData(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      console.error("Error fetching harvest schedules:", err);
      // silently fail but keep UX
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvestSchedules();
  }, []);

  // ----- Date navigation helpers (original) -----
  const handleDateClick = (month, day, isStart) => {
    if (isStart) setStartDate((s) => ({ ...s, month, day }));
    else setEndDate((e) => ({ ...e, month, day }));
  };

  const handlePrevMonth = (isStart) => {
    if (isStart) {
      const newMonth = startDate.month === 0 ? 11 : startDate.month - 1;
      const newYear = startDate.month === 0 ? startDate.year - 1 : startDate.year;
      setStartDate({ ...startDate, month: newMonth, year: newYear });
    } else {
      const newMonth = endDate.month === 0 ? 11 : endDate.month - 1;
      const newYear = endDate.month === 0 ? endDate.year - 1 : endDate.year;
      setEndDate({ ...endDate, month: newMonth, year: newYear });
    }
  };

  const handleNextMonth = (isStart) => {
    if (isStart) {
      const newMonth = startDate.month === 11 ? 0 : startDate.month + 1;
      const newYear = startDate.month === 11 ? startDate.year + 1 : startDate.year;
      setStartDate({ ...startDate, month: newMonth, year: newYear });
    } else {
      const newMonth = endDate.month === 11 ? 0 : endDate.month + 1;
      const newYear = endDate.month === 11 ? endDate.year + 1 : endDate.year;
      setEndDate({ ...endDate, month: newMonth, year: newYear });
    }
  };

  const handleInputChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // ----- Create / Update schedule (original) -----
  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    const start_date = new Date(startDate.year, startDate.month, startDate.day).toISOString().split("T")[0];
    const end_date = new Date(endDate.year, endDate.month, endDate.day).toISOString().split("T")[0];

    const payload = {
      crop: formData.crop,
      field: formData.field,
      estimated_yield: formData.estimated_yield,
      start_date,
      end_date,
      crew: formData.crew,
      machinery: formData.machinery,
      status: "Scheduled",
    };

    try {
      const url = editingId
        ? `${API_BASE_URL}/harvest-schedules/${editingId}/`
        : `${API_BASE_URL}/harvest-schedules/`;
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert("Failed to save schedule: " + JSON.stringify(err));
        return;
      }
      await fetchHarvestSchedules();
      resetForm();
      alert(editingId ? "Harvest schedule updated!" : "Harvest schedule added!");
    } catch (err) {
      console.error(err);
      alert("Error saving schedule.");
    }
  };

  // ----- Delete schedule (original) -----
  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/harvest-schedules/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (response.ok) {
        await fetchHarvestSchedules();
      } else {
        alert("Failed to delete schedule.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete schedule.");
    }
  };

  // ----- Edit schedule (original) -----
  const handleEditSchedule = (harvest) => {
    setFormData({
      crop: harvest.crop,
      field: harvest.field,
      estimated_yield: harvest.estimated_yield,
      crew: harvest.crew,
      machinery: harvest.machinery,
    });
    const start = new Date(harvest.start_date);
    const end = new Date(harvest.end_date);
    setStartDate({ month: start.getMonth(), year: start.getFullYear(), day: start.getDate() });
    setEndDate({ month: end.getMonth(), year: end.getFullYear(), day: end.getDate() });
    setEditingId(harvest.id);
    setActiveTab("schedule");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ crop: "", field: "", estimated_yield: "", crew: "", machinery: "" });
    setEditingId(null);
    setStartDate({ month: 6, year: 2024, day: 5 });
    setEndDate({ month: 7, year: 2024, day: 7 });
  };

  // ----- CalendarMonth component (reused) -----
  const CalendarMonth = ({ dateObj, isStart }) => {
    const { month, year, day: selectedDay } = dateObj;
    const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();
    const daysInMonth = getDaysInMonth(month, year);
    const startDay = getFirstDayOfMonth(month, year);

    const renderDays = () => {
      const days = [];
      for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-10" />);
      for (let d = 1; d <= daysInMonth; d++) {
        const isSelected = d === selectedDay;
        let cls = "h-10 flex items-center justify-center cursor-pointer rounded-lg transition-colors ";
        cls += isSelected ? "bg-green-500 text-white font-semibold" : "hover:bg-green-100";
        days.push(
          <div key={d} className={cls} onClick={() => handleDateClick(month, d, isStart)}>
            {d}
          </div>
        );
      }
      return days;
    };

    return (
      <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => handlePrevMonth(isStart)} className="p-2 rounded-full hover:bg-green-100">
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-bold text-lg text-gray-900">{monthNames[month]} {year}</h3>
          <button type="button" onClick={() => handleNextMonth(isStart)} className="p-2 rounded-full hover:bg-green-100">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="font-semibold text-gray-600 pb-2">{d}</div>)}
          {renderDays()}
        </div>
      </div>
    );
  };

  // ----------------- HARVEST RECORDS (new tab) -----------------
  // Predefined options (manual dropdowns)
  const fieldOptions = ["Field A", "Field B", "Field C"];
  const cropOptions = ["Wheat", "Rice", "Corn", "Sugarcane"];
  const seasonOptions = ["Spring", "Summer", "Autumn", "Winter"];
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const yearOptions = [2023, 2024, 2025, 2026];
  const unitOptions = ["kg", "ton", "bag"];

  // Records state & UI state
  const [records, setRecords] = useState([
    // example rows
    { id: 1, field: "Field A", crop: "Wheat", quantity: 1200, unit: "kg", season: "Spring", month: "March", year: 2024 },
    { id: 2, field: "Field B", crop: "Rice", quantity: 800, unit: "kg", season: "Summer", month: "July", year: 2025 }
  ]);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recordForm, setRecordForm] = useState({
    id: null, field: "", crop: "", quantity: "", unit: "", season: "", month: "", year: ""
  });
  const [filters, setFilters] = useState({ search: "", crop: "", field: "", year: "", month: "", season: "" });

  // helper: reset record form
  const resetRecordForm = () => setRecordForm({ id: null, field: "", crop: "", quantity: "", unit: "", season: "", month: "", year: "" });

  // Add or update record
  const handleRecordSave = (e) => {
    e && e.preventDefault?.();
    const { id, field, crop, quantity, unit, season, month, year } = recordForm;
    if (!field || !crop || !quantity || !unit || !season || !month || !year) {
      alert("Please fill all fields in the record form.");
      return;
    }
    if (id) {
      // update
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...recordForm } : r)));
    } else {
      // create
      const newId = records.length ? Math.max(...records.map(r => r.id)) + 1 : 1;
      setRecords((prev) => [...prev, { ...recordForm, id: newId }]);
    }
    resetRecordForm();
    setShowRecordForm(false);
  };

  const handleRecordEdit = (r) => {
    setRecordForm({ ...r });
    setShowRecordForm(true);
    setActiveTab("records");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRecordDelete = (id) => {
    if (!window.confirm("Delete record?")) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Filtering for display
  const filteredRecords = records.filter((r) => {
    return (
      (!filters.search || r.crop.toLowerCase().includes(filters.search.toLowerCase()) || r.field.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.crop || r.crop === filters.crop) &&
      (!filters.field || r.field === filters.field) &&
      (!filters.year || r.year === parseInt(filters.year)) &&
      (!filters.month || r.month === filters.month) &&
      (!filters.season || r.season === filters.season)
    );
  });

  // ----------------- RENDER -----------------
  return (
    <div className="w-full min-h-screen bg-white text-gray-900 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Harvest Scheduling & Yield Capture</h1>
        <p className="text-gray-600">Plan optimal harvest windows, allocate resources, and capture yield data.</p>
      </header>

      {/* Tabs */}
      <div className="border-b border-green-300 mb-8">
        <nav className="flex space-x-8 -mb-px">
          {[
            { key: "schedule", label: "Schedule" },
            { key: "yield", label: "Yield Maps" },
            { key: "records", label: "Harvest Records" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`py-4 px-1 border-b-2 font-semibold transition-colors ${activeTab === t.key ? "border-green-500 text-gray-900" : "border-transparent text-gray-600 hover:border-green-300 hover:text-gray-900"
                }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* === SCHEDULE TAB === */}
      {activeTab === "schedule" && (
        <>
          <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Harvest Schedule" : "Add New Harvest Schedule"}
            </h2>

            <form onSubmit={handleSubmitSchedule}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {[
                  { key: "crop", label: "Crop" },
                  { key: "field", label: "Field" },
                  { key: "estimated_yield", label: "Estimated Yield" },
                  { key: "crew", label: "Crew" },
                  { key: "machinery", label: "Machinery" }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold mb-2">{label}</label>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-green-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder={`Enter ${label.toLowerCase()}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-4">Select Harvest Window</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-sm font-semibold mb-2">Start Date: {monthNames[startDate.month]} {startDate.day}, {startDate.year}</p>
                  <CalendarMonth dateObj={startDate} isStart={true} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">End Date: {monthNames[endDate.month]} {endDate.day}, {endDate.year}</p>
                  <CalendarMonth dateObj={endDate} isStart={false} />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {editingId && (
                  <button type="button" onClick={resetForm} className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg">
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg">
                  <Plus size={20} />
                  {editingId ? "Update Harvest Schedule" : "Add Harvest Schedule"}
                </button>
              </div>
            </form>
          </div>

          {/* Schedule Table */}
          <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Harvests</h2>
              {loading && <span className="text-green-600">Loading...</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-green-200 bg-green-50">
                    <th className="p-4 font-semibold">Crop</th>
                    <th className="p-4 font-semibold">Field</th>
                    <th className="p-4 font-semibold">Estimated Yield</th>
                    <th className="p-4 font-semibold">Harvest Window</th>
                    <th className="p-4 font-semibold">Crew</th>
                    <th className="p-4 font-semibold">Machinery</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {harvestData.length ? harvestData.map(h => (
                    <tr key={h.id} className="border-b border-green-100 hover:bg-green-50">
                      <td className="p-4 font-medium">{h.crop}</td>
                      <td className="p-4">{h.field}</td>
                      <td className="p-4">{h.estimated_yield}</td>
                      <td className="p-4">{h.harvest_window || `${h.start_date} → ${h.end_date}`}</td>
                      <td className="p-4">{h.crew}</td>
                      <td className="p-4">{h.machinery}</td>
                      <td className="p-4"><span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">{h.status}</span></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditSchedule(h)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteSchedule(h.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="p-6 text-center text-gray-500">No schedules found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* === YIELD MAPS TAB (placeholder) === */}
      {activeTab === "yield" && (
        <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Yield Maps</h2>
          <p className="text-gray-600 mb-4">Upload or view yield maps. (Integrate mapping / charts here.)</p>
          {/* placeholder area — you can integrate maps/charts here */}
          <div className="h-64 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            Map / Chart placeholder
          </div>
        </div>
      )}

      {/* === RECORDS TAB === */}
      {activeTab === "records" && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-emerald-100 shadow-xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Harvest Records
              </h2>
              <p className="text-gray-500 text-sm mt-1">Manage and track your harvest data</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Enhanced Search Input */}
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search crop or field..."
                  className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                />
              </div>

              {/* Add Record Button */}
              <button
                onClick={() => { resetRecordForm(); setShowRecordForm(true); }}
                className="group relative px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Plus size={18} className="relative z-10" />
                <span className="relative z-10">Add Record</span>
              </button>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:text-emerald-600 transition-colors z-10" size={18} />
              <select
                className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer appearance-none font-medium text-gray-700"
                // style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }}
                value={filters.field}
                onChange={(e) => setFilters(f => ({ ...f, field: e.target.value }))}
              >
                <option value="">All Fields</option>
                {fieldOptions.map((f, i) => <option key={i} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="relative group">
              <Wheat className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:text-emerald-600 transition-colors z-10" size={18} />
              <select
                className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer appearance-none font-medium text-gray-700"
                // style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }}
                value={filters.crop}
                onChange={(e) => setFilters(f => ({ ...f, crop: e.target.value }))}
              >
                <option value="">All Crops</option>
                {cropOptions.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="relative group">
              <CloudSun className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:text-emerald-600 transition-colors z-10" size={18} />
              <select
                className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer appearance-none font-medium text-gray-700"
                // style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }}
                value={filters.season}
                onChange={(e) => setFilters(f => ({ ...f, season: e.target.value }))}
              >
                <option value="">All Seasons</option>
                {seasonOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:text-emerald-600 transition-colors z-10" size={18} />
              <select
                className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer appearance-none font-medium text-gray-700"
                // style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }}
                value={filters.month}
                onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))}
              >
                <option value="">All Months</option>
                {monthOptions.map((m, i) => <option key={i} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="relative group">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:text-emerald-600 transition-colors z-10" size={18} />
              <select
                className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer appearance-none font-medium text-gray-700"
                // style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }}
                value={filters.year}
                onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
              >
                <option value="">All Years</option>
                {yearOptions.map((y, i) => <option key={i} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="relative group">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-hover:text-emerald-600 transition-colors z-10" size={18} />
              <select
                className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer appearance-none font-medium text-gray-700"
                // style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2310b981' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em' }}
                value={filters.unit}
                onChange={(e) => setFilters(f => ({ ...f, unit: e.target.value }))}
              >
                <option value="">All Units</option>
                {unitOptions.map((u, i) => <option key={i} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {/* Enhanced Add/Edit Form */}
          {showRecordForm && (
            <form onSubmit={handleRecordSave} className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-emerald-200 shadow-lg animate-in slide-in-from-top duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                <FileText size={20} className="text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {recordForm.id ? 'Edit Record' : 'Add New Record'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <select
                    required
                    value={recordForm.field}
                    onChange={(e) => setRecordForm(r => ({ ...r, field: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Field</option>
                    {fieldOptions.map((f, i) => <option key={i} value={f}>{f}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <Wheat className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <select
                    required
                    value={recordForm.crop}
                    onChange={(e) => setRecordForm(r => ({ ...r, crop: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Select Crop</option>
                    {cropOptions.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <input
                    required
                    type="number"
                    placeholder="Quantity"
                    value={recordForm.quantity}
                    onChange={(e) => setRecordForm(r => ({ ...r, quantity: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  />
                </div>

                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <select
                    required
                    value={recordForm.unit}
                    onChange={(e) => setRecordForm(r => ({ ...r, unit: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Unit</option>
                    {unitOptions.map((u, i) => <option key={i} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <CloudSun className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <select
                    required
                    value={recordForm.season}
                    onChange={(e) => setRecordForm(r => ({ ...r, season: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Season</option>
                    {seasonOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <select
                    required
                    value={recordForm.month}
                    onChange={(e) => setRecordForm(r => ({ ...r, month: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Month</option>
                    {monthOptions.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                  <select
                    required
                    value={recordForm.year}
                    onChange={(e) => setRecordForm(r => ({ ...r, year: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  >
                    <option value="">Year</option>
                    {yearOptions.map((y, i) => <option key={i} value={y}>{y}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { resetRecordForm(); setShowRecordForm(false); }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-gray-200 flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Enhanced Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        Field
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <Wheat size={16} />
                        Crop
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <Hash size={16} />
                        Quantity
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <Package size={16} />
                        Unit
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <CloudSun size={16} />
                        Season
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Month
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        Year
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      <div className="flex items-center gap-2">
                        <Settings size={16} />
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredRecords.length ? filteredRecords.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          {r.field}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                          <Sprout size={14} />
                          {r.crop}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{r.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Box size={12} className="text-gray-400" />
                          {r.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                          <Sparkles size={12} />
                          {r.season}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.month}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.year}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleRecordEdit(r)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleRecordDelete(r.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                            <Inbox size={32} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-gray-500 font-medium">No records found</p>
                            <p className="text-gray-400 text-sm mt-1">Add your first harvest record to get started</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
