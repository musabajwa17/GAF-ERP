import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function PurchaseFormModal({ quote, onClose, onSubmit }) {
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [amountPaid, setAmountPaid] = useState(quote?.totalPrice || 0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onSubmit({ paymentStatus, amountPaid, paymentDate, notes });
  };

  if (!quote) return null;

  const remaining = quote.totalPrice - amountPaid;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 flex justify-between items-center rounded-t-3xl shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Record Purchase</h2>
              <p className="text-sm text-purple-100">Quote: {quote.id}</p>
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
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 mb-6 border-2 border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Supplier</p>
                <p className="text-lg font-bold text-slate-900">{quote.supplierName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Price</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(quote.totalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Payment Status <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-slate-900 font-semibold cursor-pointer"
              >
                <option value="paid">Paid in Full</option>
                <option value="partial">Partial Payment</option>
                <option value="pending">Payment Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Amount Paid */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Amount Paid (PKR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">PKR</span>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                placeholder="0.00"
                className="w-full pl-16 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-slate-900 font-bold text-lg"
              />
            </div>
          </div>

          {/* Remaining Amount Display */}
          {remaining !== 0 && (
            <div className={`rounded-2xl p-4 mb-6 border-2 ${
              remaining > 0 
                ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-300' 
                : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold uppercase tracking-wider ${
                  remaining > 0 ? 'text-red-700' : 'text-blue-700'
                }`}>
                  {remaining > 0 ? 'Remaining Balance' : 'Overpayment'}
                </span>
                <span className={`text-2xl font-black ${
                  remaining > 0 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {formatCurrency(Math.abs(remaining))}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Purchase Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery details, payment method, or other notes..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Record Purchase & Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}