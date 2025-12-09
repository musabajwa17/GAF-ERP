"use client"
export const PRESET = {
  fertilizers: [
    { id: "urea", name: "Urea" },
    { id: "dap", name: "DAP" },
    { id: "can_guwara", name: "CAN Guwara" },
    { id: "nem_phosphate", name: "NEM Phosphate" },
    { id: "sop", name: "SOP" },
    { id: "sulfur_fert", name: "Sulfur" },
  ],
  pesticides: [
    { id: "crop_plus", name: "Crop plus" },
    { id: "atlantis_super", name: "Atlantis super" },
    { id: "chemico", name: "Chemico" },
    { id: "flisto_gold", name: "Flisto Gold" },
  ],
  produce: [
    { id: "wheat", name: "Wheat" },
    { id: "fennel", name: "Fennel" },
    { id: "mungbean", name: "Mungbean" },
  ],
  seeds: [
    { id: "maize", name: "Maize" },
    { id: "pearl_millet", name: "Pearl Millet" },
    { id: "cotton_seed", name: "Cotton seed" },
  ],
  other: [
    { id: "spray_machines", name: "Spray Machines" },
    { id: "hand_trolley", name: "Hand trolley" },
    { id: "cement", name: "Cement" },
  ],
};

export const CATEGORIES = [
  { key: "fertilizers", label: "Fertilizers" },
  { key: "pesticides", label: "Pesticides" },
  { key: "produce", label: "Produce" },
  { key: "seeds", label: "Seeds" },
  { key: "other", label: "Other" },
];

export const UNITS = ["bags", "bottles", "kg", "Bottels", "pieces"];

export const uid = (prefix = "id") => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;