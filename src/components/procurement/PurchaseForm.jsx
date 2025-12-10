import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Building2, CreditCard, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function PurchaseFormModal({ quote, onClose, onSubmit }) {
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [amountPaid, setAmountPaid] = useState(quote?.totalPrice || 0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  // Auto-update payment status based on amount paid
  useEffect(() => {
    if (!quote) return;
    
    const totalPrice = quote.totalPrice;
    const paid = Number(amountPaid);

    if (paid === 0) {
      setPaymentStatus("pending");
    } else if (paid > 0 && paid < totalPrice) {
      setPaymentStatus("partial");
    } else if (paid >= totalPrice) {
      setPaymentStatus("paid");
    }
  }, [amountPaid, quote]);

  const validateForm = () => {
    const newErrors = {};
    const paid = Number(amountPaid);
    const totalPrice = quote.totalPrice;

    // Validate amount paid
    if (isNaN(paid) || paid < 0) {
      newErrors.amountPaid = "Please enter a valid amount (cannot be negative)";
    } else if (paid === 0 && paymentStatus !== "pending") {
      newErrors.amountPaid = "Amount paid cannot be zero unless payment is pending";
    } else if (paid > totalPrice * 2) {
      newErrors.amountPaid = "Amount paid seems unusually high. Please verify.";
    }

    // Validate payment date
    if (!paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    } else {
      const selectedDate = new Date(paymentDate);
      const today = new Date();
      const futureLimit = new Date();
      futureLimit.setDate(today.getDate() + 30);

      if (selectedDate > futureLimit) {
        newErrors.paymentDate = "Payment date cannot be more than 30 days in the future";
      }
    }

    // Validate payment status consistency
    if (paymentStatus === "paid" && paid < totalPrice) {
      newErrors.paymentStatus = "Status is 'Paid in Full' but amount is less than total price";
    } else if (paymentStatus === "pending" && paid > 0) {
      newErrors.paymentStatus = "Status is 'Pending' but amount paid is greater than zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ paymentStatus, amountPaid: Number(amountPaid), paymentDate, notes });
    }
  };

  const handleAmountChange = (value) => {
    const numValue = value === '' ? 0 : Number(value);
    setAmountPaid(numValue);
    // Clear amount error when user types
    if (errors.amountPaid) {
      setErrors(prev => ({ ...prev, amountPaid: undefined }));
    }
  };

  if (!quote) return null;

  const remaining = quote.totalPrice - Number(amountPaid);
  const isPaidInFull = remaining === 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Record Purchase</h2>
                <p className="text-sm text-gray-500">Quote: {quote.id}</p>
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
          {/* Supplier Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Supplier</p>
                  <p className="text-sm font-medium text-gray-900">{quote.supplierName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
                  <p className="text-sm font-semibold text-indigo-600">{formatCurrency(quote.totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Form */}
          <div className="space-y-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => {
                    setPaymentStatus(e.target.value);
                    if (errors.paymentStatus) {
                      setErrors(prev => ({ ...prev, paymentStatus: undefined }));
                    }
                  }}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-gray-900 ${
                    errors.paymentStatus ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="paid">Paid in Full</option>
                  <option value="partial">Partial Payment</option>
                  <option value="pending">Payment Pending</option>
                </select>
                {errors.paymentStatus && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.paymentStatus}
                  </p>
                )}
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => {
                    setPaymentDate(e.target.value);
                    if (errors.paymentDate) {
                      setErrors(prev => ({ ...prev, paymentDate: undefined }));
                    }
                  }}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-gray-900 ${
                    errors.paymentDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.paymentDate && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.paymentDate}
                  </p>
                )}
              </div>
            </div>

            {/* Amount Paid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Paid <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">PKR</span>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full pl-14 pr-4 py-2.5 bg-white border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-gray-900 text-sm ${
                    errors.amountPaid ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.amountPaid && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amountPaid}
                </p>
              )}
            </div>
          </div>

          {/* Remaining Amount Alert */}
          {remaining !== 0 && (
            <div className={`rounded-lg p-4 mb-6 border-l-4 ${
              remaining > 0 
                ? 'bg-amber-50 border-amber-400' 
                : 'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-center gap-3">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                  remaining > 0 ? 'text-amber-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                    remaining > 0 ? 'text-amber-700' : 'text-blue-700'
                  }`}>
                    {remaining > 0 ? 'Remaining Balance' : 'Overpayment'}
                  </p>
                  <p className={`text-lg font-semibold ${
                    remaining > 0 ? 'text-amber-900' : 'text-blue-900'
                  }`}>
                    {formatCurrency(Math.abs(remaining))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success indicator for full payment */}
          {isPaidInFull && Number(amountPaid) > 0 && (
            <div className="rounded-lg p-4 mb-6 border-l-4 bg-emerald-50 border-emerald-400">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide mb-1 text-emerald-700">
                    Payment Complete
                  </p>
                  <p className="text-sm text-emerald-900">
                    Full payment of {formatCurrency(quote.totalPrice)} received
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Purchase Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add delivery details, payment method, or other notes..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
            >
              Record Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}