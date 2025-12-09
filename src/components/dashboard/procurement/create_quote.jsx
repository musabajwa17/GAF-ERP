import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

export default function QuoteFormModal({ request, onClose, onSubmit }) {
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [notes, setNotes] = useState("");
  const [prices, setPrices] = useState({});

  const handleSubmit = () => {
    onSubmit({ supplierName, supplierContact, notes, prices });
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
              <h2 className="text-2xl font-bold text-white">Create Quote</h2>
              <p className="text-sm text-emerald-100">Request: {request?.id}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g., ABC Supplies Ltd"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Supplier Contact
              </label>
              <input
                type="text"
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value)}
                placeholder="e.g., +92-300-1234567"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Item Prices</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Items Pricing */}
          <div className="space-y-4 mb-8">
            {request?.items.map((item, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-emerald-50 hover:to-emerald-100 border-2 border-slate-200 hover:border-emerald-300 rounded-2xl transition-all duration-300"
              >
                <div className="flex-1">
                  <p className="text-base font-bold text-slate-900 mb-1">{item.name}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                      {item.qty} {item.unit}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">PKR</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={prices[`${item.itemId}-${item.category}`] || ""}
                    onChange={(e) => setPrices(prev => ({ 
                      ...prev, 
                      [`${item.itemId}-${item.category}`]: Number(e.target.value) || 0 
                    }))}
                    className="w-32 px-4 py-2 bg-white border-2 border-slate-300 group-hover:border-emerald-400 rounded-xl text-right font-bold text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or terms..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Quote
          </button>
        </div>
      </div>
    </div>
  );
}