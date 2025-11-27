"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  LandPlot,
  User,
  Calendar,
  Edit3,
  Save,
  X,
  Plus,
  Download,
  Upload,
} from "lucide-react";

const AllocationPage = () => {
  // Mock data for farms
  const [farms] = useState([
    { id: 1, name: "Chappu", code: "FARM-001", area: "50", unit: "hectares", status: "Active" },
    { id: 2, name: "Qasim Wala ", code: "FARM-002", area: "75", unit: "hectares", status: "Active" },
    { id: 3, name: "Garhi Yasin", code: "FARM-003", area: "120", unit: "hectares", status: "Active" },
    { id: 3, name: "Dah Mot", code: "FARM-003", area: "120", unit: "hectares", status: "Active" },
  ]);

  // Mock data for managers
  const [managers] = useState([
    { id: 1, name: "John Smith", email: "john.smith@company.com", department: "Agriculture", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@company.com", department: "Operations", status: "Active" },
    { id: 3, name: "Mike Chen", email: "mike.chen@company.com", department: "Agriculture", status: "Active" },
  ]);

  // Allocation form state
  const [allocationForm, setAllocationForm] = useState({
    farmId: "",
    managerId: "",
    startDate: "",
    endDate: "",
    notes: ""
  });

  // Existing allocations state
  const [allocations, setAllocations] = useState([
    {
      id: 1,
      farmId: 1,
      managerId: 1,
      farmName: "Chappu",
      managerName: "Muhammad Adrees",
      startDate: "2023-01-15",
      endDate: "2024-01-14",
      status: "Active",
      allocatedBy: "Farm Man",
      allocationDate: "2023-01-10",
      notes: "Initial allocation"
    }
  ]);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Handle allocation form submission
  const handleAllocate = (e) => {
    e.preventDefault();
    
    if (!allocationForm.farmId || !allocationForm.managerId || !allocationForm.startDate) {
      alert("Please fill in all required fields");
      return;
    }

    const selectedFarm = farms.find(farm => farm.id === parseInt(allocationForm.farmId));
    const selectedManager = managers.find(manager => manager.id === parseInt(allocationForm.managerId));

    const newAllocation = {
      id: Date.now(),
      farmId: parseInt(allocationForm.farmId),
      managerId: parseInt(allocationForm.managerId),
      farmName: selectedFarm.name,
      managerName: selectedManager.name,
      startDate: allocationForm.startDate,
      endDate: allocationForm.endDate || null,
      status: "Active",
      allocatedBy: "Current User",
      allocationDate: new Date().toISOString().split('T')[0],
      notes: allocationForm.notes
    };

    setAllocations([newAllocation, ...allocations]);
    
    // Reset form
    setAllocationForm({
      farmId: "",
      managerId: "",
      startDate: "",
      endDate: "",
      notes: ""
    });

    alert("Farm allocated successfully!");
  };

  // Start editing an allocation
  const startEditing = (allocation) => {
    setEditingId(allocation.id);
    setEditForm({
      managerId: allocation.managerId,
      startDate: allocation.startDate,
      endDate: allocation.endDate || "",
      status: allocation.status,
      notes: allocation.notes
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Save edited allocation
  const saveEdit = (allocationId) => {
    const selectedManager = managers.find(manager => manager.id === parseInt(editForm.managerId));
    
    setAllocations(allocations.map(allocation => 
      allocation.id === allocationId 
        ? { 
            ...allocation, 
            managerId: parseInt(editForm.managerId),
            managerName: selectedManager.name,
            startDate: editForm.startDate,
            endDate: editForm.endDate || null,
            status: editForm.status,
            notes: editForm.notes
          }
        : allocation
    ));
    
    setEditingId(null);
    setEditForm({});
    alert("Allocation updated successfully!");
  };

  // Delete an allocation
  const deleteAllocation = (allocationId) => {
    if (window.confirm("Are you sure you want to delete this allocation?")) {
      setAllocations(allocations.filter(allocation => allocation.id !== allocationId));
      alert("Allocation deleted successfully!");
    }
  };

  // Get active farms (not currently allocated)
  const getAvailableFarms = () => {
    const allocatedFarmIds = allocations
      .filter(allocation => allocation.status === "Active")
      .map(allocation => allocation.farmId);
    
    return farms.filter(farm => 
      farm.status === "Active" && !allocatedFarmIds.includes(farm.id)
    );
  };

  // Get active managers
  const getActiveManagers = () => {
    return managers.filter(manager => manager.status === "Active");
  };

  // Filter allocations based on search and filter
  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = 
      allocation.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || allocation.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Sites Allocation Management
              </h1>
              <p className="text-gray-600 text-lg">
                Allocate sites to managers and manage existing allocations
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl">
                <Download className="w-5 h-5" />
                Export Report
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl">
                <Upload className="w-5 h-5" />
                Import Data
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Allocation Form */}
          <div className="xl:col-span-1 space-y-8">
            {/* Allocation Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Allocate New Sites</h2>
              </div>

              <form onSubmit={handleAllocate} className="space-y-6">
                {/* Farm Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Sites <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={allocationForm.farmId}
                    onChange={(e) => setAllocationForm({...allocationForm, farmId: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
                    required
                  >
                    <option value="">Choose a site...</option>
                    {getAvailableFarms().map(farm => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name} ({farm.code}) - {farm.area} {farm.unit}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {getAvailableFarms().length} available farms
                  </p>
                </div>

                {/* Manager Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Manager <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={allocationForm.managerId}
                    onChange={(e) => setAllocationForm({...allocationForm, managerId: e.target.value})}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
                    required
                  >
                    <option value="">Choose a manager...</option>
                    {getActiveManagers().map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} - {manager.department}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={allocationForm.startDate}
                      onChange={(e) => setAllocationForm({...allocationForm, startDate: e.target.value})}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={allocationForm.endDate}
                      onChange={(e) => setAllocationForm({...allocationForm, endDate: e.target.value})}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={allocationForm.notes}
                    onChange={(e) => setAllocationForm({...allocationForm, notes: e.target.value})}
                    rows={3}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium resize-none"
                    placeholder="Additional notes about this allocation..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Allocate Site
                </button>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Allocation Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{allocations.length}</div>
                  <div className="text-sm text-blue-600 font-medium">Total Allocations</div>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
                  <div className="text-2xl font-bold text-green-600">
                    {allocations.filter(a => a.status === "Active").length}
                  </div>
                  <div className="text-sm text-green-600 font-medium">Active</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">
                    {getAvailableFarms().length}
                  </div>
                  <div className="text-sm text-orange-600 font-medium">Available Farms</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">
                    {getActiveManagers().length}
                  </div>
                  <div className="text-sm text-purple-600 font-medium">Active Managers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Allocations Table */}
          <div className="xl:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
              {/* Table Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Existing Allocations</h2>
                  <p className="text-gray-600">Manage and track farm allocations to managers</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search allocations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Allocations Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">Site</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Manager</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Period</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Allocated By</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAllocations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center p-8 text-gray-500">
                          <LandPlot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-lg font-medium">No allocations found</p>
                          <p className="text-sm">Try adjusting your search or create a new allocation</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAllocations.map((allocation) => (
                        <tr key={allocation.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                          {/* Farm */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-xl">
                                <LandPlot className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">{allocation.farmName}</div>
                                <div className="text-sm text-gray-500">{allocation.startDate}</div>
                              </div>
                            </div>
                          </td>

                          {/* Manager */}
                          <td className="p-4">
                            {editingId === allocation.id ? (
                              <select
                                value={editForm.managerId}
                                onChange={(e) => setEditForm({...editForm, managerId: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                {getActiveManagers().map(manager => (
                                  <option key={manager.id} value={manager.id}>
                                    {manager.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">{allocation.managerName}</div>
                                  <div className="text-sm text-gray-500">Manager</div>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Period */}
                          <td className="p-4">
                            {editingId === allocation.id ? (
                              <div className="space-y-2">
                                <input
                                  type="date"
                                  value={editForm.startDate}
                                  onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                <input
                                  type="date"
                                  value={editForm.endDate || ""}
                                  onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  placeholder="No end date"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div className="font-medium text-gray-800">{allocation.startDate}</div>
                                  <div className="text-gray-500">
                                    {allocation.endDate ? `to ${allocation.endDate}` : 'Ongoing'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {editingId === allocation.id ? (
                              <select
                                value={editForm.status}
                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                allocation.status === "Active" 
                                  ? "bg-green-100 text-green-800" 
                                  : allocation.status === "Completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {allocation.status}
                              </span>
                            )}
                          </td>

                          {/* Allocated By */}
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {allocation.allocatedBy}
                              <div className="text-xs text-gray-400">{allocation.allocationDate}</div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4">
                            {editingId === allocation.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(allocation.id)}
                                  className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEditing(allocation)}
                                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteAllocation(allocation.id)}
                                  className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredAllocations.length} of {allocations.length} allocations
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    Previous
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationPage;
// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   LandPlot,
//   User,
//   Calendar,
//   Edit3,
//   Save,
//   X,
//   Plus,
//   Filter,
//   Download,
//   Upload,
//   MoreVertical,
// } from "lucide-react";

// const AllocationPage = () => {
//   // Mock data for farms (in real app, this would come from API)
//   const [farms, setFarms] = useState([
//     { id: 1, name: "Green Valley Farm", code: "FARM-001", area: "50", unit: "hectares", status: "Active" },
//     { id: 2, name: "Sunrise Fields", code: "FARM-002", area: "75", unit: "hectares", status: "Active" },
//     { id: 3, name: "Riverbend Plantation", code: "FARM-003", area: "120", unit: "hectares", status: "Active" },
//     { id: 4, name: "Mountain View Estate", code: "FARM-004", area: "200", unit: "hectares", status: "Inactive" },
//     { id: 5, name: "Golden Harvest Farm", code: "FARM-005", area: "90", unit: "hectares", status: "Active" },
//   ]);

//   // Mock data for managers
//   const [managers, setManagers] = useState([
//     { id: 1, name: "John Smith", email: "john.smith@company.com", department: "Agriculture", status: "Active" },
//     { id: 2, name: "Sarah Johnson", email: "sarah.j@company.com", department: "Operations", status: "Active" },
//     { id: 3, name: "Mike Chen", email: "mike.chen@company.com", department: "Agriculture", status: "Active" },
//     { id: 4, name: "Emily Davis", email: "emily.davis@company.com", department: "Management", status: "Inactive" },
//     { id: 5, name: "Robert Wilson", email: "robert.w@company.com", department: "Operations", status: "Active" },
//   ]);

//   // Allocation form state
//   const [allocationForm, setAllocationForm] = useState({
//     farmId: "",
//     managerId: "",
//     startDate: "",
//     endDate: "",
//     notes: ""
//   });

//   // Existing allocations state
//   const [allocations, setAllocations] = useState([
//     {
//       id: 1,
//       farmId: 1,
//       managerId: 1,
//       farmName: "Green Valley Farm",
//       managerName: "John Smith",
//       startDate: "2023-01-15",
//       endDate: "2024-01-14",
//       status: "Active",
//       allocatedBy: "Admin User",
//       allocationDate: "2023-01-10",
//       notes: "Initial allocation"
//     },
//     {
//       id: 2,
//       farmId: 2,
//       managerId: 3,
//       farmName: "Sunrise Fields",
//       managerName: "Mike Chen",
//       startDate: "2023-03-01",
//       endDate: "2024-02-28",
//       status: "Active",
//       allocatedBy: "Admin User",
//       allocationDate: "2023-02-20",
//       notes: "Seasonal allocation"
//     },
//     {
//       id: 3,
//       farmId: 3,
//       managerId: 2,
//       farmName: "Riverbend Plantation",
//       managerName: "Sarah Johnson",
//       startDate: "2022-06-01",
//       endDate: "2023-05-31",
//       status: "Completed",
//       allocatedBy: "System Admin",
//       allocationDate: "2022-05-25",
//       notes: "Annual contract completed"
//     }
//   ]);

//   // Editing state
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");

//   // Filter allocations based on search and filter
//   const filteredAllocations = allocations.filter(allocation => {
//     const matchesSearch = 
//       allocation.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       allocation.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesFilter = statusFilter === "All" || allocation.status === statusFilter;
    
//     return matchesSearch && matchesFilter;
//   });

//   // Handle allocation form submission
//   const handleAllocate = (e) => {
//     e.preventDefault();
    
//     if (!allocationForm.farmId || !allocationForm.managerId || !allocationForm.startDate) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     const selectedFarm = farms.find(farm => farm.id === parseInt(allocationForm.farmId));
//     const selectedManager = managers.find(manager => manager.id === parseInt(allocationForm.managerId));

//     const newAllocation = {
//       id: allocations.length + 1,
//       farmId: parseInt(allocationForm.farmId),
//       managerId: parseInt(allocationForm.managerId),
//       farmName: selectedFarm.name,
//       managerName: selectedManager.name,
//       startDate: allocationForm.startDate,
//       endDate: allocationForm.endDate || null,
//       status: "Active",
//       allocatedBy: "Current User", // In real app, get from auth
//       allocationDate: new Date().toISOString().split('T')[0],
//       notes: allocationForm.notes
//     };

//     setAllocations([newAllocation, ...allocations]);
    
//     // Reset form
//     setAllocationForm({
//       farmId: "",
//       managerId: "",
//       startDate: "",
//       endDate: "",
//       notes: ""
//     });

//     alert("Farm allocated successfully!");
//   };

//   // Start editing an allocation
//   const startEditing = (allocation) => {
//     setEditingId(allocation.id);
//     setEditForm({
//       managerId: allocation.managerId,
//       startDate: allocation.startDate,
//       endDate: allocation.endDate || "",
//       status: allocation.status,
//       notes: allocation.notes
//     });
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditForm({});
//   };

//   // Save edited allocation
//   const saveEdit = (allocationId) => {
//     const selectedManager = managers.find(manager => manager.id === parseInt(editForm.managerId));
    
//     setAllocations(allocations.map(allocation => 
//       allocation.id === allocationId 
//         ? { 
//             ...allocation, 
//             managerId: parseInt(editForm.managerId),
//             managerName: selectedManager.name,
//             startDate: editForm.startDate,
//             endDate: editForm.endDate || null,
//             status: editForm.status,
//             notes: editForm.notes
//           }
//         : allocation
//     ));
    
//     setEditingId(null);
//     setEditForm({});
//     alert("Allocation updated successfully!");
//   };

//   // Delete an allocation
//   const deleteAllocation = (allocationId) => {
//     if (window.confirm("Are you sure you want to delete this allocation?")) {
//       setAllocations(allocations.filter(allocation => allocation.id !== allocationId));
//       alert("Allocation deleted successfully!");
//     }
//   };

//   // Get active farms (not currently allocated)
//   const getAvailableFarms = () => {
//     const allocatedFarmIds = allocations
//       .filter(allocation => allocation.status === "Active")
//       .map(allocation => allocation.farmId);
    
//     return farms.filter(farm => 
//       farm.status === "Active" && !allocatedFarmIds.includes(farm.id)
//     );
//   };

//   // Get active managers
//   const getActiveManagers = () => {
//     return managers.filter(manager => manager.status === "Active");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
//                 Farm Allocation Management
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 Allocate farms to managers and manage existing allocations
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl">
//                 <Download className="w-5 h-5" />
//                 Export Report
//               </button>
//               <button className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl">
//                 <Upload className="w-5 h-5" />
//                 Import Data
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Left Column - Allocation Form */}
//           <div className="xl:col-span-1 space-y-8">
//             {/* Allocation Form */}
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-green-100 rounded-xl">
//                   <Plus className="w-6 h-6 text-green-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800">Allocate New Farm</h2>
//               </div>

//               <form onSubmit={handleAllocate} className="space-y-6">
//                 {/* Farm Selection */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Select Farm <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={allocationForm.farmId}
//                     onChange={(e) => setAllocationForm({...allocationForm, farmId: e.target.value})}
//                     className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
//                     required
//                   >
//                     <option value="">Choose a farm...</option>
//                     {getAvailableFarms().map(farm => (
//                       <option key={farm.id} value={farm.id}>
//                         {farm.name} ({farm.code}) - {farm.area} {farm.unit}
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-2">
//                     {getAvailableFarms().length} available farms
//                   </p>
//                 </div>

//                 {/* Manager Selection */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Select Manager <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={allocationForm.managerId}
//                     onChange={(e) => setAllocationForm({...allocationForm, managerId: e.target.value})}
//                     className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
//                     required
//                   >
//                     <option value="">Choose a manager...</option>
//                     {getActiveManagers().map(manager => (
//                       <option key={manager.id} value={manager.id}>
//                         {manager.name} - {manager.department}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Date Range */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Start Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       value={allocationForm.startDate}
//                       onChange={(e) => setAllocationForm({...allocationForm, startDate: e.target.value})}
//                       className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={allocationForm.endDate}
//                       onChange={(e) => setAllocationForm({...allocationForm, endDate: e.target.value})}
//                       className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
//                     />
//                   </div>
//                 </div>

//                 {/* Notes */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Notes
//                   </label>
//                   <textarea
//                     value={allocationForm.notes}
//                     onChange={(e) => setAllocationForm({...allocationForm, notes: e.target.value})}
//                     rows={3}
//                     className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium resize-none"
//                     placeholder="Additional notes about this allocation..."
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   className="w-full py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
//                 >
//                   Allocate Farm
//                 </button>
//               </form>
//             </div>

//             {/* Quick Stats */}
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Allocation Overview</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
//                   <div className="text-2xl font-bold text-blue-600">{allocations.length}</div>
//                   <div className="text-sm text-blue-600 font-medium">Total Allocations</div>
//                 </div>
//                 <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
//                   <div className="text-2xl font-bold text-green-600">
//                     {allocations.filter(a => a.status === "Active").length}
//                   </div>
//                   <div className="text-sm text-green-600 font-medium">Active</div>
//                 </div>
//                 <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
//                   <div className="text-2xl font-bold text-orange-600">
//                     {getAvailableFarms().length}
//                   </div>
//                   <div className="text-sm text-orange-600 font-medium">Available Farms</div>
//                 </div>
//                 <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
//                   <div className="text-2xl font-bold text-purple-600">
//                     {getActiveManagers().length}
//                   </div>
//                   <div className="text-sm text-purple-600 font-medium">Active Managers</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Allocations Table */}
//           <div className="xl:col-span-2">
//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6">
//               {/* Table Header */}
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800 mb-2">Existing Allocations</h2>
//                   <p className="text-gray-600">Manage and track farm allocations to managers</p>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//                   {/* Search */}
//                   <div className="relative flex-1 sm:flex-none">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <input
//                       type="text"
//                       placeholder="Search allocations..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full sm:w-64 pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
//                     />
//                   </div>

//                   {/* Status Filter */}
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-medium"
//                   >
//                     <option value="All">All Status</option>
//                     <option value="Active">Active</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Cancelled">Cancelled</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Allocations Table */}
//               <div className="overflow-x-auto rounded-2xl border border-gray-200">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                       <th className="text-left p-4 font-semibold text-gray-700">Farm</th>
//                       <th className="text-left p-4 font-semibold text-gray-700">Manager</th>
//                       <th className="text-left p-4 font-semibold text-gray-700">Period</th>
//                       <th className="text-left p-4 font-semibold text-gray-700">Status</th>
//                       <th className="text-left p-4 font-semibold text-gray-700">Allocated By</th>
//                       <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredAllocations.length === 0 ? (
//                       <tr>
//                         <td colSpan="6" className="text-center p-8 text-gray-500">
//                           <LandPlot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                           <p className="text-lg font-medium">No allocations found</p>
//                           <p className="text-sm">Try adjusting your search or create a new allocation</p>
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredAllocations.map((allocation,index) => (
//                         <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
//                           {/* Farm */}
//                           <td className="p-4">
//                             <div className="flex items-center gap-3">
//                               <div className="p-2 bg-green-100 rounded-xl">
//                                 <LandPlot className="w-4 h-4 text-green-600" />
//                               </div>
//                               <div>
//                                 <div className="font-semibold text-gray-800">{allocation.farmName}</div>
//                                 <div className="text-sm text-gray-500">{allocation.startDate}</div>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Manager */}
//                           <td className="p-4">
//                             {editingId === allocation.id ? (
//                               <select
//                                 value={editForm.managerId}
//                                 onChange={(e) => setEditForm({...editForm, managerId: e.target.value})}
//                                 className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                               >
//                                 {getActiveManagers().map(manager => (
//                                   <option key={manager.id} value={manager.id}>
//                                     {manager.name}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-blue-100 rounded-xl">
//                                   <User className="w-4 h-4 text-blue-600" />
//                                 </div>
//                                 <div>
//                                   <div className="font-semibold text-gray-800">{allocation.managerName}</div>
//                                   <div className="text-sm text-gray-500">Manager</div>
//                                 </div>
//                               </div>
//                             )}
//                           </td>

//                           {/* Period */}
//                           <td className="p-4">
//                             {editingId === allocation.id ? (
//                               <div className="space-y-2">
//                                 <input
//                                   type="date"
//                                   value={editForm.startDate}
//                                   onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
//                                   className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                                 />
//                                 <input
//                                   type="date"
//                                   value={editForm.endDate || ""}
//                                   onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
//                                   className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                                   placeholder="No end date"
//                                 />
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-2 text-sm">
//                                 <Calendar className="w-4 h-4 text-gray-400" />
//                                 <div>
//                                   <div className="font-medium text-gray-800">{allocation.startDate}</div>
//                                   <div className="text-gray-500">
//                                     {allocation.endDate ? `to ${allocation.endDate}` : 'Ongoing'}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </td>

//                           {/* Status */}
//                           <td className="p-4">
//                             {editingId === allocation.id ? (
//                               <select
//                                 value={editForm.status}
//                                 onChange={(e) => setEditForm({...editForm, status: e.target.value})}
//                                 className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                               >
//                                 <option value="Active">Active</option>
//                                 <option value="Completed">Completed</option>
//                                 <option value="Cancelled">Cancelled</option>
//                               </select>
//                             ) : (
//                               <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                                 allocation.status === "Active" 
//                                   ? "bg-green-100 text-green-800" 
//                                   : allocation.status === "Completed"
//                                   ? "bg-blue-100 text-blue-800"
//                                   : "bg-red-100 text-red-800"
//                               }`}>
//                                 {allocation.status}
//                               </span>
//                             )}
//                           </td>

//                           {/* Allocated By */}
//                           <td className="p-4">
//                             <div className="text-sm text-gray-600">
//                               {allocation.allocatedBy}
//                               <div className="text-xs text-gray-400">{allocation.allocationDate}</div>
//                             </div>
//                           </td>

//                           {/* Actions */}
//                           <td className="p-4">
//                             {editingId === allocation.id ? (
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => saveEdit(allocation.id)}
//                                   className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
//                                 >
//                                   <Save className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={cancelEditing}
//                                   className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
//                                 >
//                                   <X className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="flex gap-2">
//                                 <button
//                                   onClick={() => startEditing(allocation)}
//                                   className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
//                                 >
//                                   <Edit3 className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={() => deleteAllocation(allocation.id)}
//                                   className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
//                                 >
//                                   <X className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Table Footer */}
//               <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
//                 <div className="text-sm text-gray-600">
//                   Showing {filteredAllocations.length} of {allocations.length} allocations
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
//                     Previous
//                   </button>
//                   <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllocationPage;