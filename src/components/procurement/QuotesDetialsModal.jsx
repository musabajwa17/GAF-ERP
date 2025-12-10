import React from 'react';
import { X, Building2, Phone, FileText, Package, DollarSign } from 'lucide-react';

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  const n = Number(amount);
  if (!Number.isFinite(n)) return '—';
  return `PKR ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
};

const getStatusStyles = (status) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200"
  };
  return styles[status] || styles.pending;
};

export default function QuoteDetailModal({ quote = {}, onClose }) {
  const items = Array.isArray(quote.items) ? quote.items : [];

  const safeName = (item) => item.itemName || item.name || item.item || "Item";
  const safeQuantity = (item) => (item.requiredQty ?? item.shortageQty ?? item.qty ?? 0);
  const safeUnit = (item) => item.uom || item.unit || "pcs";
  const safePricePerUnit = (item) => {
    if (item.pricePerUnit === undefined || item.pricePerUnit === null) return null;
    const n = Number(item.pricePerUnit);
    return Number.isFinite(n) ? n : null;
  };
  const safeTotalPrice = (item) => {
    if (item.totalPrice === undefined || item.totalPrice === null) return null;
    const n = Number(item.totalPrice);
    return Number.isFinite(n) ? n : null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Quote Details</h2>
                <p className="text-sm text-gray-500">{quote.id || '—'}</p>
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
          {/* Supplier Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Supplier</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{quote.supplierName || '—'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Contact</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{quote.supplierContact || 'N/A'}</p>
            </div>
          </div>

          {/* Status & Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</span>
              <div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-medium border ${getStatusStyles(quote.status)}`}>
                  {quote.status || 'pending'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Request ID</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{quote.requestId || '—'}</p>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Package className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Line Items</h3>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No items available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const name = safeName(item);
                  const qty = safeQuantity(item);
                  const unit = safeUnit(item);
                  const pricePerUnit = safePricePerUnit(item);
                  const total = safeTotalPrice(item) ?? (pricePerUnit !== null ? pricePerUnit * qty : null);

                  return (
                    <div 
                      key={idx} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            {name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">
                              Qty: {qty} {unit}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>
                              {pricePerUnit !== null ? formatCurrency(pricePerUnit) : '—'} / {unit}
                            </span>
                          </div>
                          {item.remarks && (
                            <p className="mt-2 text-xs text-gray-500 italic">{item.remarks}</p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500 mb-1">Amount</p>
                          <p className="text-base font-semibold text-gray-900">
                            {total !== null ? formatCurrency(total) : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes */}
          {quote.notes && (
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-800 mb-2">Additional Notes</p>
                  <p className="text-sm text-amber-900 leading-relaxed">{quote.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          {quote.createdAt && (
            <div className="text-xs text-gray-500 text-center">
              Created on {new Date(quote.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        {/* Footer - Grand Total */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Grand Total</span>
            </div>
            <span className="text-xl font-semibold text-emerald-600">
              {formatCurrency(quote.totalPrice ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}