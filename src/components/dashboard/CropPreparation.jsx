import React, { useState, useEffect } from "react";
import { Calendar, Leaf, Plus, Trash2, Table, Download, Edit2, Send, History, Eye } from "lucide-react";

const CropPreparation = () => {
  const [view, setView] = useState("home");
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCrops, setSelectedCrops] = useState([
    { id: 1, cropType: "", area: 0 },
  ]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyForPlan, setHistoryForPlan] = useState(null);

  // Crop Database
  const CROP_TYPES = {
    Wheat: {
      botanicalName: "Triticum aestivum",
      season: "Rabi",
      daysToMaturity: 120,
      totalAcres: 668,
      costPerAcre: {
        land_prep: 9800,
        seed: 5500,
        seed_treatment: 600,
        sowing_charges: 2000,
        irrigation: 14400,
        fertilizers: 36850,
        crop_protection: 3600,
        harvesting_tpt: 6060,
        total_cost_of_production: 78810,
      },
    },
    "Raya (Mustard)": {
      botanicalName: "Brassica juncea",
      season: "Rabi",
      daysToMaturity: 90,
      totalAcres: 447,
      costPerAcre: {
        land_prep: 10920,
        seed: 3600,
        seed_treatment: 0,
        sowing_charges: 0,
        irrigation: 10000,
        fertilizers: 20250,
        crop_protection: 3600,
        harvesting_tpt: 7500,
        total_cost_of_production: 55870,
      },
    },
    "Rhodes Grass": {
      botanicalName: "Chloris gayana",
      season: "Rabi",
      daysToMaturity: 75,
      totalAcres: 692,
      costPerAcre: {
        land_prep: 4760,
        seed: 20000,
        seed_treatment: 0,
        sowing_charges: 1500,
        irrigation: 32000,
        fertilizers: 45100,
        crop_protection: 2000,
        harvesting_tpt: 0,
        total_cost_of_production: 105360,
      },
    },
    // Adding Kharif season crops
    "Rice (Paddy)": {
      botanicalName: "Oryza sativa",
      season: "Kharif",
      daysToMaturity: 150,
      totalAcres: 500,
      costPerAcre: {
        land_prep: 12000,
        seed: 7000,
        seed_treatment: 800,
        sowing_charges: 2500,
        irrigation: 18000,
        fertilizers: 42000,
        crop_protection: 4500,
        harvesting_tpt: 8000,
        total_cost_of_production: 96800,
      },
    },
    "Cotton": {
      botanicalName: "Gossypium hirsutum",
      season: "Kharif",
      daysToMaturity: 180,
      totalAcres: 600,
      costPerAcre: {
        land_prep: 11000,
        seed: 8000,
        seed_treatment: 1000,
        sowing_charges: 3000,
        irrigation: 15000,
        fertilizers: 38000,
        crop_protection: 6000,
        harvesting_tpt: 9000,
        total_cost_of_production: 92000,
      },
    },
    "Sugarcane": {
      botanicalName: "Saccharum officinarum",
      season: "Kharif",
      daysToMaturity: 365,
      totalAcres: 400,
      costPerAcre: {
        land_prep: 15000,
        seed: 12000,
        seed_treatment: 0,
        sowing_charges: 4000,
        irrigation: 25000,
        fertilizers: 50000,
        crop_protection: 3000,
        harvesting_tpt: 12000,
        total_cost_of_production: 121000,
      },
    },
  };

  const SEASONS = ["Kharif", "Rabi"];
  const YEARS = [
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
    "2029-2030",
  ];

  const getAvailableCrops = () => {
    if (!selectedSeason) return [];
    return Object.keys(CROP_TYPES).filter(
      (crop) => CROP_TYPES[crop].season === selectedSeason
    );
  };

  useEffect(() => {
    setValidationErrors([]);
  }, [selectedCrops]);

  useEffect(() => {
    const savedPlans = localStorage.getItem("cropPlans");
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem("cropPlans", JSON.stringify(plans));
    }
  }, [plans]);

  const handleCropChange = (index, field, value) => {
    const updatedCrops = [...selectedCrops];

    if (field === "area") {
      const cropType = updatedCrops[index].cropType;
      if (cropType && CROP_TYPES[cropType]) {
        const maxAcres = CROP_TYPES[cropType].totalAcres;
        const numValue = Number(value);
        if (numValue > maxAcres) {
          alert(`Cannot exceed maximum ${maxAcres} acres for ${cropType}`);
          return;
        }
      }
    }

    updatedCrops[index] = { ...updatedCrops[index], [field]: value };
    setSelectedCrops(updatedCrops);
    setValidationErrors((prev) =>
      prev.filter((error) => !error.includes(`Crop ${index + 1}`))
    );
  };

  const addCropRow = () => {
    if (selectedCrops.length >= 10) {
      alert("Maximum 10 crops allowed");
      return;
    }

    const newId =
      selectedCrops.length > 0
        ? Math.max(...selectedCrops.map((c) => c.id)) + 1
        : 1;
    setSelectedCrops([
      ...selectedCrops,
      {
        id: newId,
        cropType: "",
        area: 0,
      },
    ]);
  };

  const removeCropRow = (index) => {
    if (selectedCrops.length <= 1) {
      alert("At least one crop must be selected");
      return;
    }

    const updatedCrops = selectedCrops.filter((_, i) => i !== index);
    setSelectedCrops(updatedCrops);
  };

  const validateForm = () => {
    const errors = [];

    if (!selectedSeason) {
      errors.push("Please select a season");
    }

    if (!selectedYear) {
      errors.push("Please select a year");
    }

    if (selectedCrops.filter((c) => c.cropType).length < 3) {
      errors.push("Please select at least 3 crops to view the table");
    }

    selectedCrops.forEach((crop, index) => {
      if (crop.cropType) {
        if (!crop.area || crop.area <= 0) {
          errors.push(
            `Crop ${index + 1}: Please enter a valid area (greater than 0)`
          );
        }
        const cropData = CROP_TYPES[crop.cropType];
        if (cropData && crop.area > cropData.totalAcres) {
          errors.push(
            `Crop ${index + 1}: Area cannot exceed ${cropData.totalAcres} acres`
          );
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleViewTable = () => {
    if (validateForm()) {
      setView("table");
    } else {
      alert(
        `Please fix the following errors:\n\n${validationErrors.join("\n")}`
      );
    }
  };

  const savePlan = () => {
    if (!validateForm()) {
      alert(
        `Please fix the following errors:\n\n${validationErrors.join("\n")}`
      );
      return;
    }

    // Check if plan already exists for this season and year (only when not editing)
    if (!editingPlanId) {
      const existingPlan = plans.find(
        (p) => p.season === selectedSeason && p.year === selectedYear
      );
      if (existingPlan) {
        alert(
          `A plan already exists for ${selectedSeason} ${selectedYear}. Please edit the existing plan or choose a different season/year.`
        );
        return;
      }
    }

    const planData = {
      id: editingPlanId || Date.now(),
      name: `${selectedSeason} ${selectedYear}`,
      season: selectedSeason,
      year: selectedYear,
      crops: selectedCrops.filter((c) => c.cropType && c.area > 0).slice(0, 3),
      status: "draft",
      createdAt: editingPlanId
        ? plans.find((p) => p.id === editingPlanId)?.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        ...(editingPlanId
          ? plans.find((p) => p.id === editingPlanId)?.history || []
          : []),
        {
          timestamp: new Date().toISOString(),
          crops: selectedCrops.filter((c) => c.cropType && c.area > 0).slice(0, 3),
          action: editingPlanId ? "updated" : "created",
          user: "Farm Manager",
        },
      ],
    };

    if (editingPlanId) {
      setPlans(plans.map((p) => (p.id === editingPlanId ? planData : p)));
    } else {
      setPlans([...plans, planData]);
    }

    // Reset form and go to home
    setView("home");
    setSelectedSeason("");
    setSelectedYear("");
    setSelectedCrops([{ id: 1, cropType: "", area: 0 }]);
    setValidationErrors([]);
    setCurrentPlan(null);
    setEditingPlanId(null);

    alert("Plan saved successfully as draft!");
  };

  const sendForApproval = (planId) => {
    if (window.confirm("Are you sure you want to send this plan for approval?")) {
      setPlans(
        plans.map((p) => {
          if (p.id === planId) {
            const updatedPlan = {
              ...p,
              status: "pending_approval",
              submittedAt: new Date().toISOString(),
              history: [
                ...(p.history || []),
                {
                  timestamp: new Date().toISOString(),
                  action: "sent_for_approval",
                  user: "Farm Manager",
                },
              ],
            };
            return updatedPlan;
          }
          return p;
        })
      );
      alert("Plan sent for approval!");
    }
  };

  const startNewPlan = () => {
    setSelectedSeason("");
    setSelectedYear("");
    setSelectedCrops([{ id: 1, cropType: "", area: 0 }]);
    setValidationErrors([]);
    setCurrentPlan(null);
    setEditingPlanId(null);
    setView("planning");
  };

  const viewPlan = (plan) => {
    setCurrentPlan(plan);
    setSelectedSeason(plan.season);
    setSelectedYear(plan.year);
    setSelectedCrops(plan.crops);
    setView("table");
  };

  const editPlan = (plan) => {
    if (plan.status === "pending_approval") {
      alert("Cannot edit a plan that is pending approval. Please wait for approval or rejection.");
      return;
    }

    if (plan.status === "approved") {
      alert("Approved plans cannot be edited. Please create a new plan for changes.");
      return;
    }

    setSelectedSeason(plan.season);
    setSelectedYear(plan.year);
    setSelectedCrops(plan.crops);
    setEditingPlanId(plan.id);
    setCurrentPlan(plan);
    setView("planning");
  };

  const deletePlan = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (plan.status === "pending_approval") {
      alert("Cannot delete a plan that is pending approval.");
      return;
    }

    if (plan.status === "approved") {
      alert("Cannot delete an approved plan.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter((p) => p.id !== planId));
    }
  };

  const approvePlan = (planId) => {
    setPlans(
      plans.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            status: "approved",
            approvedAt: new Date().toISOString(),
            history: [
              ...(p.history || []),
              {
                timestamp: new Date().toISOString(),
                action: "approved",
                user: "Approver",
              },
            ],
          };
        }
        return p;
      })
    );
    alert("Plan approved successfully!");
  };

  const rejectPlan = (planId) => {
    setPlans(
      plans.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            status: "rejected",
            rejectedAt: new Date().toISOString(),
            history: [
              ...(p.history || []),
              {
                timestamp: new Date().toISOString(),
                action: "rejected",
                user: "Approver",
                reason: "Plan requires modifications",
              },
            ],
          };
        }
        return p;
      })
    );
    alert("Plan rejected. You can now edit and resubmit.");
  };

  const viewPlanHistory = (plan) => {
    setHistoryForPlan(plan);
    setShowHistory(true);
  };

  const closeHistory = () => {
    setShowHistory(false);
    setHistoryForPlan(null);
  };

  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  const exportToCSV = () => {
    const tableCrops = selectedCrops.filter((c) => c.cropType).slice(0, 3);

    if (tableCrops.length < 3) {
      alert("Need at least 3 crops to export");
      return;
    }

    const headers = [
      "",
      tableCrops[0].cropType,
      tableCrops[1].cropType,
      tableCrops[2].cropType,
    ];
    const rows = [
      [
        `${selectedSeason} ${selectedYear}`,
        `${tableCrops[0].area || 0} Acre | ${
          CROP_TYPES[tableCrops[0].cropType]?.totalAcres || 0
        }`,
        `${tableCrops[1].area || 0} Acre | ${
          CROP_TYPES[tableCrops[1].cropType]?.totalAcres || 0
        }`,
        `${tableCrops[2].area || 0} Acre | ${
          CROP_TYPES[tableCrops[2].cropType]?.totalAcres || 0
        }`,
      ],
      // ... (rest of the exportToCSV function remains the same)
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => (csvContent += row.join(",") + "\n"));

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `crop_comparison_${selectedSeason}_${selectedYear}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCropComplete = (crop) => {
    return crop.cropType && crop.area > 0;
  };

  const getTableCrops = () => {
    return selectedCrops.filter((c) => c.cropType).slice(0, 3);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase">Draft</span>;
      case 'pending_approval':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Pending</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* History Modal */}
        {showHistory && historyForPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-6 h-6 text-blue-600" />
                    Plan History - {historyForPlan.name}
                  </h2>
                  <button
                    onClick={closeHistory}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-slate-600 mt-1">
                  Track all changes made to this plan
                </p>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-4">
                  {historyForPlan.history && historyForPlan.history.length > 0 ? (
                    historyForPlan.history.map((historyItem, index) => (
                      <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded-full ${
                                historyItem.action === "created"
                                  ? "bg-green-100 text-green-700"
                                  : historyItem.action === "updated"
                                  ? "bg-blue-100 text-blue-700"
                                  : historyItem.action === "sent_for_approval"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : historyItem.action === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : historyItem.action === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {historyItem.action
                                .replace(/_/g, " ")
                                .toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-600">
                              by {historyItem.user || "Unknown"}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(historyItem.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {historyItem.crops && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-slate-700 mb-2">
                              Crop Details:
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {historyItem.crops.map((crop, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-50 rounded p-3"
                                >
                                  <div className="font-medium text-slate-900">
                                    {crop.cropType}
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    {crop.area} acres
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    Cost: Rs.{" "}
                                    {formatNumber(
                                      (CROP_TYPES[crop.cropType]?.costPerAcre
                                        .total_cost_of_production || 0) * crop.area
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {historyItem.reason && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            <span className="font-medium">Reason: </span>
                            {historyItem.reason}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No history available for this plan
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={closeHistory}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Close History
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOME VIEW */}
        {view === "home" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                My Crop Plans
              </h2>
              <button
                onClick={startNewPlan}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add New Plan
              </button>
            </div>

            {plans.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
                <Leaf className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No Plans Yet
                </h3>
                <p className="text-slate-600 mb-6">
                  Create your first crop plan to get started
                </p>
                <button
                  onClick={startNewPlan}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-xl border-2 border-slate-200 shadow-lg hover:shadow-xl transition overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-emerald-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {plan.name}
                          </h3>
                          <p className="text-white text-opacity-90 text-sm">
                            Created: {new Date(plan.createdAt).toLocaleDateString()}
                          </p>
                          {plan.submittedAt && (
                            <p className="text-white text-opacity-90 text-sm">
                              Submitted: {new Date(plan.submittedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(plan.status)}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        {plan.crops.map((crop, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-slate-200 rounded-lg p-3 bg-slate-50"
                          >
                            <div className="font-bold text-slate-900">
                              {crop.cropType}
                            </div>
                            <div className="text-sm text-slate-600">
                              {crop.area} acres
                            </div>
                            <div className="text-xs text-emerald-600 font-medium mt-1">
                              Cost: Rs.{" "}
                              {formatNumber(
                                (CROP_TYPES[crop.cropType]?.costPerAcre
                                  .total_cost_of_production || 0) * crop.area
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => viewPlan(plan)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        
                        <button
                          onClick={() => viewPlanHistory(plan)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center gap-2"
                          title="View History"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        
                        {(plan.status === "draft" || plan.status === "rejected") && (
                          <button
                            onClick={() => editPlan(plan)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2"
                            title="Edit Plan"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(plan.status === "draft" || plan.status === "rejected") && (
                          <button
                            onClick={() => sendForApproval(plan.id)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium flex items-center gap-2"
                            title="Send for Approval"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(plan.status === "draft" || plan.status === "rejected") && (
                          <button
                            onClick={() => deletePlan(plan.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Approve/Reject buttons for pending plans */}
                      {plan.status === "pending_approval" && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => approvePlan(plan.id)}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectPlan(plan.id)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && view === "planning" && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-bold text-red-800 mb-2">
              Please fix the following errors:
            </h3>
            <ul className="list-disc pl-5 text-red-700">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* PLANNING VIEW */}
        {view === "planning" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-600" />
                {editingPlanId ? "Edit Crop Plan" : "Create New Crop Plan"}
              </h2>

              {/* Season and Year Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Season *
                  </label>
                  <select
                    value={selectedSeason}
                    onChange={(e) => {
                      setSelectedSeason(e.target.value);
                      setSelectedCrops([{ id: 1, cropType: "", area: 0 }]);
                    }}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-lg font-medium"
                    disabled={editingPlanId}
                  >
                    <option value="">Select Season</option>
                    {SEASONS.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Year *
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-lg font-medium"
                    disabled={editingPlanId}
                  >
                    <option value="">Select Year</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedSeason && selectedYear && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      Crop Selection - {selectedSeason} {selectedYear}
                    </h3>
                    <div className="text-sm text-slate-700">
                      Selected:{" "}
                      <span className="font-bold">
                        {selectedCrops.filter((c) => c.cropType).length} / 3
                      </span>{" "}
                      crops
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedCrops.map((crop, index) => (
                      <div
                        key={crop.id}
                        className={`border-4 rounded-xl p-6 bg-gradient-to-r from-slate-50 to-white ${
                          isCropComplete(crop)
                            ? "border-emerald-400 shadow-lg"
                            : "border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-900">
                              Crop #{index + 1}
                            </h3>
                            {isCropComplete(crop) && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                                ✓ Complete
                              </span>
                            )}
                          </div>
                          {selectedCrops.length > 1 && (
                            <button
                              onClick={() => removeCropRow(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Crop Type *
                            </label>
                            <select
                              value={crop.cropType}
                              onChange={(e) =>
                                handleCropChange(
                                  index,
                                  "cropType",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                              disabled={!selectedSeason}
                            >
                              <option value="">Select crop</option>
                              {getAvailableCrops().map((cropName) => (
                                <option key={cropName} value={cropName}>
                                  {cropName}
                                </option>
                              ))}
                            </select>
                            {!selectedSeason && (
                              <p className="text-xs text-red-600 mt-1">
                                Please select a season first
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Area (acres) *
                              <span className="text-xs font-normal text-slate-500 ml-2">
                                Max:{" "}
                                {crop.cropType && CROP_TYPES[crop.cropType]
                                  ? CROP_TYPES[
                                      crop.cropType
                                    ].totalAcres.toLocaleString()
                                  : "N/A"}
                              </span>
                            </label>
                            <input
                              type="number"
                              value={crop.area}
                              onChange={(e) =>
                                handleCropChange(index, "area", e.target.value)
                              }
                              min="0"
                              max={
                                crop.cropType && CROP_TYPES[crop.cropType]
                                  ? CROP_TYPES[crop.cropType].totalAcres
                                  : 1000
                              }
                              step="0.1"
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                              placeholder="Enter area in acres"
                            />
                            <div className="text-xs text-slate-500 mt-1">
                              Used: {Number(crop.area) || 0} acres
                            </div>
                          </div>
                        </div>

                        {crop.cropType && CROP_TYPES[crop.cropType] && (
                          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-slate-600 text-xs">
                                  Total Cost per Acre
                                </p>
                                <p className="font-medium text-slate-900">
                                  Rs.{" "}
                                  {formatNumber(
                                    CROP_TYPES[crop.cropType].costPerAcre
                                      .total_cost_of_production
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-xs">
                                  Total Acres Available
                                </p>
                                <p className="font-medium text-slate-900">
                                  {formatNumber(
                                    CROP_TYPES[crop.cropType].totalAcres
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-xs">
                                  Days to Maturity
                                </p>
                                <p className="font-medium text-slate-900">
                                  {CROP_TYPES[crop.cropType].daysToMaturity}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {selectedCrops.length < 10 && (
                      <button
                        onClick={addCropRow}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition flex items-center justify-center gap-3"
                      >
                        <Plus className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium text-emerald-600">
                          Add Another Crop
                        </span>
                        <span className="text-sm text-slate-500">
                          (Max 10 crops)
                        </span>
                      </button>
                    )}

                    <div className="bg-slate-100 rounded-xl p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <p className="text-slate-600 text-sm mb-1">
                            Crops Selected
                          </p>
                          <p className="text-2xl font-bold text-slate-900">
                            {selectedCrops.filter((c) => c.cropType).length} / 3
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <p className="text-slate-600 text-sm mb-1">
                            Total Area
                          </p>
                          <p className="text-2xl font-bold text-slate-900">
                            {selectedCrops
                              .reduce(
                                (sum, crop) => sum + (Number(crop.area) || 0),
                                0
                              )
                              .toFixed(1)}{" "}
                            acres
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={() => setView("home")}
                className="px-6 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleViewTable}
                disabled={
                  !selectedSeason ||
                  !selectedYear ||
                  selectedCrops.filter((c) => c.cropType).length < 3
                }
                className={`px-8 py-3 rounded-lg transition font-medium flex items-center gap-3 text-lg ${
                  selectedSeason &&
                  selectedYear &&
                  selectedCrops.filter((c) => c.cropType).length >= 3
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Table className="w-6 h-6" />
                Preview Table
              </button>
            </div>
          </div>
        )}

        {/* TABLE VIEW */}
        {view === "table" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Crop Cost Comparison - {selectedSeason} {selectedYear}
                </h2>
                <p className="text-slate-600">
                  Per Acre vs Total Cost Analysis (First 3 selected crops)
                </p>
                {currentPlan && (
                  <div className="mt-2">
                    {getStatusBadge(currentPlan.status)}
                    {currentPlan.history && currentPlan.history.length > 0 && (
                      <button
                        onClick={() => viewPlanHistory(currentPlan)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                      >
                        <History className="w-4 h-4" />
                        View Plan History ({currentPlan.history.length} entries)
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium flex items-center gap-2 text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                
                {(!currentPlan || currentPlan.status === "draft" || currentPlan.status === "rejected") && (
                  <button
                    onClick={() => setView("planning")}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Plan
                  </button>
                )}
                
                {(!currentPlan || currentPlan.status === "draft" || currentPlan.status === "rejected") && (
                  <button
                    onClick={savePlan}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-lg"
                  >
                    Save Plan
                  </button>
                )}
                
                <button
                  onClick={() => setView("home")}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  View All Plans
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"></th>
                    {getTableCrops().map((crop, index) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider"
                        colSpan="2"
                      >
                        {crop.cropType}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  <tr className="bg-slate-100">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {selectedSeason} {selectedYear}
                    </td>
                    {getTableCrops().map((crop, index) => (
                      <td
                        key={index}
                        className="px-6 py-4 text-center"
                        colSpan="2"
                      >
                        <div className="font-bold text-slate-900">
                          {crop.area || 0} Acre
                        </div>
                        <div className="text-xs text-slate-600">
                          of{" "}
                          {formatNumber(
                            CROP_TYPES[crop.cropType]?.totalAcres || 0
                          )}{" "}
                          acres
                        </div>
                      </td>
                    ))}
                  </tr>

                  {[
                    { key: "land_prep", label: "Land Prep" },
                    { key: "seed", label: "Seed" },
                    { key: "seed_treatment", label: "Seed Treatment" },
                    { key: "sowing_charges", label: "Sowing Charges" },
                    { key: "irrigation", label: "Irrigation" },
                    { key: "fertilizers", label: "Fertilizers" },
                    { key: "crop_protection", label: "Crop Protection" },
                    { key: "harvesting_tpt", label: "Harvesting & TPT" },
                  ].map((item) => (
                    <tr key={item.key} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.label}
                      </td>
                      {getTableCrops().map((crop, cropIndex) => {
                        const cropData = CROP_TYPES[crop.cropType];
                        const perAcre = cropData
                          ? cropData.costPerAcre[item.key] || 0
                          : 0;
                        const total = perAcre * (Number(crop.area) || 0);

                        return (
                          <React.Fragment key={cropIndex}>
                            <td className="px-6 py-4 text-right border-r border-slate-200">
                              <div className="font-medium text-slate-900">
                                {formatNumber(perAcre)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="font-bold text-slate-900">
                                {formatNumber(total)}
                              </div>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}

                  <tr className="bg-emerald-50 font-bold">
                    <td className="px-6 py-4 text-slate-900">
                      Total Cost of Production
                    </td>
                    {getTableCrops().map((crop, cropIndex) => {
                      const cropData = CROP_TYPES[crop.cropType];
                      const perAcre = cropData
                        ? cropData.costPerAcre.total_cost_of_production
                        : 0;
                      const total = perAcre * (Number(crop.area) || 0);

                      return (
                        <React.Fragment key={cropIndex}>
                          <td className="px-6 py-4 text-right border-r border-emerald-200">
                            <div className="text-slate-900">
                              {formatNumber(perAcre)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-emerald-700">
                              {formatNumber(total)}
                            </div>
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-sm text-slate-500 italic">
              <p>
                Note: Showing first 3 selected crops. All costs are in Pakistani
                Rupees (Rs.). Per acre costs shown in left column, total costs
                in right column for each crop.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPreparation;