"use client"
import React from 'react';
import { Package, Calendar, User } from 'lucide-react';

const SEASONS = [
  { key: "kharif", label: "Kharif", labelUrdu: "خریف", color: "amber" },
  { key: "rabi", label: "Rabi", labelUrdu: "ربیع", color: "blue" }
];

const ProcurementSection = ({ procRequests }) => {
  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dispatched: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-fit">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Procurement Requests</h2>
        <p className="text-sm text-slate-600">Items needed from suppliers</p>
      </div>

      {procRequests.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-3">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No procurement requests</p>
          <p className="text-xs text-slate-400 mt-1">Shortage items will appear here</p>
        </div>
      ) : (
        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {procRequests.map(req => {
            const seasonData = SEASONS.find(s => s.key === req.season);
            
            return (
              <div key={req.id} className="border-2 border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors bg-gradient-to-br from-white to-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{req.id}</p>
                    {req.farmerName && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <p className="text-xs text-slate-600 font-medium">{req.farmerName}</p>
                      </div>
                    )}
                    {req.season && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <p className={`text-xs font-semibold ${
                          seasonData?.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                        }`}>
                          {seasonData?.label} ({seasonData?.labelUrdu})
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">{new Date(req.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[req.status]}`}>
                    {req.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                    Items Needed ({req.items.length})
                  </p>
                  {req.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center px-3 py-2.5 bg-white border-l-4 border-orange-400 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{item.category}</p>
                      </div>
                      <p className="font-bold text-orange-600 text-sm">{item.qty} {item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProcurementSection;