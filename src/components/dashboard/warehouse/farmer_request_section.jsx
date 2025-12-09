"use client"
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Send, Calendar, Eye, X } from 'lucide-react';
import FarmerRequestFormModal from './farmer_request_modal';

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;


const SEASONS = [
  { key: "kharif", label: "Kharif", labelUrdu: "خریف", color: "amber" },
  { key: "rabi", label: "Rabi", labelUrdu: "ربیع", color: "blue" }
];

const FarmerRequestsSection = ({ 
  farmerRequests, 
  setFarmerRequests,
  inventory,
  setInventory,
  setIssuances,
  setProcRequests,
  setToast,
  currentSeason
}) => {
  const [showForm, setShowForm] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [processingId, setProcessingId] = useState(null);

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
    setToast({ message: "Farmer request received", type: "success" });
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
    setToast({ message: "No items available in inventory", type: "error" });
    setProcessingId(null);
    return;
  }

  // … (your existing inventory deduction code)

  const newStatus = missing.length === 0 ? "fulfilled" : "partial";
  setFarmerRequests(prev => prev.map(r =>
    r.id === request.id ? { ...r, status: newStatus, fulfilledAt: Date.now() } : r
  ));

  // … (rest of your code)

  setProcessingId(null);
};

 const sendToProcurement = (request) => {
  // Prevent double-click
  if (processingId === request.id) return;
  setProcessingId(request.id);

  const { missing } = checkAvailability(request);

  if (missing.length === 0) {
    setToast({ message: "All items are available. Issue goods instead.", type: "error" });
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

  // Mark the farmer request as “partial” immediately so the button disappears
  setFarmerRequests(prev => prev.map(r =>
    r.id === request.id ? { ...r, status: "partial", fulfilledAt: Date.now() } : r
  ));

  setToast({ message: "Request sent to Procurement", type: "success" });
  setProcessingId(null);
};

  const deleteRequest = (id) => {
    if (confirm("Delete this farmer request?")) {
      setFarmerRequests(prev => prev.filter(r => r.id !== id));
      setToast({ message: "Request deleted", type: "success" });
    }
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    fulfilled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    partial: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Farmer Requests</h2>
            <p className="text-sm text-slate-600">Manage and fulfill farmer orders</p>
          </div>
          <button 
            onClick={() => setShowForm(true)} 
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>
      </div>

      {farmerRequests.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No farmer requests</p>
          <p className="text-sm text-slate-400 mt-1">Create your first request to begin</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmerRequests.map(req => {
              const { available, missing } = checkAvailability(req);
              const seasonData = SEASONS.find(s => s.key === req.season);
              
              return (
                <div key={req.id} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-slate-900">{req.farmerName}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{req.id}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[req.status]}`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className={`text-xs font-semibold ${
                        seasonData?.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                      }`}>
                        {seasonData?.label} ({seasonData?.labelUrdu})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{new Date(req.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="text-sm text-slate-600 font-medium">
                      {req.items.length} item{req.items.length !== 1 ? 's' : ''} requested
                    </div>
                    
                    {available.length > 0 && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CheckCircle className="w-4 h-4" />
                        {available.length} available
                      </div>
                    )}
                    
                    {missing.length > 0 && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        {missing.length} out of stock
                      </div>
                    )}

                  <div className="pt-3 border-t border-slate-200 space-y-2">
  <button
    onClick={() => setViewingRequest(req)}
    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
  >
    <Eye className="w-4 h-4" />
    View Details
  </button>

  {/* DYNAMIC ACTION BUTTONS - AUTO WIDTH */}
  <div className="grid grid-cols-1 gap-2">
    {/* Show "Issue" only if at least ONE item is available AND request is pending */}
  {req.status === "pending" && available.length > 0 && (
  <button
    onClick={() => issueGoods(req)}
    disabled={processingId === req.id}
    className={`flex items-center justify-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg transition-all text-sm ${
      processingId === req.id
        ? "bg-emerald-400 cursor-not-allowed"
        : "bg-emerald-500 hover:bg-emerald-600"
    }`}
  >
    <CheckCircle className="w-4 h-4" />
    {processingId === req.id ? "Issuing…" : "Issue Goods"}
  </button>
)}

{req.status === "pending" && missing.length > 0 && (
  <button
    onClick={() => sendToProcurement(req)}
    disabled={processingId === req.id}
    className={`flex items-center justify-center gap-2 text-white font-semibold px-4 py-2.5 rounded-lg transition-all text-sm ${
      processingId === req.id
        ? "bg-orange-400 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600"
    }`}
  >
    <Send className="w-4 h-4" />
    {processingId === req.id ? "Sending…" : "Send to Procurement"}
  </button>
)}

    {/* Always show Delete (takes full width if others hidden) */}
    <button
      onClick={() => deleteRequest(req.id)}
      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-all text-sm"
    >
      <Trash2 className="w-4 h-4" />
      Delete Request
    </button>
  </div>
</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {viewingRequest && (
        <ViewRequestModal 
          request={viewingRequest} 
          inventory={inventory} 
          onClose={() => setViewingRequest(null)} 
        />
      )}

      {/* Add Request Modal */}
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

// View Request Modal Component
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Request Details</h2>
            <p className="text-sm text-slate-500 mt-0.5">{request.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Farmer</p>
                <p className="font-bold text-slate-900">{request.farmerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Season</p>
                <p className={`font-bold ${
                  seasonData?.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                }`}>
                  {seasonData?.label} ({seasonData?.labelUrdu})
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Status</p>
                <p className="font-bold text-slate-900 capitalize">{request.status}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm text-slate-900">{new Date(request.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Requested Items</h3>
            <div className="space-y-2">
              {request.items.map((item, idx) => {
                const { available, needed, shortage, sufficient } = checkAvailability(item);
                
                return (
                  <div key={idx} className={`border-2 rounded-lg p-4 ${
                    sufficient ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-600 capitalize">{item.category}</p>
                      </div>
                      {sufficient ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Requested</p>
                        <p className="font-bold text-slate-900">{needed} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Available</p>
                        <p className={`font-bold ${sufficient ? 'text-emerald-700' : 'text-orange-700'}`}>
                          {available} {item.unit}
                        </p>
                      </div>
                      {shortage > 0 && (
                        <div>
                          <p className="text-xs text-slate-600 font-semibold">Shortage</p>
                          <p className="font-bold text-red-700">{shortage} {item.unit}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default FarmerRequestsSection;