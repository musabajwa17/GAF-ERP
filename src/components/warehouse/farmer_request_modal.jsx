"use client"
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Send, Calendar, Eye, X, Search, Filter, ChevronDown, Package, Building2, User, MapPin, Users, FileText, CalendarDays, Hash } from 'lucide-react';

const uid = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const SEASONS = [
  { key: "kharif", label: "Kharif", labelUrdu: "خریف", color: "amber" },
  { key: "rabi", label: "Rabi", labelUrdu: "ربیع", color: "blue" }
];

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

const DEPARTMENTS = ["Crop Operations", "Procurement", "Warehouse", "Irrigation", "Machinery Section","Maintenence"];

const SITES = ["Chappu", "Moj Gharh","MCF", "Mansoora"];
const UOM_OPTIONS = ["bags", "kg", "bottles", "tons","liters", "pieces", "boxes"];

const FarmerRequestFormModal = ({ onClose, onCreate, currentSeason }) => {
  const [department, setDepartment] = useState("Operations");
  const [endUser, setEndUser] = useState("");
  const [nameCategory, setNameCategory] = useState("");
  const [siteName, setSiteName] = useState("Main Farm");
  const [suggestedSupplier, setSuggestedSupplier] = useState("");
  const [shortNote, setShortNote] = useState("");
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [season, setSeason] = useState(currentSeason || "kharif");
  
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    serialNo: 1,
    category: "fertilizers",
    itemId: PRESET["fertilizers"][0].id,
    requiredQty: 1,
    uom: "bags",
    remarks: ""
  });

  // Update itemId when category changes
  React.useEffect(() => {
    const firstItem = PRESET[currentItem.category]?.[0];
    if (firstItem) {
      setCurrentItem(prev => ({ ...prev, itemId: firstItem.id }));
    }
  }, [currentItem.category]);

 const addItem = () => {
  const selectedItem = PRESET[currentItem.category].find(i => i.id === currentItem.itemId);
  if (!selectedItem || currentItem.requiredQty <= 0) return;
  
  // Check if item already exists (same category and itemId)
  const existingItemIndex = items.findIndex(
    item => item.category === currentItem.category && item.itemId === currentItem.itemId
  );
  
  if (existingItemIndex !== -1) {
    // Item exists, increment quantity
    setItems(prev => prev.map((item, idx) => 
      idx === existingItemIndex 
        ? { ...item, requiredQty: item.requiredQty + currentItem.requiredQty }
        : item
    ));
  } else {
    // New item, add to list
    setItems(prev => [...prev, { 
      ...currentItem,
      itemName: selectedItem.name
    }]);
  }
  
  setCurrentItem(prev => ({
    serialNo: prev.serialNo + 1,
    category: "fertilizers",
    itemId: PRESET["fertilizers"][0].id,
    requiredQty: 1,
    uom: "bags",
    remarks: ""
  }));
};
const editItem = (index, newQty) => {
  if (newQty <= 0) return;
  setItems(prev => prev.map((item, idx) => 
    idx === index ? { ...item, requiredQty: newQty } : item
  ));
};
const removeItem = (index) => {
  setItems(prev => prev.filter((_, i) => i !== index));
  // Recalculate serial numbers
  setCurrentItem(prev => ({
    ...prev,
    serialNo: items.length // Will be current length minus the deleted item
  }));
};
  const handleSubmit = () => {
    if (!endUser.trim() || !nameCategory.trim() || items.length === 0) {
      alert("Please fill all required fields and add at least one item");
      return;
    }

    const request = {
      department,
      endUser: endUser.trim(),
      nameCategory: nameCategory.trim(),
      siteName,
      suggestedSupplier: suggestedSupplier.trim(),
      shortNote: shortNote.trim(),
      requestDate,
      season,
      items
    };

    onCreate(request);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Purchase Request Form</h2>
            <p className="text-sm text-slate-600 mt-0.5">Fill in all required fields</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header Information - 3 columns layout */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Request Information
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Department */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* End User */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    End-User <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={endUser}
                    onChange={(e) => setEndUser(e.target.value)}
                    placeholder="Enter end-user name"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Name/Category */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-500" />
                    Name/Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameCategory}
                    onChange={(e) => setNameCategory(e.target.value)}
                    placeholder="e.g., Farm Use, Office Use.."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Site Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    Site Name
                  </label>
                  <select
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {SITES.map(site => (
                      <option key={site} value={site}>{site}</option>
                    ))}
                  </select>
                </div>

                {/* Suggested Supplier */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Suggested Supplier
                  </label>
                  <input
                    type="text"
                    value={suggestedSupplier}
                    onChange={(e) => setSuggestedSupplier(e.target.value)}
                    placeholder="Enter supplier name"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Short Note - Full Width */}
              <div className="mt-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Short Note
                </label>
                <textarea
                  value={shortNote}
                  onChange={(e) => setShortNote(e.target.value)}
                  placeholder="Add any additional notes or special instructions..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Season Selection */}
              <div className="mt-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Season
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {SEASONS.map(s => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSeason(s.key)}
                      className={`p-2.5 rounded-lg border-2 transition-all text-left ${
                        season === s.key
                          ? s.color === 'amber'
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${
                          season === s.key
                            ? s.color === 'amber' ? 'text-amber-700' : 'text-blue-700'
                            : 'text-slate-700'
                        }`}>
                          {s.label} ({s.labelUrdu})
                        </span>
                        {season === s.key && (
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            s.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                          }`}>
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Item Details
                </h3>
              </div>

              {/* Add Item Form */}
              <div className="p-5 bg-slate-50/50 border-b border-slate-200">
                <div className="grid grid-cols-12 gap-3 items-end">
                  {/* Serial No */}
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">S.No</label>
                    <input
                      type="text"
                      value={currentItem.serialNo}
                      disabled
                      className="w-full px-2 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm text-center font-semibold text-slate-600"
                    />
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={currentItem.category}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.key} value={cat.key}>{cat.label}</option>
                      ))}
                    </select>
                  </div>



                  {/* Item Selection */}
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={currentItem.itemId}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, itemId: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {PRESET[currentItem.category].map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Required Quantity */}
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Req. Qty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={currentItem.requiredQty}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, requiredQty: Math.max(1, Number(e.target.value)) }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* UOM */}
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">UOM</label>
                    <select
                      value={currentItem.uom}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, uom: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {UOM_OPTIONS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  {/* Remarks */}
                  <div className="col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Remarks</label>
                    <input
                      type="text"
                      value={currentItem.remarks}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, remarks: e.target.value }))}
                      placeholder="Optional notes"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Add Button */}
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={addItem}
                      className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold text-sm"
                    >
                      <Plus className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              {items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-300">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase w-16">S.No</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase">Category</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase">Item Name</th>
                        <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-700 uppercase w-32">Required Qty</th>
                        <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-700 uppercase w-24">UOM</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 uppercase w-40">Remarks</th>
                        <th className="px-4 py-2.5 text-center text-xs font-bold text-slate-700 uppercase w-20">Action</th>
                      </tr>
                    </thead>
                 <tbody className="divide-y divide-slate-200">
  {items.map((item, idx) => (
    <tr key={idx} className="hover:bg-slate-50">
      <td className="px-4 py-3 text-center font-semibold text-slate-700">{idx + 1}</td>
      <td className="px-4 py-3 text-slate-700 capitalize text-xs">{CATEGORIES.find(c => c.key === item.category)?.label}</td>
      <td className="px-4 py-3 text-slate-900 font-medium">{item.itemName}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <input
            type="number"
            min={1}
            value={item.requiredQty}
            onChange={(e) => editItem(idx, Math.max(1, Number(e.target.value)))}
            className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-center font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </td>
      <td className="px-4 py-3 text-center text-slate-700">{item.uom}</td>
      <td className="px-4 py-3 text-slate-600 text-xs">{item.remarks || '—'}</td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => removeItem(idx)}
          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </td>
    </tr>
  ))}
</tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-medium">No items added yet</p>
                  <p className="text-xs text-slate-400 mt-1">Select category and item, then click the + button to add</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {items.length} item{items.length !== 1 ? 's' : ''} added
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!endUser.trim() || !nameCategory.trim() || items.length === 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Create Purchase Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default FarmerRequestFormModal;