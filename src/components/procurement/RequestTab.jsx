import React, { useState } from 'react';
import { ShoppingCart, Eye, Plus, CheckCircle, ChevronDown, Package, FileText, TrendingUp } from 'lucide-react';
import DropdownPortal from "./dropdownportal";

const RequestsTab = ({ 
  requests = [], 
  quotes = [], 
  updateRequestStatus, 
  setViewingRequest, 
  setSelectedRequestId, 
  setShowQuoteForm,
  setSelectedQuoteId,
  setShowPurchaseForm,
  purchases = []
}) => {
  const [processingAction, setProcessingAction] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dispatched: "bg-blue-50 text-blue-700 border border-blue-200"
    };
    return styles[status] || styles.pending;
  };

  const handleStatusChange = async (requestId, newStatus) => {
    if (processingAction) return;
    setProcessingAction(requestId);
    setActiveDropdown(null);
    try {
      await updateRequestStatus(requestId, newStatus);
    } finally {
      setTimeout(() => setProcessingAction(null), 500);
    }
  };

  const handleAction = async (actionFn) => {
    if (processingAction) return;
    setProcessingAction('action');
    try {
      await actionFn();
    } finally {
      setTimeout(() => setProcessingAction(null), 500);
    }
  };
const StatusBadge = ({ status, requestId }) => {
  const isOpen = activeDropdown === requestId;
  const buttonRef = React.useRef(null);
  const [coords, setCoords] = React.useState(null);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width
      });
    }
  };

  React.useEffect(() => {
    if (isOpen) updateCoords();
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdown(isOpen ? null : requestId);
        }}
        disabled={processingAction !== null}
        className={`${getStatusStyle(status)} px-3 py-1.5 rounded text-xs font-medium capitalize flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80`}
      >
        <span>{status}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && coords && (
        <DropdownPortal>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setActiveDropdown(null)}
          />

          {/* dropdown */}
          <div
            className="absolute bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden min-w-[140px] z-[1000]"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left
            }}
          >
            <button
              onClick={() => handleStatusChange(requestId, "pending")}
              disabled={processingAction !== null}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                status === "pending"
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => handleStatusChange(requestId, "approved")}
              disabled={processingAction !== null}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                status === "approved"
                  ? "bg-emerald-50 text-emerald-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Approved
            </button>

            <button
              onClick={() => handleStatusChange(requestId, "dispatched")}
              disabled={processingAction !== null}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                status === "dispatched"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              Dispatched
            </button>
          </div>
        </DropdownPortal>
      )}
    </div>
  );
};

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
          <ShoppingCart className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No Requests Available</h3>
        <p className="text-sm text-slate-500">Warehouse requests will appear here once created</p>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    dispatched: requests.filter(r => r.status === 'dispatched').length
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Warehouse Requests</h2>
            <p className="text-sm text-slate-500 mt-0.5">Review and process incoming requests</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium mb-1">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-600 font-medium mb-1">Pending</p>
            <p className="text-2xl font-semibold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
            <p className="text-xs text-emerald-600 font-medium mb-1">Approved</p>
            <p className="text-2xl font-semibold text-emerald-600">{stats.approved}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium mb-1">Dispatched</p>
            <p className="text-2xl font-semibold text-blue-600">{stats.dispatched}</p>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Quotes
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => {
                const reqQuotes = quotes.filter(q => q.requestId === req.id);
                const acceptedQuote = reqQuotes.find(q => q.status === "accepted");
                const hasPurchase = purchases.some(p => p.requestId === req.id);
                
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">{req.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        {new Date(req.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                        {req.items.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium border border-emerald-200">
                          {reqQuotes.length}
                        </span>
                        {acceptedQuote && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={req.status} requestId={req.id} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleAction(() => setViewingRequest(req))}
                          disabled={processingAction !== null}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {req.status === "pending" && !acceptedQuote && (
                          <button 
                            onClick={() => handleAction(() => {
                              setSelectedRequestId(req.id);
                              setShowQuoteForm(true);
                            })}
                            disabled={processingAction !== null}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Create Quote"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                        
                        {acceptedQuote && !hasPurchase && (
                          <button 
                            onClick={() => handleAction(() => {
                              setSelectedQuoteId(acceptedQuote.id);
                              setShowPurchaseForm(true);
                            })}
                            disabled={processingAction !== null}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Record Purchase"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        
                        {hasPurchase && (
                          <div className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium border border-emerald-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Done
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsTab;