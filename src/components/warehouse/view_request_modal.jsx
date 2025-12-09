"use client"
import React from 'react';
import { X, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const SEASONS = [
  { key: "kharif", label: "Kharif", labelUrdu: "خریف", color: "amber" },
  { key: "rabi", label: "Rabi", labelUrdu: "ربیع", color: "blue" }
];

const ViewRequestModal = ({ request, inventory, onClose }) => {
  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    fulfilled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    partial: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  const seasonData = SEASONS.find(s => s.key === request.season);

  const checkAvailability = (item) => {
    const invItem = inventory.find(
      i => i.itemId === item.itemId && 
          i.category === item.category && 
          i.unit === item.unit &&
          i.season === request.season
    );
    
    const available = invItem ? invItem.qty : 0;
    const needed = item.qty;
    const shortage = Math.max(0, needed - available);
    
    return { 
      available, 
      needed, 
      shortage, 
      sufficient: available >= needed,
      invItem 
    };
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
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[request.status]}`}>
                  {request.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Season</p>
                {seasonData && (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className={`font-bold ${
                      seasonData.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {seasonData.label} ({seasonData.labelUrdu})
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Created</p>
                <p className="text-sm text-slate-900 mt-1">{new Date(request.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Requested Items</h3>
            <div className="space-y-2">
              {request.items.map((item, idx) => {
                const { available, needed, shortage, sufficient, invItem } = checkAvailability(item);
                
                return (
                  <div key={idx} className={`border-2 rounded-lg p-4 ${
                    sufficient ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-600 capitalize mt-0.5">{item.category}</p>
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

          {request.status === "fulfilled" && request.fulfilledAt && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-bold">Request Fulfilled</p>
                  <p className="text-sm">{new Date(request.fulfilledAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {request.status === "partial" && request.fulfilledAt && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-bold">Partially Fulfilled</p>
                  <p className="text-sm">Some items issued. Remaining items sent to procurement.</p>
                  <p className="text-sm">{new Date(request.fulfilledAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRequestModal;