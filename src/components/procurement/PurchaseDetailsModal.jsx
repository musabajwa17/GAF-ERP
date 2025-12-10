import React from 'react';
import { X, ShoppingCart, Building2, Phone, Calendar, FileText, Package, Download } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function PurchaseDetailModal({ purchase, onClose }) {
  if (!purchase) return null;

  const remaining = purchase.totalPrice - purchase.amountPaid;

  const getPaymentStatusStyle = (status) => {
    const styles = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      partial: "bg-amber-50 text-amber-700 border-amber-200",
      pending: "bg-rose-50 text-rose-700 border-rose-200"
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Purchase Details</h2>
                <p className="text-sm text-gray-500">{purchase.id}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Supplier & Reference Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Supplier</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{purchase.supplierName}</p>
              {purchase.supplierContact && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{purchase.supplierContact}</span>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reference</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{purchase.requestId}</p>
              <p className="text-xs text-gray-600 mt-2">Quote: {purchase.quoteId}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Date</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(purchase.paymentDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-lg p-5 mb-6 border border-indigo-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Price</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(purchase.totalPrice)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Amount Paid</p>
                <p className="text-xl font-semibold text-emerald-600">{formatCurrency(purchase.amountPaid)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Remaining</p>
                <p className={`text-xl font-semibold ${remaining > 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-indigo-200 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Payment Status</span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-medium border ${getPaymentStatusStyle(purchase.paymentStatus)}`}>
                {purchase.paymentStatus}
              </span>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Package className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Purchased Items</h3>
            </div>

            <div className="space-y-3">
              {purchase.items && purchase.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        {item.name || item.itemName || 'Item'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">
                          Qty: {item.qty || item.requiredQty} {item.unit || item.uom}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>
                          {formatCurrency(item.pricePerUnit)} per {item.unit || item.uom}
                        </span>
                        {item.category && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 capitalize">
                              {item.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatCurrency(item.totalPrice || (item.pricePerUnit * (item.qty || item.requiredQty)))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Attachment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchase.notes && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-amber-800 uppercase tracking-wide mb-2">Purchase Notes</p>
                    <p className="text-sm text-amber-900 leading-relaxed">{purchase.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {purchase.attachment && (
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-800 uppercase tracking-wide mb-2">Attachment</p>
                    <a
                      href={purchase.attachment.data}
                      download={purchase.attachment.name}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="truncate">{purchase.attachment.name}</span>
                    </a>
                    <p className="text-xs text-blue-700 mt-2">
                      Size: {(purchase.attachment.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          {purchase.createdAt && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Purchase recorded on {new Date(purchase.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}