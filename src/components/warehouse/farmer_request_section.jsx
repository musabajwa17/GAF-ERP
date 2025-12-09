"use client"
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Send, Calendar, Eye, X, Search, Filter, ChevronDown } from 'lucide-react';
import FarmerRequestFormModal from "@/components/warehouse/farmer_request_modal"
import ViewRequestDetailsModal from "@/components/warehouse/view_request_details"
const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const SEASONS = [
  { key: "kharif", label: "Kharif", labelUrdu: "خریف", color: "amber" },
  { key: "rabi", label: "Rabi", labelUrdu: "ربیع", color: "blue" }
];

const FarmerRequestsSection = ({ 
  farmerRequests = [], 
  setFarmerRequests,
  inventory = [],
  setInventory,
  setIssuances,
  setProcRequests,
  setToast,
  currentSeason
}) => {
  const [showForm, setShowForm] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const createRequest = (requestData) => {
  const request = {
    id: uid("PR"),
    ...requestData,
    status: "pending",
    createdAt: Date.now(),
  };
  setFarmerRequests(prev => [request, ...prev]);
  setToast?.({ message: "Purchase request created successfully", type: "success" });
};

  const checkAvailability = (request) => {
    const available = [];
    const missing = [];

    request.items.forEach(reqItem => {
      const invItem = inventory.find(
        i => i.itemId === reqItem.itemId && 
            i.category === reqItem.category && 
            i.unit === reqItem.unit &&
            i.season === request.season
      );

      if (invItem && invItem.qty >= reqItem.qty) {
        available.push(reqItem);
      } else {
        const availableQty = invItem ? invItem.qty : 0;
        const neededQty = reqItem.qty - availableQty;
        
        if (availableQty > 0) {
          available.push({ ...reqItem, qty: availableQty });
        }
        
        if (neededQty > 0) {
          missing.push({ ...reqItem, qty: neededQty });
        }
      }
    });

    return { available, missing };
  };

  const issueGoods = (request) => {
    if (processingId === request.id) return;
    setProcessingId(request.id);

    const { available, missing } = checkAvailability(request);

    if (available.length === 0) {
      setToast?.({ message: "No items available in inventory", type: "error" });
      setProcessingId(null);
      return;
    }

    // Update inventory
    available.forEach(item => {
      setInventory(prev => prev.map(invItem => {
        if (invItem.itemId === item.itemId && 
            invItem.category === item.category && 
            invItem.unit === item.unit &&
            invItem.season === request.season) {
          return { ...invItem, qty: invItem.qty - item.qty };
        }
        return invItem;
      }));
    });

    const newStatus = missing.length === 0 ? "fulfilled" : "partial";
    setFarmerRequests(prev => prev.map(r =>
      r.id === request.id ? { ...r, status: newStatus, fulfilledAt: Date.now() } : r
    ));

    setToast?.({ message: `Goods ${newStatus === "fulfilled" ? "fully" : "partially"} issued`, type: "success" });
    setProcessingId(null);
  };

  const sendToProcurement = (request) => {
    if (processingId === request.id) return;
    setProcessingId(request.id);

    const { missing } = checkAvailability(request);

    if (missing.length === 0) {
      setToast?.({ message: "All items are available. Issue goods instead.", type: "error" });
      setProcessingId(null);
      return;
    }

    const procRequest = {
      id: uid("PROC"),
      fromRequest: request.id,
      farmerName: request.farmerName,
      season: request.season,
      items: missing,
      status: "pending",
      createdAt: Date.now(),
    };

    setProcRequests(prev => [procRequest, ...prev]);
    setFarmerRequests(prev => prev.map(r =>
      r.id === request.id ? { ...r, status: "partial", fulfilledAt: Date.now() } : r
    ));

    setToast?.({ message: "Request sent to Procurement", type: "success" });
    setProcessingId(null);
  };

  const deleteRequest = (id) => {
    if (confirm("Delete this farmer request?")) {
      setFarmerRequests(prev => prev.filter(r => r.id !== id));
      setToast?.({ message: "Request deleted", type: "success" });
    }
  };

  // Filter logic
 // Filter logic
const filteredRequests = farmerRequests.filter(req => {
  const matchesSearch = req.endUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       req.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       req.nameCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       req.id.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
  return matchesSearch && matchesStatus;
});

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    fulfilled: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    partial: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Farmer Requests</h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
              </p>
            </div>
            <button 
              onClick={() => setShowForm(true)} 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by farmer or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="partial">Partial</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

     {/* Table */}
{filteredRequests.length === 0 ? (
  <div className="text-center py-12 px-4">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-3">
      <AlertCircle className="w-8 h-8 text-slate-400" />
    </div>
    <p className="text-slate-600 font-medium">No requests found</p>
    <p className="text-sm text-slate-500 mt-1">
      {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first request to begin'}
    </p>
  </div>
) : (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-slate-50 border-y border-slate-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Request ID</th>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Department</th>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">End-User</th>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name/Category</th>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Site Name</th>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Season</th>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Total Items</th>
          <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {filteredRequests.map(req => {
          const seasonData = SEASONS.find(s => s.key === req.season);
          
          return (
            <tr key={req.id} className="hover:bg-slate-50 transition-colors">
              {/* Request ID */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono font-semibold text-slate-900">{req.id}</div>
              </td>

              {/* Department */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-slate-900">{req.department}</div>
              </td>

              {/* End-User */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-700">{req.endUser}</div>
              </td>

              {/* Name/Category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-700">{req.nameCategory}</div>
              </td>

              {/* Site Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-600">{req.siteName}</div>
              </td>

              {/* Season */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`text-sm font-semibold ${
                    seasonData?.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                  }`}>
                    {seasonData?.label}
                  </span>
                </div>
              </td>

              {/* Total Items */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-slate-900">
                  {req.items.length} item{req.items.length !== 1 ? 's' : ''}
                </div>
              </td>

              {/* Date */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-xs text-slate-600">
                  {new Date(req.requestDate).toLocaleDateString()}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setViewingRequest(req)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
                    title="View Requested Items"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Items
                  </button>

                  <button
                    onClick={() => deleteRequest(req.id)}
                    className="p-1.5 hover:bg-red-100 rounded-md transition-colors group"
                    title="Delete Request"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

      {/* Modals */}
   {viewingRequest && (
  <ViewRequestDetailsModal 
    request={viewingRequest} 
    inventory={inventory}
    setToast={setToast}
    onSendToProcurement={(procRequest) => {
      // Optional: Update parent state if needed
      // setProcRequests(prev => [procRequest, ...prev]);
    }}
    onClose={() => setViewingRequest(null)} 
  />
)}

      {showForm && (
        <FarmerRequestFormModal 
          onClose={() => setShowForm(false)} 
          onCreate={createRequest}
          currentSeason={currentSeason}
        />
      )}
    </div>
  );
};

// View Request Modal


export default FarmerRequestsSection;