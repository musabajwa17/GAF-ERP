'use client'
import React, { useEffect, useState } from 'react';
import { ShoppingCart, FileText, DollarSign, CheckCircle } from 'lucide-react';
import Toast from '../../components/procurement/Toast';
import RequestsTab from '../../components/procurement/RequestTab';
import QuotesTab from '../../components/procurement/QuotesTab';
import PurchasesTab from '../../components/procurement/PurchaseTab';
import QuoteFormModal from '../../components/procurement/create_quote';
import PurchaseFormModal from '../../components/procurement/PurchaseForm';
import RequestDetailModal from '../../components/procurement/RequestDetailModal';
import QuoteDetailModal from '../../components/procurement/QuotesDetialsModal';
import PurchaseDetailModal from '../../components/procurement/PurchaseDetailsModal';

const STORAGE_KEYS = {
  PROC_REQUESTS: "procurement_requests_v2",
  QUOTES: "quotes_v1",
  PURCHASES: "purchases_v1",
};

const uid = (prefix = "id") => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export default function ProcurementOfficerModule() {
  const [requests, setRequests] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  
  const [viewingRequest, setViewingRequest] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);
  const [viewingPurchase, setViewingPurchase] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const reqs = localStorage.getItem(STORAGE_KEYS.PROC_REQUESTS);
    const quots = localStorage.getItem(STORAGE_KEYS.QUOTES);
    const purs = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    if (reqs) setRequests(JSON.parse(reqs));
    if (quots) setQuotes(JSON.parse(quots));
    if (purs) setPurchases(JSON.parse(purs));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROC_REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  const updateRequestStatus = (requestId, status) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    setToast({ message: `Request status updated to ${status}`, type: "success" });
  };

 const createQuote = (quoteData) => {
  // basic validation
  if (!quoteData || !quoteData.supplierName || !quoteData.supplierName.trim()) {
    setToast({ message: "Enter supplier name", type: "error" });
    return;
  }

  // prefer requestId from payload, fallback to selectedRequestId
  const requestId = quoteData.requestId || selectedRequestId;
  const request = requests.find(r => r.id === requestId);
  if (!request) {
    setToast({ message: "Request not found", type: "error" });
    return;
  }

  // build quoteItems in a robust way supporting both shapes
  let totalPrice = 0;
  let quoteItems = [];

  if (Array.isArray(quoteData.items) && quoteData.items.length) {
    // modal already sent items (each may contain pricePerUnit/totalPrice)
    quoteItems = quoteData.items.map((it) => {
      const quantity = it.requiredQty || it.shortageQty || it.qty || 0;
      const pricePerUnit = (it.pricePerUnit !== undefined && it.pricePerUnit !== null)
        ? Number(it.pricePerUnit)
        : 0;
      const itemTotal = (it.totalPrice !== undefined && it.totalPrice !== null)
        ? Number(it.totalPrice)
        : pricePerUnit * quantity;

      totalPrice += (Number.isFinite(itemTotal) ? itemTotal : 0);

      return {
        ...it,
        pricePerUnit,
        totalPrice: Number.isFinite(itemTotal) ? itemTotal : 0
      };
    });
  } else if (quoteData.prices && typeof quoteData.prices === 'object') {
    // legacy: build items from original request using quoteData.prices map
    quoteItems = request.items.map((item) => {
      const key = `${item.itemId}-${item.category}`;
      const pricePerUnit = Number(quoteData.prices[key]) || 0;
      const quantity = item.requiredQty || item.shortageQty || 0;
      const itemTotal = pricePerUnit * quantity;
      totalPrice += itemTotal;
      return { ...item, pricePerUnit, totalPrice: itemTotal };
    });
  } else {
    // no pricing provided — create items with zeroes
    quoteItems = request.items.map((item) => {
      return { ...item, pricePerUnit: 0, totalPrice: 0 };
    });
    totalPrice = 0;
  }

  // if payload included an overall totalPrice, prefer/validate it (optional)
  if (quoteData.totalPrice !== undefined && quoteData.totalPrice !== null) {
    const numeric = Number(quoteData.totalPrice);
    if (!Number.isNaN(numeric)) {
      totalPrice = numeric; // trust caller if numeric
    }
  }

  const quote = {
    id: uid("QT"),
    requestId,
    supplierName: quoteData.supplierName.trim(),
    supplierContact: (quoteData.supplierContact || "").trim(),
    items: quoteItems,
    totalPrice,
    notes: (quoteData.notes || "").trim(),
    status: "pending",
    createdAt: Date.now(),
  };

  setQuotes(prev => [quote, ...prev]);
  setShowQuoteForm(false);
  setSelectedRequestId("");
  setToast({ message: `Quote created for ${quote.supplierName}`, type: "success" });
};


  const acceptQuote = (quoteId) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) return { ...q, status: "accepted" };
      if (q.requestId === quote.requestId && q.id !== quoteId) return { ...q, status: "rejected" };
      return q;
    }));
    updateRequestStatus(quote.requestId, "approved");
    setToast({ message: "Quote accepted", type: "success" });
  };

  const rejectQuote = (quoteId) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: "rejected" } : q));
    setToast({ message: "Quote rejected", type: "info" });
  };

  const createPurchase = (purchaseData) => {
    const quote = quotes.find(q => q.id === selectedQuoteId);
    if (!quote || quote.status !== "accepted") {
      setToast({ message: "Only accepted quotes can be purchased", type: "error" });
      return;
    }

    // Check if purchase already exists for this request
    const existingPurchase = purchases.find(p => p.requestId === quote.requestId);
    if (existingPurchase) {
      setToast({ message: "Purchase already recorded for this request", type: "error" });
      return;
    }

    const purchase = {
      id: uid("PUR"),
      requestId: quote.requestId,
      quoteId: selectedQuoteId,
      supplierName: quote.supplierName,
      supplierContact: quote.supplierContact,
      items: quote.items,
      totalPrice: quote.totalPrice,
      paymentStatus: purchaseData.paymentStatus,
      amountPaid: purchaseData.amountPaid,
      paymentDate: purchaseData.paymentDate,
      notes: purchaseData.notes.trim(),
      createdAt: Date.now(),
      attachment: null
    };

    setPurchases(prev => [purchase, ...prev]);
    updateRequestStatus(quote.requestId, "dispatched");
    setSelectedQuoteId("");
    setShowPurchaseForm(false);
    setToast({ message: "Purchase recorded & request dispatched", type: "success" });
  };

  const updatePurchase = (purchaseId, updates) => {
    setPurchases(prev => prev.map(p => 
      p.id === purchaseId ? { ...p, ...updates } : p
    ));
    setToast({ message: "Purchase updated successfully", type: "success" });
  };

  const handleViewPurchase = (purchase) => {
    setViewingPurchase(purchase);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header */}
      <div className="bg-white border-b-2 border-emerald-200 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Procurement Officer</h1>
              <p className="text-sm text-slate-600 mt-1">Manage requests, quotes & purchases seamlessly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 border border-slate-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "requests"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 transform scale-105"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Requests</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "requests" ? "bg-white/20" : "bg-slate-200 text-slate-700"
              }`}>
                {requests.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("quotes")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "quotes"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50 transform scale-105"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Quotes</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "quotes" ? "bg-white/20" : "bg-slate-200 text-slate-700"
              }`}>
                {quotes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "purchases"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 transform scale-105"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Purchases</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "purchases" ? "bg-white/20" : "bg-slate-200 text-slate-700"
              }`}>
                {purchases.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "requests" && (
          <RequestsTab
            requests={requests}
            quotes={quotes}
            purchases={purchases}
            updateRequestStatus={updateRequestStatus}
            setViewingRequest={setViewingRequest}
            setSelectedRequestId={setSelectedRequestId}
            setShowQuoteForm={setShowQuoteForm}
            setSelectedQuoteId={setSelectedQuoteId}
            setShowPurchaseForm={setShowPurchaseForm}
          />
        )}

        {activeTab === "quotes" && (
          <QuotesTab
            quotes={quotes}
            acceptQuote={acceptQuote}
            rejectQuote={rejectQuote}
            setViewingQuote={setViewingQuote}
          />
        )}

        {activeTab === "purchases" && (
          <PurchasesTab 
            purchases={purchases}
            onUpdatePurchase={updatePurchase}
            onViewPurchase={handleViewPurchase}
          />
        )}
      </div>

      {/* Modals */}
      {showQuoteForm && selectedRequestId && (
        <QuoteFormModal
          request={requests.find(r => r.id === selectedRequestId)}
          onClose={() => { setShowQuoteForm(false); setSelectedRequestId(""); }}
          onSubmit={createQuote}
        />
      )}

      {showPurchaseForm && selectedQuoteId && (
        <PurchaseFormModal
          quote={quotes.find(q => q.id === selectedQuoteId)}
          onClose={() => setShowPurchaseForm(false)}
          onSubmit={createPurchase}
        />
      )}

      {viewingRequest && (
        <RequestDetailModal
          request={viewingRequest}
          onClose={() => setViewingRequest(null)}
        />
      )}

      {viewingQuote && (
        <QuoteDetailModal
          quote={viewingQuote}
          onClose={() => setViewingQuote(null)}
        />
      )}

      {viewingPurchase && (
        <PurchaseDetailModal
          purchase={viewingPurchase}
          onClose={() => setViewingPurchase(null)}
        />
      )}
    </div>
  );
}