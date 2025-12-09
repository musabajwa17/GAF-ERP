import React from 'react';
import { ShoppingCart, Eye, Plus, CheckCircle, ChevronDown } from 'lucide-react';

export default function RequestsTab({ 
  requests, 
  quotes, 
  updateRequestStatus, 
  setViewingRequest, 
  setSelectedRequestId, 
  setShowQuoteForm,
  setSelectedQuoteId,
  setShowPurchaseForm,
  purchases
}) {
  const getStatusStyle = (status) => {
    const styles = {
      pending: {
        bg: "bg-gradient-to-r from-amber-400 to-amber-500",
        text: "text-white",
        shadow: "shadow-lg shadow-amber-500/30",
        icon: "🕐"
      },
      approved: {
        bg: "bg-gradient-to-r from-emerald-400 to-emerald-500",
        text: "text-white",
        shadow: "shadow-lg shadow-emerald-500/30",
        icon: "✓"
      },
      dispatched: {
        bg: "bg-gradient-to-r from-blue-400 to-blue-500",
        text: "text-white",
        shadow: "shadow-lg shadow-blue-500/30",
        icon: "🚚"
      }
    };
    return styles[status] || styles.pending;
  };

  const StatusBadge = ({ status, onChange, requestId }) => {
    const style = getStatusStyle(status);
    
    return (
      <div className="relative group/status">
        <div className={`${style.bg} ${style.text} ${style.shadow} px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer transition-all duration-300 hover:scale-105 flex items-center gap-2 min-w-[130px] justify-center`}>
          <span>{style.icon}</span>
          <span>{status}</span>
          <ChevronDown className="w-3 h-3 group-hover/status:rotate-180 transition-transform duration-300" />
        </div>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all duration-300 z-50">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 overflow-hidden min-w-[160px] transform origin-top scale-95 group-hover/status:scale-100 transition-transform duration-300">
            <button
              onClick={() => onChange(requestId, 'pending')}
              className={`w-full px-4 py-3 text-left font-semibold text-sm transition-all duration-200 flex items-center gap-3 ${
                status === 'pending' 
                  ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500' 
                  : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              <span className="text-lg">🕐</span>
              <span>Pending</span>
            </button>
            <button
              onClick={() => onChange(requestId, 'approved')}
              className={`w-full px-4 py-3 text-left font-semibold text-sm transition-all duration-200 flex items-center gap-3 ${
                status === 'approved' 
                  ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' 
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <span className="text-lg">✓</span>
              <span>Approved</span>
            </button>
            <button
              onClick={() => onChange(requestId, 'dispatched')}
              className={`w-full px-4 py-3 text-left font-semibold text-sm transition-all duration-200 flex items-center gap-3 ${
                status === 'dispatched' 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <span className="text-lg">🚚</span>
              <span>Dispatched</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full">
            <ShoppingCart className="w-20 h-20 text-slate-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-700 mb-2">No Requests Yet</h3>
        <p className="text-slate-500">Warehouse requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Warehouse Requests</h2>
        <p className="text-slate-600 mt-1">Review and process incoming requests</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {requests.map(req => {
          const reqQuotes = quotes.filter(q => q.requestId === req.id);
          const acceptedQuote = reqQuotes.find(q => q.status === "accepted");
          const hasPurchase = purchases && purchases.some(p => p.requestId === req.id);
          
          return (
            <div 
              key={req.id} 
              className="group border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 relative overflow-visible"
            >
              <div className="flex justify-between items-start mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                    {req.id}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <StatusBadge 
                  status={req.status} 
                  onChange={updateRequestStatus}
                  requestId={req.id}
                />
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="font-semibold">{req.items.length} items requested</span>
                </div>
                {reqQuotes.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-semibold">{reqQuotes.length} quote(s) created</span>
                  </div>
                )}
                {hasPurchase && (
                  <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    <span className="font-semibold">Purchase recorded ✓</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setViewingRequest(req)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  View Items
                </button>
                {req.status === "pending" && !acceptedQuote && (
                  <button 
                    onClick={() => { setSelectedRequestId(req.id); setShowQuoteForm(true); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Create Quote
                  </button>
                )}
                {acceptedQuote && req.status !== "dispatched" && !hasPurchase && (
                  <button 
                    onClick={() => { 
                      setSelectedQuoteId(acceptedQuote.id); 
                      setShowPurchaseForm(true); 
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Record Purchase
                  </button>
                )}
                {hasPurchase && (
                  <div className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-center shadow-lg">
                    ✓ Purchase Completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}