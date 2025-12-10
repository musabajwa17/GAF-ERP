import React from 'react';
import { X, FileText, Package, Calendar, User, Building2, MapPin } from 'lucide-react';

const RequestDetailModal = ({ request, onClose }) => {
  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dispatched: "bg-blue-50 text-blue-700 border border-blue-200"
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Request Details</h2>
              <p className="text-sm text-slate-500">{request?.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Request Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Site Name</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{request?.siteName || 'N/A'}</p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">End User</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{request?.endUser || 'N/A'}</p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Department</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{request?.department || 'N/A'}</p>
            </div>
          </div>

          {/* Status and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Status</p>
              <span className={`inline-flex px-3 py-1.5 rounded text-sm font-medium capitalize ${getStatusStyle(request?.status)}`}>
                {request?.status}
              </span>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Created At</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(request?.createdAt).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-900">Requested Items</h3>
              <span className="ml-auto px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                {request?.items?.length || 0} items
              </span>
            </div>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Item Name
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Item ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {request?.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-slate-900">{item.itemName}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                          {item.requiredQty || item.shortageQty} {item.uom}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-600 font-mono">{item.itemId}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Notes if available */}
          {request?.shortNote && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-1">Note</p>
              <p className="text-sm text-slate-700">{request.shortNote}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;