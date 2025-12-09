import React from 'react';
import { X, FileText, Package } from 'lucide-react';

export default function RequestDetailModal({ request, onClose }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      approved: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dispatched: "bg-blue-100 text-blue-800 border-blue-300"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center rounded-t-3xl shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Request Details</h2>
              <p className="text-sm text-blue-100">{request.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Request Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Request ID</p>
              <p className="text-lg font-bold text-slate-900">{request.id}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase border-2 ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200 md:col-span-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Created At</p>
              <p className="text-lg font-bold text-slate-900">
                {new Date(request.createdAt).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Requested Items</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {request.items.map((item, idx) => (
              <div 
                key={idx} 
                className="group bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl p-5 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold border border-blue-300">
                        Qty: {item.qty} {item.unit}
                      </span>
                      <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold border border-purple-300 capitalize">
                        {item.category}
                      </span>
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-300">
                        ID: {item.itemId}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 text-white rounded-full font-bold text-lg group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Total Items</span>
              <span className="text-3xl font-black text-blue-600">{request.items.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}