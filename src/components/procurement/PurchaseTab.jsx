import React, { useState } from 'react';
import { CheckCircle, Eye, Edit2, Paperclip, Download, X, ShoppingBag } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function PurchasesTab({ purchases, onUpdatePurchase, onViewPurchase }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const getPaymentStatusStyle = (status) => {
    const styles = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      partial: "bg-amber-50 text-amber-700 border-amber-200",
      pending: "bg-rose-50 text-rose-700 border-rose-200"
    };
    return styles[status] || styles.pending;
  };

  const handleEdit = (purchase) => {
    setEditingId(purchase.id);
    setEditData({
      paymentStatus: purchase.paymentStatus,
      amountPaid: purchase.amountPaid,
      paymentDate: purchase.paymentDate,
      notes: purchase.notes
    });
  };

  const handleSaveEdit = (purchaseId) => {
    onUpdatePurchase(purchaseId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleFileAttach = (purchaseId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdatePurchase(purchaseId, { 
          attachment: {
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (purchases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchases Yet</h3>
        <p className="text-sm text-gray-500">Completed purchases will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Purchase Records</h2>
        <p className="text-sm text-gray-500 mt-1">Track and manage all completed transactions</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Purchase ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Request ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Remaining</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Attachment</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.map((purchase) => {
              const remaining = purchase.totalPrice - purchase.amountPaid;
              const isEditing = editingId === purchase.id;
              
              return (
                <tr 
                  key={purchase.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{purchase.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{purchase.supplierName}</p>
                      {purchase.supplierContact && (
                        <p className="text-xs text-gray-500">{purchase.supplierContact}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-indigo-600 font-medium">{purchase.requestId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(purchase.totalPrice)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.amountPaid}
                        onChange={(e) => setEditData({...editData, amountPaid: Number(e.target.value)})}
                        className="w-32 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    ) : (
                      <span className="text-sm font-medium text-emerald-600">{formatCurrency(purchase.amountPaid)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${remaining > 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                      {formatCurrency(remaining)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <select
                        value={editData.paymentStatus}
                        onChange={(e) => setEditData({...editData, paymentStatus: e.target.value})}
                        className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      >
                        <option value="paid">Paid</option>
                        <option value="partial">Partial</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getPaymentStatusStyle(purchase.paymentStatus)}`}>
                        {purchase.paymentStatus}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.paymentDate}
                        onChange={(e) => setEditData({...editData, paymentDate: e.target.value})}
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">
                        {new Date(purchase.paymentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {purchase.attachment ? (
                        <a
                          href={purchase.attachment.data}
                          download={purchase.attachment.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-medium transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{purchase.attachment.name.substring(0, 10)}...</span>
                        </a>
                      ) : (
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-medium cursor-pointer transition-colors">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Attach</span>
                          <input
                            type="file"
                            onChange={(e) => handleFileAttach(purchase.id, e)}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </label>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(purchase.id)}
                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                            title="Save"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onViewPurchase(purchase)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(purchase)}
                            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Total Records: <span className="font-medium text-gray-900">{purchases.length}</span>
          </p>
          <p className="text-gray-600">
            Total Value: <span className="font-semibold text-indigo-600">{formatCurrency(purchases.reduce((sum, p) => sum + p.totalPrice, 0))}</span>
          </p>
        </div>
      </div>
    </div>
  );
}