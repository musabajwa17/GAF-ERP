import React from 'react';
import { X, ShoppingCart, User, Phone, Calendar, DollarSign, FileText, Package, Download } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function PurchaseDetailModal({ purchase, onClose }) {
  if (!purchase) return null;

  const remaining = purchase.totalPrice - purchase.amountPaid;

  const getPaymentStatusStyle = (status) => {
    const styles = {
      paid: "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white",
      partial: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
      pending: "bg-gradient-to-r from-red-400 to-red-500 text-white"
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6 flex justify-between items-center rounded-t-3xl shadow-lg z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Purchase Details</h2>
              <p className="text-sm text-purple-100">{purchase.id}</p>
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
          {/* Supplier & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</p>
              </div>
              <p className="text-lg font-bold text-slate-900">{purchase.supplierName}</p>
              {purchase.supplierContact && (
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-600">
                  <Phone className="w-3 h-3" />
                  <span>{purchase.supplierContact}</span>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Request ID</p>
              </div>
              <p className="text-lg font-bold text-blue-900">{purchase.requestId}</p>
              <p className="text-xs text-blue-700 mt-2">Quote ID: {purchase.quoteId}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Payment Date</p>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {new Date(purchase.paymentDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 mb-8 shadow-2xl shadow-purple-500/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-purple-100 font-bold uppercase tracking-wider mb-2">Total Price</p>
                <p className="text-3xl font-black text-white">{formatCurrency(purchase.totalPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-purple-100 font-bold uppercase tracking-wider mb-2">Amount Paid</p>
                <p className="text-3xl font-black text-white">{formatCurrency(purchase.amountPaid)}</p>
              </div>
              <div>
                <p className="text-sm text-purple-100 font-bold uppercase tracking-wider mb-2">Remaining</p>
                <p className="text-3xl font-black text-white">{formatCurrency(remaining)}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-purple-100 font-bold uppercase tracking-wider">Payment Status</span>
              <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${getPaymentStatusStyle(purchase.paymentStatus)} shadow-lg`}>
                {purchase.paymentStatus}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Purchased Items</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-8">
            {purchase.items.map((item, idx) => (
              <div 
                key={idx} 
                className="group bg-gradient-to-r from-slate-50 to-slate-100 hover:from-purple-50 hover:to-purple-100 border-2 border-slate-200 hover:border-purple-400 rounded-2xl p-5 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-bold border border-blue-300">
                        {item.qty} {item.unit}
                      </span>
                      <span className="text-slate-600 font-semibold">×</span>
                      <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-bold border border-amber-300">
                        {formatCurrency(item.pricePerUnit)} per {item.unit}
                      </span>
                      <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-bold border border-purple-300 capitalize">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Subtotal</p>
                    <p className="text-2xl font-black text-purple-600">{formatCurrency(item.totalPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes & Attachment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchase.notes && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Purchase Notes</p>
                    <p className="text-amber-900 font-medium leading-relaxed">{purchase.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {purchase.attachment && (
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-2xl p-5">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Attachment</p>
                    <a
                      href={purchase.attachment.data}
                      download={purchase.attachment.name}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      {purchase.attachment.name}
                    </a>
                    <p className="text-xs text-blue-600 mt-2">
                      Size: {(purchase.attachment.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Purchase recorded on {new Date(purchase.createdAt).toLocaleDateString('en-US', { 
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