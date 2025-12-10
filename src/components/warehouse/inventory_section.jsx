"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Save, X, Package, Archive, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

// Constants
const PRESET = {
  fertilizers: [
    { id: "urea", name: "Urea" },
    { id: "dap", name: "DAP" },
    { id: "can_guwara", name: "CAN Guwara" },
    { id: "nem_phosphate", name: "NEM Phosphate" },
    { id: "sop", name: "SOP" },
    { id: "sulfur_fert", name: "Sulfur" },
    { id: "np", name: "NP" },
    { id: "chilated_zinc", name: "Chilated Zinc" }
  ],
  pesticides: [
    { id: "crop_plus", name: "Crop plus" },
    { id: "atlantis_super", name: "Atlantis super" },
    { id: "rider_supee", name: "Rider supee" },
    { id: "chemico", name: "Chemico" },
    { id: "flisto_gold", name: "Flisto Gold" },
    { id: "trofizen_super", name: "Trofizen super" },
    { id: "pro_maxica", name: "Pro maxica" },
    { id: "cyto_start", name: "Cyto start" },
    { id: "pro_start", name: "Pro start" },
    { id: "fenate", name: "Fenate" },
    { id: "sulfur_pest", name: "Sulfur" },
    { id: "areena", name: "Areena" },
    { id: "run_out", name: "Run out" },
    { id: "fipronill", name: "Fipronill" },
    { id: "flythrine", name: "Flythrine" },
    { id: "glyphosate", name: "Glyphosate" },
    { id: "hombrey", name: "Hombrey" },
    { id: "flonicamid", name: "Flonicamid" },
    { id: "recall", name: "Recall" },
    { id: "dap_ghol", name: "DAP Ghol" },
    { id: "abamectin", name: "Abamectin" },
    { id: "chlorioyrifos_1", name: "Chlorioyrifos" },
    { id: "clark", name: "Clark" },
    { id: "chlorioyrifos_2", name: "Chlorioyrifos" },
    { id: "seed_treatment", name: "Seed treatment" },
    { id: "bio_zoste", name: "Bio zoste" }
  ],
  produce: [
    { id: "wheat", name: "Wheat" },
    { id: "fennel", name: "Fennel" },
    { id: "mungbean", name: "Mungbean" },
    { id: "cotton_produce", name: "Cotton produce / Munds" }
  ],
  seeds: [
    { id: "maize", name: "Maize" },
    { id: "pearl_millet", name: "Pearl Millet" },
    { id: "guar_seed", name: "Guar" },
    { id: "basil", name: "Basil" },
    { id: "spinach", name: "Spinach" },
    { id: "cotton_seed", name: "Cotton seed" },
    { id: "rhodes_grass_seed", name: "Rhodes grass seed" },
    { id: "wheat_seed", name: "Wheat seed" },
    { id: "oat_seed", name: "Oat seed" }
  ],
  other: [
    { id: "spray_machines", name: "Spray Machines" },
    { id: "kasi", name: "Kasi" },
    { id: "hand_trolley", name: "Hand trolley" },
    { id: "pali", name: "Pali" },
    { id: "weighing_scale", name: "Weighing scale" },
    { id: "axe", name: "AXE" },
    { id: "tarpulin", name: "Tarpulin" },
    { id: "manual_seeder", name: "Manual seeder" },
    { id: "polythene_bags", name: "Polythene bags" },
    { id: "cement", name: "Cement" },
    { id: "insulation_cable_red", name: "Insulation cable Red" },
    { id: "insulation_cable_black", name: "Insulation cable Black" },
    { id: "cable_tie", name: "Cable Tie" },
    { id: "dc_breaker", name: "DC breaker" },
    { id: "solution_tape", name: "Solution Tape" },
    { id: "invertor_37kw", name: "Invertor 37 kw" },
    { id: "nut_bullets", name: "NUT & Bullets" },
    { id: "flexible_pipe", name: "Flexible pipe" },
    { id: "rwala_bullets", name: "Rwala bullets" },
    { id: "solar_panels", name: "Solar panels" },
    { id: "cable", name: "Cable" }
  ]
};

const CATEGORIES = [
  { key: "fertilizers", label: "Fertilizers" },
  { key: "pesticides", label: "Pesticides" },
  { key: "produce", label: "Produce" },
  { key: "seeds", label: "Seeds" },
  { key: "other", label: "Other" }
];

const UNITS = ["bags", "kg", "Bottels", "tons", "units"];

const SEASONS = [
  { 
    key: "kharif", 
    label: "Kharif",
    labelUrdu: "خریف",
    description: "Apr - Oct",
    color: "amber",
    next: "rabi"
  },
  { 
    key: "rabi", 
    label: "Rabi",
    labelUrdu: "ربیع",
    description: "Nov - Mar",
    color: "blue",
    next: "kharif"
  }
];

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Storage helper functions



// Add Inventory Modal Component
const AddInventoryModal = ({ onClose, onAdd, currentSeason }) => {
  const [season, setSeason] = useState(currentSeason || "kharif");
  const [category, setCategory] = useState("fertilizers");
  const [itemId, setItemId] = useState(PRESET.fertilizers[0].id);
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("bags");

  useEffect(() => {
    const first = PRESET[category]?.[0];
    if (first) setItemId(first.id);
  }, [category]);

  const handleSubmit = () => {
    onAdd({ season, category, itemId, qty, unit });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Inventory Item</h2>
            <p className="text-sm text-slate-500 mt-0.5">Fill in the details below</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Calendar className="w-4 h-4 text-slate-500" />
              Growing Season
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SEASONS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSeason(s.key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    season === s.key
                      ? s.color === 'amber'
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${
                      season === s.key
                        ? s.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                        : 'text-slate-700'
                    }`}>
                      {s.label}
                    </span>
                    {season === s.key && (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        s.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-1">{s.labelUrdu}</p>
                  <p className="text-xs font-medium text-slate-600">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Package className="w-4 h-4 text-slate-500" />
                Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 text-sm font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>





            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                Unit
              </label>
              <select 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)} 
                className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 text-sm font-medium capitalize"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>








          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Item Name
            </label>
            <select 
              value={itemId} 
              onChange={(e) => setItemId(e.target.value)} 
              className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 text-sm font-medium"
            >
              {PRESET[category].map(it => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              Quantity
            </label>
            <div className="flex gap-2">
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))} 
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-lg text-slate-700 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <input 
                type="number" 
                min={1} 
                value={qty} 
                onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} 
                className="flex-1 px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-center font-semibold text-lg text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
              />
              <button 
                onClick={() => setQty(q => q + 1)} 
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-lg text-slate-700 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className={`mt-5 p-4 rounded-xl border-2 ${
            season === 'kharif' 
              ? 'bg-amber-50 border-amber-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Summary</p>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-900 mb-1">
                  {PRESET[category].find(i => i.id === itemId)?.name || 'N/A'}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">{qty}</span> {unit} • <span className="font-semibold">{SEASONS.find(s => s.key === season)?.label}</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                season === 'kharif'
                  ? 'bg-amber-200 text-amber-800'
                  : 'bg-blue-200 text-blue-800'
              }`}>
                {category}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Add to Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Inventory Section Component
const InventorySection = ({ inventory, setInventory, setToast }) => {
  const [currentSeason, setCurrentSeason] = useState("kharif");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState(0);
  const [showCarryForward, setShowCarryForward] = useState(false);
  const [loading, setLoading] = useState(true);

 


  // Save inventory and season to storage whenever they change

  const showToastMessage = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, [setToast]);

  // Add to inventory with season support
  const addToInventory = useCallback(({ season, category, itemId, qty, unit }) => {
    const item = PRESET[category]?.find(i => i.id === itemId);
    if (!item) return;

    setInventory(prev => {
      const existing = prev.find(
        r => r.itemId === itemId && r.category === category && r.unit === unit && r.season === season
      );

      if (existing) {
        return prev.map(r => 
          r.id === existing.id 
            ? { ...r, qty: r.qty + qty, updatedAt: Date.now() }
            : r
        );
      } else {
        const newRow = {
          id: uid("inv"),
          season,
          category,
          itemId,
          name: item.name,
          unit,
          qty,
          updatedAt: Date.now(),
        };
        return [newRow, ...prev];
      }
    });
    
    showToastMessage("Item added to inventory");
  }, [setInventory, showToastMessage]);

  // Carry forward inventory to next season
  const carryForwardInventory = useCallback(() => {
    const currentSeasonData = SEASONS.find(s => s.key === currentSeason);
    const nextSeason = currentSeasonData?.next;
    
    if (!nextSeason) return;

    const itemsToCarryForward = inventory.filter(item => item.season === currentSeason && item.qty > 0);
    
    if (itemsToCarryForward.length === 0) {
      showToastMessage("No items to carry forward", "error");
      return;
    }

    const carriedItems = itemsToCarryForward.map(item => ({
      ...item,
      id: uid("inv"),
      season: nextSeason,
      updatedAt: Date.now(),
      carriedFrom: currentSeason
    }));

    setInventory(prev => [...carriedItems, ...prev]);
    setCurrentSeason(nextSeason);
    setShowCarryForward(false);
    showToastMessage(`${carriedItems.length} items carried forward to ${SEASONS.find(s => s.key === nextSeason)?.label}`);
  }, [currentSeason, inventory, setInventory, showToastMessage]);

  const saveEdit = useCallback((id) => {
    if (editQty <= 0) {
      showToastMessage("Quantity must be positive", "error");
      return;
    }
    
    setInventory(prev => prev.map(r => 
      r.id === id ? { ...r, qty: editQty, updatedAt: Date.now() } : r
    ));
    setEditingId(null);
    showToastMessage("Quantity updated");
  }, [editQty, setInventory, showToastMessage]);

  const deleteItem = useCallback((id) => {
    if (confirm("Delete this item from inventory?")) {
      setInventory(prev => prev.filter(r => r.id !== id));
      showToastMessage("Item deleted");
    }
  }, [setInventory, showToastMessage]);

  // Filter inventory by current season
  const currentSeasonInventory = inventory.filter(item => item.season === currentSeason);
  const totalItems = currentSeasonInventory.reduce((sum, item) => sum + item.qty, 0);
  const uniqueItems = currentSeasonInventory.length;

  const currentSeasonData = SEASONS.find(s => s.key === currentSeason);
  const nextSeasonData = SEASONS.find(s => s.key === currentSeasonData?.next);

 
  return (
   <div>
    <div>
      {/* Season Selector */}
      <div className="mb-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Current Season</h3>
            <p className="text-sm text-slate-600">Manage inventory for the active growing season</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {SEASONS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setCurrentSeason(s.key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    currentSeason === s.key
                      ? s.color === 'amber'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s.label} ({s.labelUrdu})
                </button>
              ))}
            </div>
            {currentSeasonInventory.length > 0 && (
              <button
                onClick={() => setShowCarryForward(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                Carry Forward
              </button>
            )}
          </div>
        </div>
      </div>

     {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        {/* Compact Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-50/50">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                currentSeason === 'kharif' 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500'
              } shadow-sm`}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-none mb-0.5">
                  {currentSeasonData?.label} Inventory
                </h2>
                <p className="text-xs text-slate-500">{currentSeasonData?.description}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
          
          {/* Compact Stats */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center">
                  <Archive className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-0.5">Items</p>
                  <p className="text-lg font-bold text-slate-900 leading-none">{uniqueItems}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-0.5">Total</p>
                  <p className="text-lg font-bold text-slate-900 leading-none">{totalItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentSeasonInventory.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-xl mb-3 border border-slate-100">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-medium text-sm">No items in {currentSeasonData?.label} inventory</p>
            <p className="text-xs text-slate-400 mt-1">Add your first item to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentSeasonInventory.map((item, idx) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          item.category === 'fertilizers' ? 'bg-green-100 text-green-700' :
                          item.category === 'pesticides' ? 'bg-red-100 text-red-700' :
                          item.category === 'produce' ? 'bg-amber-100 text-amber-700' :
                          item.category === 'seeds' ? 'bg-purple-100 text-purple-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold capitalize ${
                        item.category === 'fertilizers' ? 'bg-green-50 text-green-700 border border-green-200/50' :
                        item.category === 'pesticides' ? 'bg-red-50 text-red-700 border border-red-200/50' :
                        item.category === 'produce' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                        item.category === 'seeds' ? 'bg-purple-50 text-purple-700 border border-purple-200/50' :
                        'bg-slate-50 text-slate-700 border border-slate-200/50'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        {editingId === item.id ? (
                          <input 
                            type="number" 
                            min={1} 
                            value={editQty} 
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            className="w-20 px-2 py-1.5 border-2 border-emerald-400 bg-emerald-50 rounded-lg text-center font-bold text-sm outline-none focus:border-emerald-500" 
                          />
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-200/50 shadow-sm">
                            {item.qty}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-600 font-medium text-sm">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        {item.carriedFrom ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-[11px] font-semibold border border-purple-200/50">
                            <ArrowRight className="w-3 h-3" />
                            {SEASONS.find(s => s.key === item.carriedFrom)?.label}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-slate-50 text-slate-500 rounded-md text-[11px] font-medium border border-slate-200/50">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {editingId === item.id ? (
                          <>
                            <button 
                              onClick={() => saveEdit(item.id)} 
                              className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-all hover:scale-105 active:scale-95"
                              title="Save"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)} 
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all hover:scale-105 active:scale-95"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => { setEditingId(item.id); setEditQty(item.qty); }} 
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all hover:scale-105 active:scale-95 border border-blue-200/50"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => deleteItem(item.id)} 
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all hover:scale-105 active:scale-95 border border-red-200/50"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}
      </div>
      </div>
  
      {/* Modals */}
      {showAddForm && (
        <AddInventoryModal 
          onClose={() => setShowAddForm(false)} 
          onAdd={addToInventory}
          currentSeason={currentSeason}
        />
      )}

      {/* Carry Forward Confirmation Modal */}
      {showCarryForward && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Carry Forward Inventory</h3>
            <p className="text-slate-600 mb-6">
              This will copy all {currentSeasonInventory.length} items from <span className="font-semibold">{currentSeasonData?.label}</span> to <span className="font-semibold">{nextSeasonData?.label}</span> season and switch to the next season.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCarryForward(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={carryForwardInventory}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Carry Forward
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default InventorySection;