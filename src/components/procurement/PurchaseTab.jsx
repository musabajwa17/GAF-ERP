import React, { useState } from 'react';
import { CheckCircle, Eye, Edit2, Paperclip, Download, X } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function PurchasesTab({ purchases, onUpdatePurchase, onViewPurchase }) {
    console.log("1111")
    console.log(purchases, onUpdatePurchase,onViewPurchase)
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const getPaymentStatusStyle = (status) => {
    const styles = {
      paid: "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white",
      partial: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
      pending: "bg-gradient-to-r from-red-400 to-red-500 text-white"
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
      <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full">
            <CheckCircle className="w-20 h-20 text-purple-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-700 mb-2">No Purchases Yet</h3>
        <p className="text-slate-500">Completed purchases will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Purchase Records</h2>
        <p className="text-slate-600 mt-1">Track and manage all completed transactions</p>
      </div>
      
      <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-purple-600">
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Purchase ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Request ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Amount Paid</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Remaining</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Attachment</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y-2 divide-slate-100">
            {purchases.map((purchase, index) => {
              const remaining = purchase.totalPrice - purchase.amountPaid;
              const isEditing = editingId === purchase.id;
              
              return (
                <tr 
                  key={purchase.id} 
                  className={`hover:bg-purple-50/50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-900">{purchase.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{purchase.supplierName}</p>
                      {purchase.supplierContact && (
                        <p className="text-xs text-slate-500">{purchase.supplierContact}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600">{purchase.requestId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(purchase.totalPrice)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.amountPaid}
                        onChange={(e) => setEditData({...editData, amountPaid: Number(e.target.value)})}
                        className="w-32 px-3 py-2 border-2 border-purple-300 rounded-lg text-sm font-bold focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                      />
                    ) : (
                      <span className="text-sm font-bold text-emerald-600">{formatCurrency(purchase.amountPaid)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${remaining > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                      {formatCurrency(remaining)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <select
                        value={editData.paymentStatus}
                        onChange={(e) => setEditData({...editData, paymentStatus: e.target.value})}
                        className="px-3 py-2 border-2 border-purple-300 rounded-lg text-xs font-bold uppercase focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none cursor-pointer"
                      >
                        <option value="paid">Paid</option>
                        <option value="partial">Partial</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${getPaymentStatusStyle(purchase.paymentStatus)} shadow-lg`}>
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
                        className="px-3 py-2 border-2 border-purple-300 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                      />
                    ) : (
                      <span className="text-sm text-slate-600">
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
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-all"
                        >
                          <Download className="w-3 h-3" />
                          <span>{purchase.attachment.name.substring(0, 10)}...</span>
                        </a>
                      ) : (
                        <label className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                          <Paperclip className="w-3 h-3" />
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
                            className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            title="Save"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onViewPurchase(purchase)}
                            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(purchase)}
                            className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
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
      
      <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
        <p>Total Records: <span className="font-bold text-slate-900">{purchases.length}</span></p>
        <p>Total Value: <span className="font-bold text-purple-600">{formatCurrency(purchases.reduce((sum, p) => sum + p.totalPrice, 0))}</span></p>
      </div>
    </div>
  );
}