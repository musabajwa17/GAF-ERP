import React, { useEffect, useState } from "react";
import {
  Sprout,
  Tractor,
  Calendar,
  Clock,
  Fuel,
  MapPin,
  Trash2,
  CheckCircle,
  Plus,
  Minus,
  AlertCircle,
  Droplet,
  Leaf,
  Package,
} from "lucide-react";

const CROP_DATABASE = {
  Wheat: { season: ["Rabi"], varieties: ["HD2967", "PBW343", "HD2888"] },
  Rice: { season: ["Kharif"], varieties: ["Basmati", "PR114", "PR121"] },
  Maize: { season: ["Kharif", "Rabi"], varieties: ["Hybrid", "DHM117", "DHM119"] },
  Cotton: { season: ["Kharif"], varieties: ["H4", "MRC7", "MCU5"] },
  Potato: { season: ["Rabi"], varieties: ["Kufri Red", "Kufri Jyoti", "Kufri Chandramukhi"] },
  Onion: { season: ["Rabi"], varieties: ["Puna Red", "Nasik Red", "Agrifound White"] },
  Sesame: { season: ["Kharif"], varieties: ["TIL4", "TIL2", "Pragati"] },
  Sorghum: { season: ["Kharif"], varieties: ["CSH5", "CSH9", "CSH16"] },
};

export default function LandPreparation() {
  const [fields, setFields] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const ALL_PREPARATION_TYPES = [
    "Ploughing",
    "Harrowing",
    "Leveling / Laser Leveling",
    "Ridging",
    "Bed Preparation",
    "Deep Tillage",
    "Rotavator",
    "Chiseling",
    "Disc Plough",
    "Cultivator",
    "Transplanting",
  ];

  const ALL_MACHINERY_TYPES = [
    "Tractor",
    "Laser Leveler",
    "Rotavator",
    "Cultivator",
    "Disc Harrow",
    "Ridger",
    "Chisel Plough",
    "Bed Shaper",
    "Seeder",
    "Transplanter",
  ];

  const FERTILIZER_OPTIONS = [
    "Urea",
    "DAP (Di-Ammonium Phosphate)",
    "NPK (Nitrogen-Phosphorus-Potassium)",
    "Organic Compost",
    "Cow Dung",
    "Vermicompost",
    "Bone Meal",
    "Phosphate Rock",
  ];

  const INPUT_OPTIONS = [
    "Lime",
    "Gypsum",
    "Sulfur",
    "Zinc Sulfate",
    "Magnesium Sulfate",
    "Iron Sulfate",
    "Bioenzymes",
  ];

  const recommendedPrep = {
    Wheat: "Leveling / Laser Leveling",
    Rice: "Transplanting",
    Maize: "Ridging",
    Cotton: "Ridging",
    Potato: "Bed Preparation",
    Onion: "Transplanting",
    Sesame: "Harrowing",
    Sorghum: "Harrowing",
  };

  const recommendedMachinery = {
    Wheat: "Laser Leveler",
    Rice: "Transplanter",
    Maize: "Ridger",
    Cotton: "Ridger",
    Potato: "Bed Shaper",
    Onion: "Transplanter",
    Sesame: "Cultivator",
    Sorghum: "Cultivator",
  };

  const prepToMachinery = {
    "Ploughing": "Tractor",
    "Harrowing": "Cultivator",
    "Leveling / Laser Leveling": "Laser Leveler",
    "Ridging": "Ridger",
    "Bed Preparation": "Bed Shaper",
    "Deep Tillage": "Chisel Plough",
    "Rotavator": "Rotavator",
    "Chiseling": "Chisel Plough",
    "Disc Plough": "Disc Harrow",
    "Cultivator": "Cultivator",
    "Transplanting": "Transplanter",
  };

  const seasonOptions = ["Rabi", "Kharif", "Zaid"];

  const initialForm = {
    taskName: "",
    taskDescription: "",
    field: "",
    season: "",
    crop: "",
    variety: "",
    landPrepType: "",
    machineryType: "",
    machineryCount: 1,
    ownership: "Own",
    fertilizer: "",
    fertiliserQuantity: "",
    additionalInputs: [],
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(initialForm);

  // Fetch Fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(
          "https://earthscansystems.com/farmerdatauser/userfarm/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        const data = await response.json();
        setFields(data);
      } catch (err) {
        console.error("Error fetching fields:", err);
      }
    };
    fetchFields();
  }, []);

  // Load Stored Tasks
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("landPrepTasks")) || [];
    setTasks(stored);
  }, []);

  const calculateEndDate = (startDate) => {
    if (!startDate) return "";
    const duration = 2;
    const start = new Date(startDate);
    start.setDate(start.getDate() + duration);
    return start.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "field") {
      const selected = fields.find(
        (f) => f.id === Number(value) || f.id === value
      );
      setForm({ ...form, field: value });
      return;
    }

    if (name === "crop") {
      setForm({
        ...form,
        crop: value,
        variety: "",
        landPrepType: recommendedPrep[value] || "",
        machineryType: recommendedMachinery[value] || "",
      });
      return;
    }

    if (name === "landPrepType") {
      setForm({
        ...form,
        landPrepType: value,
        machineryType: prepToMachinery[value] || "",
      });
      return;
    }

    if (name === "startDate") {
      setForm({
        ...form,
        startDate: value,
        endDate: calculateEndDate(value),
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleAdditionalInputToggle = (input) => {
    setForm(prev => ({
      ...prev,
      additionalInputs: prev.additionalInputs.includes(input)
        ? prev.additionalInputs.filter(i => i !== input)
        : [...prev.additionalInputs, input]
    }));
  };

  const handleMachineryCount = (delta) => {
    const newCount = Math.max(1, form.machineryCount + delta);
    setForm({ ...form, machineryCount: newCount });
  };

  const handleSubmit = () => {
    if (
      !form.taskName ||
      !form.field ||
      !form.season ||
      !form.crop ||
      !form.variety ||
      !form.landPrepType ||
      !form.machineryType
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    const newTask = {
      id: Date.now(),
      ...form,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem("landPrepTasks", JSON.stringify(updated));

    setSuccessMessage(`Task "${form.taskName}" scheduled successfully!`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    setForm(initialForm);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem("landPrepTasks", JSON.stringify(updated));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6 md:p-10">
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top">
          <div className="bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 border-l-4 border-emerald-600">
            <CheckCircle className="text-emerald-600 w-6 h-6" />
            <span className="font-semibold text-gray-800">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        {/* <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
            <Tractor className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Land Preparation</h1>
            <p className="text-gray-600 mt-1">Schedule and manage field preparation tasks</p>
          </div>
        </div> */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FORM SECTION */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-slate-200/50">
              {/* FIELD & SEASON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Field *
                  </label>
                  <select
                    name="field"
                    value={form.field}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  >
                    <option value="">Select field...</option>
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.farm_name} ({(f.area / 4046.86).toFixed(2)} acres)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Season *
                  </label>
                  <select
                    name="season"
                    value={form.season}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  >
                    <option value="">Select season...</option>
                    {seasonOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CROP & VARIETY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    Crop *
                  </label>
                  <select
                    name="crop"
                    value={form.crop}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  >
                    <option value="">Select crop...</option>
                    {Object.keys(CROP_DATABASE)
                      .filter(
                        (c) =>
                          form.season === "" ||
                          CROP_DATABASE[c].season.includes(form.season)
                      )
                      .map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                  </select>
                </div>

                {form.crop && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">
                      Variety *
                    </label>
                    <select
                      value={form.variety}
                      name="variety"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                    >
                      <option value="">Select variety</option>
                      {CROP_DATABASE[form.crop].varieties.map((variety) => (
                        <option key={variety} value={variety}>
                          {variety}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* PREPARATION & MACHINERY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Tractor className="w-4 h-4 text-emerald-600" />
                    Preparation Type *
                  </label>
                  <select
                    name="landPrepType"
                    value={form.landPrepType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  >
                    <option value="">Select type...</option>
                    {ALL_PREPARATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Tractor className="w-4 h-4 text-emerald-600" />
                    Machinery *
                  </label>
                  <select
                    name="machineryType"
                    value={form.machineryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  >
                    <option value="">Select machinery...</option>
                    {ALL_MACHINERY_TYPES.map((mach) => (
                      <option key={mach} value={mach}>
                        {mach}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* MACHINERY COUNT */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-8 border-2 border-emerald-200">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Number of {form.machineryType || "Machinery"} Units
                </label>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleMachineryCount(-1)}
                    className="p-2 bg-white border-2 border-emerald-400 rounded-lg hover:bg-emerald-100 transition"
                  >
                    <Minus className="w-5 h-5 text-emerald-600" />
                  </button>
                  <div className="text-4xl font-bold text-emerald-600 min-w-20 text-center">
                    {form.machineryCount}
                  </div>
                  <button
                    onClick={() => handleMachineryCount(1)}
                    className="p-2 bg-white border-2 border-emerald-400 rounded-lg hover:bg-emerald-100 transition"
                  >
                    <Plus className="w-5 h-5 text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* FERTILIZER */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Select Fertilizer
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FERTILIZER_OPTIONS.map((fert) => (
                    <label key={fert} className="flex items-center gap-2 cursor-pointer p-3 border-2 border-slate-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition">
                      <input
                        type="radio"
                        name="fertilizer"
                        value={fert}
                        checked={form.fertilizer === fert}
                        onChange={handleChange}
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <span className="text-sm text-gray-700">{fert}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* FERTILIZER QUANTITY */}
              {form.fertilizer && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Fertilizer Quantity (kg)
                  </label>
                  <input
                    type="number"
                    name="fertiliserQuantity"
                    value={form.fertiliserQuantity}
                    onChange={handleChange}
                    placeholder="Enter quantity in kg"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  />
                </div>
              )}

              {/* ADDITIONAL INPUTS */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Additional Inputs
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {INPUT_OPTIONS.map((input) => (
                    <label key={input} className="flex items-center gap-2 cursor-pointer p-3 border-2 border-slate-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition">
                      <input
                        type="checkbox"
                        checked={form.additionalInputs.includes(input)}
                        onChange={() => handleAdditionalInputToggle(input)}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{input}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DATES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    min={form.startDate || today}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  />
                </div>
              </div>
                <div className="w-full">
                   <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Plus className="w-6 h-6 text-emerald-600" />
                New Preparation Task
              </h2>
              {/* TASK NAME & DESCRIPTION */}
              <div className="gap-6 mb-8 pb-8 border-b border-slate-200">
                <div className="w-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    name="taskName"
                    value={form.taskName}
                    onChange={handleChange}
                    placeholder="e.g., Field A Summer Ploughing"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  />
                </div>
                <div className="w-full mt-3">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Task Description
                  </label>
                  <textarea
                    name="taskDescription"
                    value={form.taskDescription}
                    onChange={handleChange}
                    placeholder="Add notes or additional details..."
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none resize-none"
                  />
                </div>
              </div>
                </div>

              {/* SUBMIT BUTTON */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Schedule Task
              </button>
            </div>
          </div>

          {/* TASKS PANEL */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-200/50 sticky top-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-6">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                Tasks ({tasks.length})
              </h3>

              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No tasks scheduled yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border-2 border-emerald-200 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-emerald-800 text-sm">
                          {task.taskName}
                        </h4>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:bg-red-100 p-1.5 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-gray-700 space-y-1.5">
                        <p className="font-semibold text-emerald-900">
                          {task.crop} ({task.variety})
                        </p>
                        <p className="flex items-center gap-1">
                          <Tractor className="w-3 h-3 text-emerald-600" />
                          {task.landPrepType}
                        </p>
                        <p className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-emerald-600" />
                          {task.machineryCount}x {task.machineryType}
                        </p>
                        {task.fertilizer && (
                          <p className="flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-emerald-600" />
                            {task.fertilizer} ({task.fertiliserQuantity}kg)
                          </p>
                        )}
                        {task.additionalInputs.length > 0 && (
                          <p className="text-emerald-600 text-xs">
                            Inputs: {task.additionalInputs.join(", ")}
                          </p>
                        )}
                        {task.startDate && (
                          <p className="text-emerald-600 font-semibold text-xs">
                            {task.startDate} → {task.endDate}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
