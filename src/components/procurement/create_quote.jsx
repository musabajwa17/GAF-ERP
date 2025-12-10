import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

const QuoteFormModal = ({ request, onClose, onSubmit }) => {
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [notes, setNotes] = useState("");
  const [prices, setPrices] = useState({}); // store raw string inputs
  const [isSubmitting, setIsSubmitting] = useState(false);

  // convert items/prices -> compute per-item totals and overall total
  const calculateTotalsForPayload = () => {
    if (!request?.items) return { items: [], totalPrice: null };

    const itemsWithPrices = request.items.map((item) => {
      const itemKey = `${item.itemId}-${item.category}`;
      const raw = prices[itemKey];
      const hasPrice = raw !== undefined && raw !== "";
      const unitPrice = hasPrice ? Number(raw) : null;
      const quantity = item.requiredQty || item.shortageQty || 0;
      const totalPrice = hasPrice ? (unitPrice * quantity) : null;

      // keep original item fields but add pricePerUnit and totalPrice
      return {
        ...item,
        pricePerUnit: unitPrice,
        totalPrice: totalPrice
      };
    });

    const numericTotals = itemsWithPrices
      .map(it => it.totalPrice)
      .filter(v => v !== null && !Number.isNaN(v));

    const overallTotal = numericTotals.length ? numericTotals.reduce((s, v) => s + v, 0) : null;

    return { items: itemsWithPrices, totalPrice: overallTotal };
  };

  const calculateTotalForDisplay = () => {
    const totals = calculateTotalsForPayload();
    return totals.totalPrice !== null ? totals.totalPrice : 0;
  };

  const handleSubmit = async () => {
    if (!supplierName.trim()) {
      alert('Please enter supplier name');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // build payload including per-item total and overall total
      const { items: itemsPayload, totalPrice } = calculateTotalsForPayload();

      const quotePayload = {
        // you can add or override fields according to your app's shape
        // e.g. id will often be set by the caller / storage layer
        requestId: request?.id,
        supplierName: supplierName.trim(),
        supplierContact: supplierContact.trim() || null,
        items: itemsPayload,
        totalPrice: totalPrice,
        notes,
        status: 'pending',
        createdAt: Date.now()
      };

      // send to parent (which will store it e.g. localStorage / Firestore)
      await onSubmit(quotePayload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return Number(value).toLocaleString('en-PK', { minimumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create Quote</h2>
              <p className="text-sm text-slate-500">Request ID: {request?.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Request Info */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Site Name</p>
              <p className="text-sm font-semibold text-slate-900">{request?.siteName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">End User</p>
              <p className="text-sm font-semibold text-slate-900">{request?.endUser || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Department</p>
              <p className="text-sm font-semibold text-slate-900">{request?.department || 'N/A'}</p>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Enter supplier name"
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contact Number
              </label>
              <input
                type="text"
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value)}
                placeholder="Enter contact number"
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Items Pricing */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Item Prices</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Unit Price (PKR)
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Total Price (PKR)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {request?.items.map((item, idx) => {
                    const itemKey = `${item.itemId}-${item.category}`;
                    const raw = prices[itemKey];
                    const hasPrice = raw !== undefined && raw !== "";
                    const unitPriceNumber = hasPrice ? Number(raw) : null;
                    const quantity = item.requiredQty || item.shortageQty || 0;
                    const totalPriceNumber = hasPrice ? (unitPriceNumber * quantity) : null;

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-slate-900">{item.itemName}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {quantity} {item.uom}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium capitalize">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <input
                              type="number"
                              placeholder="0.00"
                              value={prices[itemKey] ?? ""}
                              onChange={(e) =>
                                setPrices(prev => ({ ...prev, [itemKey]: e.target.value }))
                              }
                              disabled={isSubmitting}
                              className="w-32 px-3 py-1.5 bg-white border border-slate-300 rounded text-right text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-slate-900">
                            {totalPriceNumber !== null ? formatCurrency(totalPriceNumber) : '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td colSpan="4" className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                      Total Amount:
                    </td>
                    <td className="px-4 py-3 text-right text-base font-bold text-slate-900">
                      PKR {formatCurrency(calculateTotalsForPayload().totalPrice ?? 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes or terms..."
              rows={3}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 placeholder-slate-400 resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !supplierName.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {isSubmitting ? 'Creating...' : 'Create Quote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteFormModal;
