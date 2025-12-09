"use client"
import React, { useState } from 'react';
import { X, Building2, User, Package, MapPin, Users, FileText, CalendarDays, Calendar, Send, CheckCircle, AlertCircle } from 'lucide-react';

const SEASONS = [
  { key: "kharif", label: "Kharif", labelUrdu: "خریف", color: "amber" },
  { key: "rabi", label: "Rabi", labelUrdu: "ربیع", color: "blue" }
];

const CATEGORIES = [
  { key: "fertilizers", label: "Fertilizers" },
  { key: "pesticides", label: "Pesticides" },
  { key: "produce", label: "Produce" },
  { key: "seeds", label: "Seeds" },
  { key: "other", label: "Other" }
];

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const ViewRequestDetailsModal = ({ request, onClose, inventory = [], setToast, onSendToProcurement }) => {
  const [processingId, setProcessingId] = useState(null);
  const seasonData = SEASONS.find(s => s.key === request.season);

  // Check inventory for each item
  const checkItemAvailability = (requestedItem) => {
    // Find matching inventory item by itemId, category, and season
    const invItem = inventory.find(
      i => i.itemId === requestedItem.itemId && 
          i.category === requestedItem.category && 
          i.season === request.season
    );
    
    const inHand = invItem ? invItem.qty : 0;
    const requested = requestedItem.requiredQty;
    const shortage = Math.max(0, requested - inHand);
    const sufficient = inHand >= requested;
    
    return { inHand, requested, shortage, sufficient };
  };

  // Calculate overall availability
  const calculateOverallAvailability = () => {
    const itemsWithShortage = [];
    let allAvailable = true;

    request.items.forEach(item => {
      const { shortage, sufficient } = checkItemAvailability(item);
      
      if (!sufficient) {
        allAvailable = false;
        itemsWithShortage.push({
          ...item,
          shortageQty: shortage
        });
      }
    });

    return { allAvailable, itemsWithShortage };
  };

  const handleSendToProcurement = () => {
    // Prevent double-click
    if (processingId === request.id) return;
    setProcessingId(request.id);

    const { allAvailable, itemsWithShortage } = calculateOverallAvailability();

    if (allAvailable) {
      setToast?.({ message: "All items are available in inventory. No procurement needed.", type: "error" });
      setProcessingId(null);
      return;
    }

    // Create procurement request with shortage items
    const procRequest = {
      id: uid("PROC"),
      fromRequest: request.id,
      department: request.department,
      endUser: request.endUser,
      nameCategory: request.nameCategory,
      siteName: request.siteName,
      season: request.season,
      items: itemsWithShortage.map(item => ({
        ...item,
        requiredQty: item.shortageQty // Only request the shortage amount
      })),
      status: "pending",
      createdAt: Date.now(),
      requestDate: request.requestDate,
      shortNote: `Procurement needed for request ${request.id}`
    };

    // Get existing procurement requests from localStorage
    const existingRequests = JSON.parse(localStorage.getItem('procurement_requests_v2') || '[]');
    const updatedRequests = [procRequest, ...existingRequests];
    localStorage.setItem('procurement_requests_v2', JSON.stringify(updatedRequests));

    // Call parent callback if provided
    if (onSendToProcurement) {
      onSendToProcurement(procRequest);
    }

    setToast?.({ message: "Procurement request created successfully", type: "success" });
    setProcessingId(null);
    
    // Close modal after successful submission
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const { allAvailable, itemsWithShortage } = calculateOverallAvailability();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Purchase Request Details</h2>
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
          {/* Request Information */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Request Information
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Department */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Department
                </label>
                <p className="font-bold text-slate-900">{request.department}</p>
              </div>

              {/* End-User */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  End-User
                </label>
                <p className="font-bold text-slate-900">{request.endUser}</p>
              </div>

              {/* Name/Category */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  Name/Category
                </label>
                <p className="font-bold text-slate-900">{request.nameCategory}</p>
              </div>

              {/* Site Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Site Name
                </label>
                <p className="font-medium text-slate-700">{request.siteName}</p>
              </div>

              {/* Suggested Supplier */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Suggested Supplier
                </label>
                <p className="font-medium text-slate-700">{request.suggestedSupplier || '—'}</p>
              </div>

              {/* Request Date */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                  Request Date
                </label>
                <p className="font-medium text-slate-700">
                  {new Date(request.requestDate).toLocaleDateString()}
                </p>
              </div>

              {/* Season */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Season
                </label>
                <p className={`font-bold ${
                  seasonData?.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                }`}>
                  {seasonData?.label} ({seasonData?.labelUrdu})
                </p>
              </div>

              {/* Created At */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                  Created At
                </label>
                <p className="text-xs text-slate-700">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Short Note - Full Width */}
            {request.shortNote && (
              <div className="mt-4 pt-4 border-t border-slate-300">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Short Note
                </label>
                <p className="text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-3">
                  {request.shortNote}
                </p>
              </div>
            )}
          </div>

          {/* Availability Summary */}
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            allAvailable 
              ? 'bg-emerald-50 border-emerald-300' 
              : 'bg-orange-50 border-orange-300'
          }`}>
            <div className="flex items-center gap-3">
              {allAvailable ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-900">All Items Available</p>
                    <p className="text-sm text-emerald-700">All requested items are in stock for {seasonData?.label} season</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-bold text-orange-900">Procurement Needed</p>
                    <p className="text-sm text-orange-700">
                      {itemsWithShortage.length} item{itemsWithShortage.length !== 1 ? 's' : ''} require{itemsWithShortage.length === 1 ? 's' : ''} procurement
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Requested Items Table */}
          <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                <Package className="w-4 h-4" />
                Requested Items ({request.items.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b border-slate-300">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase w-12">S.No</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase">Category</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase">Item Name</th>
                    <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-700 uppercase w-28">Requested</th>
                    <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-700 uppercase w-28">In Hand</th>
                    <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-700 uppercase w-28">Shortage</th>
                    <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-700 uppercase w-20">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase w-32">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {request.items.map((item, idx) => {
                    const { inHand, requested, shortage, sufficient } = checkItemAvailability(item);
                    
                    return (
                      <tr key={idx} className={`${sufficient ? 'bg-emerald-50/30' : 'bg-orange-50/30'} hover:bg-slate-50`}>
                        <td className="px-4 py-3 text-center font-semibold text-slate-700">{idx + 1}</td>
                        <td className="px-4 py-3 text-slate-700 capitalize text-xs">
                          {CATEGORIES.find(c => c.key === item.category)?.label}
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-medium">{item.itemName}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-slate-900">{requested}</span>
                          <span className="text-xs text-slate-600 ml-1">{item.uom}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold ${sufficient ? 'text-emerald-700' : 'text-orange-700'}`}>
                            {inHand}
                          </span>
                          <span className="text-xs text-slate-600 ml-1">{item.uom}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {shortage > 0 ? (
                            <span className="font-bold text-red-700">
                              {shortage}
                              <span className="text-xs text-slate-600 ml-1">{item.uom}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {sufficient ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 inline-block" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-600 inline-block" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{item.remarks || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-sm">
            {!allAvailable && (
              <p className="text-orange-700 font-semibold">
                ⚠️ {itemsWithShortage.length} item{itemsWithShortage.length !== 1 ? 's' : ''} need{itemsWithShortage.length === 1 ? 's' : ''} to be procured
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors text-sm"
            >
              Close
            </button>
            {!allAvailable && (
              <button
                onClick={handleSendToProcurement}
                disabled={processingId === request.id}
                className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition-all text-sm ${
                  processingId === request.id
                    ? "bg-orange-400 cursor-not-allowed text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
              >
                <Send className="w-4 h-4" />
                {processingId === request.id ? "Sending..." : "Send to Procurement"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRequestDetailsModal;