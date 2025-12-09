"use client"
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Send, Calendar, Eye, X, Search, Filter, ChevronDown } from 'lucide-react';

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const SEASONS = [
  { key: "kharif", label: "Kharif", labelUrdu: "خریف", color: "amber" },
  { key: "rabi", label: "Rabi", labelUrdu: "ربیع", color: "blue" }
];

// Mock Modal Components (replace with your actual components)
const FarmerRequestFormModal = ({ onClose, onCreate, currentSeason }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
    <div className="bg-white rounded-xl p-6 max-w-md w-full">
      <h3 className="text-lg font-bold mb-4">Create New Request</h3>
      <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg">Close</button>
    </div>
  </div>
);

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

  const createRequest = (farmerName, season, items) => {
    const request = {
      id: uid("FR"),
      farmerName,
      season,
      items,
      status: "pending",
      createdAt: Date.now(),
    };
    setFarmerRequests(prev => [request, ...prev]);
    setToast?.({ message: "Farmer request received", type: "success" });
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
  const filteredRequests = farmerRequests.filter(req => {
    const matchesSearch = req.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Farmer Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Season</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRequests.map(req => {
                const { available, missing } = checkAvailability(req);
                const seasonData = SEASONS.find(s => s.key === req.season);
                
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    {/* Request ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-semibold text-slate-900">{req.id}</div>
                    </td>

                    {/* Farmer Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{req.farmerName}</div>
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

                    {/* Items Count */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-700">
                        {req.items.length} item{req.items.length !== 1 ? 's' : ''}
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {available.length > 0 && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{available.length}</span>
                          </div>
                        )}
                        {missing.length > 0 && (
                          <div className="flex items-center gap-1 text-xs font-semibold text-red-700">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{missing.length}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${statusColors[req.status]}`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-600">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingRequest(req)}
                          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors group"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
                        </button>

                        {req.status === "pending" && available.length > 0 && (
                          <button
                            onClick={() => issueGoods(req)}
                            disabled={processingId === req.id}
                            className={`p-1.5 rounded-md transition-colors group ${
                              processingId === req.id
                                ? "bg-emerald-100 cursor-not-allowed"
                                : "hover:bg-emerald-100"
                            }`}
                            title="Issue Goods"
                          >
                            <CheckCircle className={`w-4 h-4 ${
                              processingId === req.id ? "text-emerald-400" : "text-emerald-600 group-hover:text-emerald-700"
                            }`} />
                          </button>
                        )}

                        {req.status === "pending" && missing.length > 0 && (
                          <button
                            onClick={() => sendToProcurement(req)}
                            disabled={processingId === req.id}
                            className={`p-1.5 rounded-md transition-colors group ${
                              processingId === req.id
                                ? "bg-orange-100 cursor-not-allowed"
                                : "hover:bg-orange-100"
                            }`}
                            title="Send to Procurement"
                          >
                            <Send className={`w-4 h-4 ${
                              processingId === req.id ? "text-orange-400" : "text-orange-600 group-hover:text-orange-700"
                            }`} />
                          </button>
                        )}

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
        <ViewRequestModal 
          request={viewingRequest} 
          inventory={inventory} 
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
const ViewRequestModal = ({ request, inventory, onClose }) => {
  const seasonData = SEASONS.find(s => s.key === request.season);
  
  const checkAvailability = (reqItem) => {
    const invItem = inventory.find(
      i => i.itemId === reqItem.itemId && 
          i.category === reqItem.category && 
          i.unit === reqItem.unit &&
          i.season === request.season
    );
    
    const available = invItem ? invItem.qty : 0;
    const needed = reqItem.qty;
    const shortage = Math.max(0, needed - available);
    
    return { available, needed, shortage, sufficient: available >= needed };
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Request Details</h2>
            <p className="text-sm text-slate-600 mt-0.5 font-mono">{request.id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Farmer</p>
              <p className="font-bold text-slate-900 text-sm">{request.farmerName}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Season</p>
              <p className={`font-bold text-sm ${
                seasonData?.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
              }`}>
                {seasonData?.label} ({seasonData?.labelUrdu})
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Status</p>
              <p className="font-bold text-slate-900 capitalize text-sm">{request.status}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Created</p>
              <p className="text-xs text-slate-900">{new Date(request.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Requested Items</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">Category</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-slate-700 uppercase">Requested</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-slate-700 uppercase">Available</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-slate-700 uppercase">Shortage</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-slate-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {request.items.map((item, idx) => {
                    const { available, needed, shortage, sufficient } = checkAvailability(item);
                    
                    return (
                      <tr key={idx} className={sufficient ? 'bg-emerald-50/30' : 'bg-red-50/30'}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-600 capitalize text-xs">{item.category}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-bold text-slate-900">{needed} {item.unit}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold ${sufficient ? 'text-emerald-700' : 'text-orange-700'}`}>
                            {available} {item.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {shortage > 0 ? (
                            <span className="font-bold text-red-700">{shortage} {item.unit}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {sufficient ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 inline-block" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 inline-block" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerRequestsSection;