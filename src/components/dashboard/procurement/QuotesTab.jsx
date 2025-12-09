import React, { useState } from 'react';
import { DollarSign, Eye, CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function QuotesTab({ quotes, acceptQuote, rejectQuote, setViewingQuote }) {
  const [expandedRequests, setExpandedRequests] = useState({});

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30",
      accepted: "bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30",
      rejected: "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg shadow-red-500/30"
    };
    return styles[status] || styles.pending;
  };

  // Group quotes by request ID
  const groupedQuotes = quotes.reduce((acc, quote) => {
    if (!acc[quote.requestId]) {
      acc[quote.requestId] = [];
    }
    acc[quote.requestId].push(quote);
    return acc;
  }, {});

  const toggleRequest = (requestId) => {
    setExpandedRequests(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full">
            <DollarSign className="w-20 h-20 text-emerald-500" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-700 mb-2">No Quotes Yet</h3>
        <p className="text-slate-500">Created quotes will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Supplier Quotes</h2>
        <p className="text-slate-600 mt-1">Grouped by warehouse requests • {quotes.length} total quotes</p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedQuotes).map(([requestId, requestQuotes]) => {
          const isExpanded = expandedRequests[requestId] !== false; // Default expanded
          const acceptedQuote = requestQuotes.find(q => q.status === "accepted");
          const pendingCount = requestQuotes.filter(q => q.status === "pending").length;
          const rejectedCount = requestQuotes.filter(q => q.status === "rejected").length;
          
          return (
            <div 
              key={requestId} 
              className="border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {/* Request Header */}
              <div 
                onClick={() => toggleRequest(requestId)}
                className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 px-6 py-4 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Request: {requestId}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-slate-600">
                          {requestQuotes.length} Quote{requestQuotes.length > 1 ? 's' : ''}
                        </span>
                        {acceptedQuote && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-300">
                            ✓ 1 Accepted
                          </span>
                        )}
                        {pendingCount > 0 && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-300">
                            {pendingCount} Pending
                          </span>
                        )}
                        {rejectedCount > 0 && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-300">
                            {rejectedCount} Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Best Price</p>
                      <p className="text-xl font-black text-emerald-600">
                        {formatCurrency(Math.min(...requestQuotes.map(q => q.totalPrice)))}
                      </p>
                    </div>
                    <button className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quotes Table */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Quote ID</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Supplier</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Total Price</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {requestQuotes.map((quote, index) => (
                        <tr 
                          key={quote.id}
                          className={`hover:bg-emerald-50/50 transition-all duration-200 ${
                            quote.status === 'accepted' ? 'bg-emerald-50/30' : 
                            index % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-slate-900">{quote.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{quote.supplierName}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(quote.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600">{quote.supplierContact || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-lg font-black text-emerald-600">{formatCurrency(quote.totalPrice)}</p>
                              {quote.totalPrice === Math.min(...requestQuotes.map(q => q.totalPrice)) && requestQuotes.length > 1 && (
                                <span className="text-xs font-bold text-emerald-600">🏆 Lowest</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-300">
                              {quote.items.length} items
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${getStatusStyle(quote.status)}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setViewingQuote(quote)}
                                className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {quote.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => acceptQuote(quote.id)}
                                    className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                    title="Accept Quote"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => rejectQuote(quote.id)}
                                    className="p-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                    title="Reject Quote"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Price Comparison Footer */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-t-2 border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-slate-600 font-semibold">Lowest: </span>
                          <span className="text-emerald-600 font-black text-lg">
                            {formatCurrency(Math.min(...requestQuotes.map(q => q.totalPrice)))}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-semibold">Highest: </span>
                          <span className="text-red-600 font-black text-lg">
                            {formatCurrency(Math.max(...requestQuotes.map(q => q.totalPrice)))}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600 font-semibold">Average: </span>
                          <span className="text-blue-600 font-black text-lg">
                            {formatCurrency(requestQuotes.reduce((sum, q) => sum + q.totalPrice, 0) / requestQuotes.length)}
                          </span>
                        </div>
                      </div>
                      {acceptedQuote && (
                        <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg">
                          Selected: {acceptedQuote.supplierName} • {formatCurrency(acceptedQuote.totalPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-xl">
          <p className="text-sm font-semibold opacity-90 mb-1">Total Requests</p>
          <p className="text-3xl font-black">{Object.keys(groupedQuotes).length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
          <p className="text-sm font-semibold opacity-90 mb-1">Total Quotes</p>
          <p className="text-3xl font-black">{quotes.length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-xl">
          <p className="text-sm font-semibold opacity-90 mb-1">Pending Review</p>
          <p className="text-3xl font-black">{quotes.filter(q => q.status === 'pending').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-xl">
          <p className="text-sm font-semibold opacity-90 mb-1">Accepted</p>
          <p className="text-3xl font-black">{quotes.filter(q => q.status === 'accepted').length}</p>
        </div>
      </div>
    </div>
  );
}