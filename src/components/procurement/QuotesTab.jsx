import React, { useState } from 'react';
import { DollarSign, Eye, CheckCircle, X, ChevronDown, ChevronUp, Package } from 'lucide-react';

const formatCurrency = (amount) => `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

const QuotesTab = ({ quotes = [], acceptQuote, rejectQuote, setViewingQuote }) => {
  const [expandedRequests, setExpandedRequests] = useState({});
  const [processingAction, setProcessingAction] = useState(null);

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border border-amber-200",
      accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      rejected: "bg-red-50 text-red-700 border border-red-200"
    };
    return styles[status] || styles.pending;
  };

  const handleAction = async (actionFn, quoteId) => {
    if (processingAction) return;
    setProcessingAction(quoteId);
    try {
      await actionFn(quoteId);
    } finally {
      setTimeout(() => setProcessingAction(null), 500);
    }
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
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
          <DollarSign className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No Quotes Available</h3>
        <p className="text-sm text-slate-500">Supplier quotes will appear here once created</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Supplier Quotes</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {Object.keys(groupedQuotes).length} requests • {quotes.length} total quotes
            </p>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Pending</p>
              <p className="text-lg font-semibold text-amber-600">
                {quotes.filter(q => q.status === 'pending').length}
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Accepted</p>
              <p className="text-lg font-semibold text-emerald-600">
                {quotes.filter(q => q.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes by Request */}
      <div className="space-y-3">
        {Object.entries(groupedQuotes).map(([requestId, requestQuotes]) => {
          const isExpanded = expandedRequests[requestId] !== false;
          const acceptedQuote = requestQuotes.find(q => q.status === "accepted");
          const lowestPrice = Math.min(...requestQuotes.map(q => q.totalPrice));
          const highestPrice = Math.max(...requestQuotes.map(q => q.totalPrice));
          const avgPrice = requestQuotes.reduce((sum, q) => sum + q.totalPrice, 0) / requestQuotes.length;

          return (
            <div key={requestId} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              {/* Request Header */}
              <div 
                onClick={() => toggleRequest(requestId)}
                className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-slate-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Request {requestId}</h3>
                    <p className="text-xs text-slate-500">{requestQuotes.length} quotes received</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Best Price</p>
                    <p className="text-sm font-semibold text-emerald-600">{formatCurrency(lowestPrice)}</p>
                  </div>
                  {acceptedQuote && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium border border-emerald-200">
                      Accepted
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Quotes Table */}
              {isExpanded && (
                <div className="border-t border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Quote ID
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Supplier
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Total Price
                          </th>
                          <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {requestQuotes.map((quote) => (
                          <tr 
                            key={quote.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-slate-900">{quote.id}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-slate-900">{quote.supplierName}</p>
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
                            <td className="px-4 py-3">
                              <span className="text-sm text-slate-600">{quote.supplierContact || 'N/A'}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {formatCurrency(quote.totalPrice)}
                                </p>
                                {quote.totalPrice === lowestPrice && requestQuotes.length > 1 && (
                                  <span className="text-xs font-medium text-emerald-600">Lowest Price</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">
                                {quote.items.length}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${getStatusStyle(quote.status)}`}>
                                {quote.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setViewingQuote(quote)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="View Details"
                                  disabled={processingAction !== null}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {quote.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleAction(acceptQuote, quote.id)}
                                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Accept Quote"
                                      disabled={processingAction !== null}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleAction(rejectQuote, quote.id)}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Reject Quote"
                                      disabled={processingAction !== null}
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
                  </div>

                  {/* Price Summary */}
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-3">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-slate-500">Lowest: </span>
                          <span className="text-emerald-600 font-semibold">
                            {formatCurrency(lowestPrice)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Highest: </span>
                          <span className="text-red-600 font-semibold">
                            {formatCurrency(highestPrice)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Average: </span>
                          <span className="text-blue-600 font-semibold">
                            {formatCurrency(avgPrice)}
                          </span>
                        </div>
                      </div>
                      {acceptedQuote && (
                        <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded border border-emerald-200 font-medium text-xs">
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
    </div>
  );
};

export default QuotesTab;