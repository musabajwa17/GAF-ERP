import React from 'react';
import { X, DollarSign, User, Phone, FileText } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function QuoteDetailModal({ quote, onClose }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-800 border-amber-300",
      accepted: "bg-emerald-100 text-emerald-800 border-emerald-300",
      rejected: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6 flex justify-between items-center rounded-t-3xl shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Quote Details</h2>
              <p className="text-sm text-emerald-100">{quote.id}</p>
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
          {/* Supplier Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</p>
              </div>
              <p className="text-lg font-bold text-slate-900">{quote.supplierName}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</p>
              </div>
              <p className="text-lg font-bold text-slate-900">{quote.supplierContact || 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase border-2 ${getStatusColor(quote.status)}`}>
                {quote.status}
              </span>
            </div>
          </div>

          {/* Request Reference */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Request Reference</p>
            </div>
            <p className="text-lg font-bold text-blue-900">{quote.requestId}</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Items & Pricing</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-8">
            {quote.items.map((item, idx) => (
              <div 
                key={idx} 
                className="group bg-gradient-to-r from-slate-50 to-slate-100 hover:from-emerald-50 hover:to-emerald-100 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-5 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-bold border border-blue-300">
                        {item.qty} {item.unit}
                      </span>
                      <span className="text-slate-600 font-semibold">×</span>
                      <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-bold border border-amber-300">
                        {formatCurrency(item.pricePerUnit)} per {item.unit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total</p>
                    <p className="text-2xl font-black text-emerald-600">{formatCurrency(item.totalPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Price */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-2xl shadow-emerald-500/50 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100 font-bold uppercase tracking-wider mb-1">Grand Total</p>
                <p className="text-4xl font-black text-white">{formatCurrency(quote.totalPrice)}</p>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Additional Notes</p>
                  <p className="text-amber-900 font-medium leading-relaxed">{quote.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Created on {new Date(quote.createdAt).toLocaleDateString('en-US', { 
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
      </div>
    </div>
  );
}