"use client"
import React, { useEffect, useState } from 'react';
import { X, Trash2, Calendar, Package, Hash } from 'lucide-react';

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
    { id: "chlorioyrifos_2", name: "Chlorioyrifos" }, // duplicate on your list kept as separate id
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
    color: "amber"
  },
  { 
    key: "rabi", 
    label: "Rabi",
    labelUrdu: "ربیع",
    description: "Nov - Mar",
    color: "blue"
  }
];

const FarmerRequestFormModal = ({ onClose, onCreate, currentSeason }) => {
  const [farmerName, setFarmerName] = useState("");
  const [season, setSeason] = useState(currentSeason || "kharif");
  const [requestItems, setRequestItems] = useState([]);
  const [category, setCategory] = useState("fertilizers");
  const [itemId, setItemId] = useState(PRESET["fertilizers"][0].id);
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("bags");

  useEffect(() => {
    const first = PRESET[category]?.[0];
    if (first) setItemId(first.id);
  }, [category]);

  const addItem = () => {
    const item = PRESET[category].find(i => i.id === itemId);
    if (!item || qty <= 0) return;

    setRequestItems(prev => [...prev, {
      category,
      itemId,
      name: item.name,
      qty,
      unit,
    }]);
    setQty(1);
  };

  const handleSubmit = () => {
    if (!farmerName.trim() || requestItems.length === 0) return;
    onCreate(farmerName.trim(), season, requestItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">New Farmer Request</h2>
            <p className="text-sm text-slate-500 mt-0.5">Fill in request details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Farmer Name</label>
            <input 
              type="text" 
              value={farmerName} 
              onChange={(e) => setFarmerName(e.target.value)} 
              placeholder="Enter farmer name" 
              className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium" 
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Calendar className="w-4 h-4 text-slate-500" />
              Season
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SEASONS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSeason(s.key)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    season === s.key
                      ? s.color === 'amber'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-sm ${
                      season === s.key
                        ? s.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                        : 'text-slate-700'
                    }`}>
                      {s.label}
                    </span>
                    {season === s.key && (
                      <div className={`w-4 h-4 rounded-full ${
                        s.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{s.labelUrdu} • {s.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200"></div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-600" />
              Add Items
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 text-sm font-medium"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Item</label>
                <select 
                  value={itemId} 
                  onChange={(e) => setItemId(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 text-sm font-medium"
                >
                  {PRESET[category].map(it => (
                    <option key={it.id} value={it.id}>{it.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  Quantity
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setQty(q => Math.max(1, q - 1))} 
                    className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <input 
                    type="number" 
                    min={1} 
                    value={qty} 
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} 
                    className="flex-1 px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg text-center font-semibold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" 
                  />
                  <button 
                    onClick={() => setQty(q => q + 1)} 
                    className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit</label>
                <select 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)} 
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 text-sm font-medium"
                >
                  {UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={addItem} 
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all text-sm"
            >
              Add Item
            </button>
          </div>

          {requestItems.length > 0 && (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">
                Items in Request ({requestItems.length})
              </h4>
              <div className="space-y-2">
                {requestItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-3 py-2.5 bg-white border border-slate-200 rounded-lg">
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                      <span className="text-xs text-slate-500 ml-2">
                        {item.qty} {item.unit} • {item.category}
                      </span>
                    </div>
                    <button 
                      onClick={() => setRequestItems(prev => prev.filter((_, i) => i !== idx))} 
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleSubmit} 
            disabled={!farmerName.trim() || requestItems.length === 0}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
          >
            Create Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerRequestFormModal;