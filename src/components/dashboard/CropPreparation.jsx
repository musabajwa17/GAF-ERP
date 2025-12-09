// import React, { useState, useEffect } from 'react';
// import { MapPin, Calendar, Droplets, Sun, Sprout, ArrowLeft, Info, Leaf, Bug, Beaker, TrendingUp, Pill, Truck, Shield, Bean, AlertCircle, Plus, Trash2, Table, Save, Download } from 'lucide-react';

// const CropPreparation = () => {
//   const [view, setView] = useState('planning');
//   const [selectedSeason, setSelectedSeason] = useState('Rabi');
//   const [selectedCrops, setSelectedCrops] = useState([
//     { id: 1, cropType: '', area: 0, variety: '', locationId: '' }
//   ]);
//   const [availableAcres, setAvailableAcres] = useState(0);
//   const [totalUsedArea, setTotalUsedArea] = useState(0);
//   const [locations, setLocations] = useState([]);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [savedPlans, setSavedPlans] = useState([]);

//   // Load saved plans from localStorage on component mount
//   useEffect(() => {
//     const saved = localStorage.getItem('cropPlans');
//     if (saved) {
//       setSavedPlans(JSON.parse(saved));
//     }
//   }, []);

//   // Save plans to localStorage whenever they change
//   useEffect(() => {
//     if (savedPlans.length > 0) {
//       localStorage.setItem('cropPlans', JSON.stringify(savedPlans));
//     }
//   }, [savedPlans]);

//   // Crop Database
//   const CROP_TYPES = {
//     'Wheat': {
//       botanicalName: 'Triticum aestivum',
//       season: 'Rabi (Winter)',
//       varieties: ['Arooj-22', 'Dilkash-21', 'Fakhr-e-Bakhar', 'Zinkol-16'],
//       startMethod: 'Drill Sowing',
//       lightProfile: 'Full Sun',
//       daysToMaturity: 120,
//       harvestWindow: { min: 115, max: 125 },
//       optimalSowingTime: '1st – 20th November',
//       rowSpacing: 22.5,
//       plantSpacing: 25,
//       seedRate: '50–60 kg/acre',
//       soilConditions: 'Well-prepared, weed-free loam',
//       waterRequirement: 'Moderate - 3-4 irrigations',
//       criticalIrrigations: ['Tillering (20-25 DAS)', 'Stem elongation (45-50 DAS)', 'Booting (80-95 DAS)'],
//       seedTreatment: 'Thiophanate methyl 2.5 g/kg OR Imidacloprid + Tebuconazole 2 ml/kg',
//       diseases: ['Black Rust', 'Yellow Rust', 'Loose Smut', 'Karnal Bunt'],
//       pests: ['Termites', 'Cutworm', 'Aphid', 'Pink Borer'],
//       harvestIndicators: ['Stem and leaves turn yellow', 'Grain moisture 25-30%'],
//       harvestUnits: 'maunds',
//       totalAcres: 668,
//       costPerAcre: {
//         land_prep: 9800,
//         seed: 5500,
//         seed_treatment: 600,
//         sowing_charges: 2000,
//         irrigation: 14400,
//         fertilizers: 36850,
//         crop_protection: 3600,
//         harvesting_tpt: 6060,
//         total_cost_of_production: 78810
//       }
//     },
//     'Raya (Mustard)': {
//       botanicalName: 'Brassica juncea',
//       season: 'Rabi (Winter)',
//       varieties: ['Raya Anmol', 'BARD-1', 'Sultan Raya', 'KS-400'],
//       startMethod: 'Broadcast or Line Sowing',
//       lightProfile: 'Full Sun',
//       daysToMaturity: 90,
//       harvestWindow: { min: 85, max: 95 },
//       optimalSowingTime: 'Mid-September – Early October',
//       rowSpacing: 45,
//       plantSpacing: 10,
//       seedRate: '1.5–2 kg/acre',
//       soilConditions: 'Well-drained, slightly sandy to loam soils',
//       waterRequirement: 'Very Low – rain-fed or 1 irrigation',
//       criticalIrrigations: ['Flower initiation', 'Pod formation'],
//       seedTreatment: 'Not required',
//       diseases: ['Alternaria Blight', 'White Rust', 'Downy Mildew'],
//       pests: ['Aphids', 'Painted Bug', 'Sawfly'],
//       harvestIndicators: ['Pods turn golden brown', 'Seeds become hard and rattle'],
//       harvestUnits: 'maunds',
//       totalAcres: 447,
//       costPerAcre: {
//         land_prep: 10920,
//         seed: 3600,
//         seed_treatment: 0,
//         sowing_charges: 0,
//         irrigation: 10000,
//         fertilizers: 20250,
//         crop_protection: 3600,
//         harvesting_tpt: 7500,
//         total_cost_of_production: 55870
//       }
//     },
//     'Rhodes Grass': {
//       botanicalName: 'Chloris gayana',
//       season: 'Warm Season (Spring–Summer)',
//       varieties: ['Fine Cut', 'Callide', 'Tolgar'],
//       startMethod: 'Broadcast or Drill Sowing',
//       lightProfile: 'Full Sun',
//       daysToMaturity: 75,
//       harvestWindow: { min: 70, max: 80 },
//       optimalSowingTime: 'March – May',
//       rowSpacing: 30,
//       plantSpacing: 15,
//       seedRate: '4–6 kg/acre',
//       soilConditions: 'Sandy loam, well-drained soils',
//       waterRequirement: 'High – 6–8 irrigations',
//       criticalIrrigations: ['Early establishment', 'Tillering', 'After every cutting'],
//       seedTreatment: 'Not used',
//       diseases: ['Leaf Spot', 'Rust'],
//       pests: ['Armyworm', 'Grasshoppers'],
//       harvestIndicators: ['Cut at 50% flowering', 'Soft stems and green leaves'],
//       harvestUnits: 'maunds (fresh fodder)',
//       totalAcres: 692,
//       costPerAcre: {
//         land_prep: 4760,
//         seed: 20000,
//         seed_treatment: 0,
//         sowing_charges: 1500,
//         irrigation: 32000,
//         fertilizers: 45100,
//         crop_protection: 2000,
//         harvesting_tpt: 0,
//         total_cost_of_production: 105360
//       }
//     },
//     'Rice': {
//       botanicalName: 'Oryza sativa',
//       season: 'Kharif (Monsoon)',
//       varieties: ['Basmati 385', 'Kissan', 'IRRI-6'],
//       startMethod: 'Transplanting',
//       lightProfile: 'Full Sun',
//       daysToMaturity: 120,
//       harvestWindow: { min: 110, max: 130 },
//       optimalSowingTime: 'June – July',
//       rowSpacing: 20,
//       plantSpacing: 15,
//       seedRate: '8–10 kg/acre',
//       soilConditions: 'Clay loam with good water retention',
//       waterRequirement: 'High - Continuous standing water',
//       criticalIrrigations: ['Tillering', 'Panicle initiation', 'Flowering'],
//       seedTreatment: 'Carbendazim 2g/kg',
//       diseases: ['Blast', 'Brown Spot', 'Sheath Blight'],
//       pests: ['Stem Borer', 'Leaf Folder', 'Plant Hopper'],
//       harvestIndicators: ['Grains hard, yellow straw', '80-85% grains mature'],
//       harvestUnits: 'maunds',
//       totalAcres: 500,
//       costPerAcre: {
//         land_prep: 12000,
//         seed: 4000,
//         seed_treatment: 500,
//         sowing_charges: 3000,
//         irrigation: 20000,
//         fertilizers: 30000,
//         crop_protection: 4000,
//         harvesting_tpt: 5000,
//         total_cost_of_production: 78500
//       }
//     },
//     'Cotton': {
//       botanicalName: 'Gossypium hirsutum',
//       season: 'Kharif (Monsoon)',
//       varieties: ['CIM-602', 'BH-178', 'FH-142'],
//       startMethod: 'Drill Sowing',
//       lightProfile: 'Full Sun',
//       daysToMaturity: 150,
//       harvestWindow: { min: 140, max: 160 },
//       optimalSowingTime: 'May – June',
//       rowSpacing: 75,
//       plantSpacing: 30,
//       seedRate: '5–7 kg/acre',
//       soilConditions: 'Deep, well-drained loamy soil',
//       waterRequirement: 'Moderate - 6-8 irrigations',
//       criticalIrrigations: ['Square formation', 'Flowering', 'Boll development'],
//       seedTreatment: 'Imidacloprid 5g/kg',
//       diseases: ['Cotton Leaf Curl Virus', 'Bacterial Blight', 'Verticillium Wilt'],
//       pests: ['Whitefly', 'Bollworm', 'Aphid'],
//       harvestIndicators: ['Bolls open completely', 'Lint fluffs out'],
//       harvestUnits: 'maunds',
//       totalAcres: 400,
//       costPerAcre: {
//         land_prep: 15000,
//         seed: 7000,
//         seed_treatment: 800,
//         sowing_charges: 2500,
//         irrigation: 25000,
//         fertilizers: 40000,
//         crop_protection: 8000,
//         harvesting_tpt: 10000,
//         total_cost_of_production: 108300
//       }
//     }
//   };

//   // Filter crops by season
//   const getCropsBySeason = (season) => {
//     if (season === 'Rabi') {
//       return ['Wheat', 'Raya (Mustard)'];
//     } else if (season === 'Kharif') {
//       return ['Rice', 'Cotton'];
//     } else if (season === 'Zaid') {
//       return ['Rhodes Grass'];
//     }
//     return [];
//   };

//   const SEASONS = ['Rabi', 'Kharif', 'Zaid'];

//   useEffect(() => {
//     fetchLocationsFromAPI();
//   }, []);

//   useEffect(() => {
//     // Calculate total used area
//     const total = selectedCrops.reduce((sum, crop) => sum + (Number(crop.area) || 0), 0);
//     setTotalUsedArea(total);

//     // Update available acres based on selected crops
//     if (selectedCrops.length > 0 && selectedCrops[0].cropType) {
//       const cropData = CROP_TYPES[selectedCrops[0].cropType];
//       if (cropData) {
//         setAvailableAcres(cropData.totalAcres);
//       }
//     }

//     // Clear validation errors when crops change
//     setValidationErrors([]);
//   }, [selectedCrops]);

//   const fetchLocationsFromAPI = async () => {
//     try {
//       const response = await fetch(
//         "https://earthscansystems.com/farmerdatauser/userfarm/",
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem("access")}`
//           }
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         const transformedLocations = data.map(farm => ({
//           id: farm.id,
//           name: farm.farm_name || farm.location_name || 'Unknown Field',
//           areaSqm: farm.area || 1000,
//           status: 'Active'
//         }));
//         setLocations(transformedLocations);
//       } else {
//         setLocations([
//           { id: 1, name: 'Field A - Islamabad', areaSqm: 2000, status: 'Active' },
//           { id: 2, name: 'Field B - Rawalpindi', areaSqm: 1500, status: 'Active' },
//           { id: 3, name: 'Field C - Lahore', areaSqm: 3000, status: 'Active' }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//       setLocations([
//         { id: 1, name: 'Field A - Islamabad', areaSqm: 2000, status: 'Active' },
//         { id: 2, name: 'Field B - Rawalpindi', areaSqm: 1500, status: 'Active' },
//         { id: 3, name: 'Field C - Lahore', areaSqm: 3000, status: 'Active' }
//       ]);
//     }
//   };

//   const handleSeasonChange = (season) => {
//     setSelectedSeason(season);
//     // Reset crops when season changes
//     setSelectedCrops([{ id: 1, cropType: '', area: 0, variety: '', locationId: '' }]);
//     setValidationErrors([]);
//   };

//   const handleCropChange = (index, field, value) => {
//     const updatedCrops = [...selectedCrops];
//     updatedCrops[index] = { ...updatedCrops[index], [field]: value };

//     // If crop type changes, reset variety
//     if (field === 'cropType') {
//       updatedCrops[index].variety = '';
//       // Update available acres for this crop
//       const cropData = CROP_TYPES[value];
//       if (cropData) {
//         setAvailableAcres(cropData.totalAcres);
//       }
//     }

//     setSelectedCrops(updatedCrops);
//     // Clear validation errors for this field
//     setValidationErrors(prev => prev.filter(error => !error.includes(`Crop ${index + 1}`)));
//   };

//   const addCropRow = () => {
//     if (selectedCrops.length >= 3) {
//       alert('Maximum 3 crops allowed');
//       return;
//     }

//     const newId = selectedCrops.length > 0 ? Math.max(...selectedCrops.map(c => c.id)) + 1 : 1;
//     setSelectedCrops([...selectedCrops, { 
//       id: newId, 
//       cropType: '', 
//       area: 0, 
//       variety: '', 
//       locationId: '' 
//     }]);
//   };

//   const removeCropRow = (index) => {
//     if (selectedCrops.length <= 1) {
//       alert('At least one crop must be selected');
//       return;
//     }

//     const updatedCrops = selectedCrops.filter((_, i) => i !== index);
//     setSelectedCrops(updatedCrops);
//   };

//   const validateForm = () => {
//     const errors = [];

//     // Check if at least one crop is selected
//     const hasCrops = selectedCrops.some(crop => crop.cropType);
//     if (!hasCrops) {
//       errors.push('Please select at least one crop');
//     }

//     // Validate each crop
//     selectedCrops.forEach((crop, index) => {
//       if (crop.cropType) {
//         // Validate area
//         if (!crop.area || crop.area <= 0) {
//           errors.push(`Crop ${index + 1}: Please enter a valid area (greater than 0)`);
//         }

//         // Validate area doesn't exceed available acres
//         const cropData = CROP_TYPES[crop.cropType];
//         if (cropData && crop.area > cropData.totalAcres) {
//           errors.push(`Crop ${index + 1}: Area cannot exceed ${cropData.totalAcres} acres`);
//         }

//         // Validate variety
//         if (!crop.variety) {
//           errors.push(`Crop ${index + 1}: Please select a variety`);
//         }

//         // Validate location
//         if (!crop.locationId) {
//           errors.push(`Crop ${index + 1}: Please select a location`);
//         }
//       }
//     });

//     setValidationErrors(errors);
//     return errors.length === 0;
//   };

//   const handlePreview = () => {
//     if (validateForm()) {
//       setView('summary');
//     } else {
//       // Show validation errors
//       alert(`Please fix the following errors:\n\n${validationErrors.join('\n')}`);
//     }
//   };

//   const handleSavePlan = () => {
//     if (validateForm()) {
//       const planName = prompt('Enter a name for this crop plan:', `${selectedSeason} Crop Plan ${new Date().toLocaleDateString()}`);

//       if (planName) {
//         const plan = {
//           id: Date.now(),
//           name: planName,
//           season: selectedSeason,
//           crops: selectedCrops.filter(c => c.cropType),
//           createdAt: new Date().toISOString(),
//           totalArea: totalUsedArea,
//           totalCost: calculateTotalCost(),
//           expectedRevenue: calculateTotalRevenue(),
//           expectedProfit: calculateTotalProfit()
//         };

//         const updatedPlans = [...savedPlans, plan];
//         setSavedPlans(updatedPlans);

//         alert(`Plan "${planName}" saved successfully!`);
//       }
//     }
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       // Show success message
//       alert('Crop plan submitted successfully!');

//       // Save to localStorage as recent submission
//       const submission = {
//         id: Date.now(),
//         season: selectedSeason,
//         crops: selectedCrops.filter(c => c.cropType),
//         submittedAt: new Date().toISOString(),
//         totalArea: totalUsedArea,
//         totalCost: calculateTotalCost(),
//         expectedRevenue: calculateTotalRevenue(),
//         expectedProfit: calculateTotalProfit()
//       };

//       const recentSubmissions = JSON.parse(localStorage.getItem('recentSubmissions') || '[]');
//       recentSubmissions.unshift(submission);
//       if (recentSubmissions.length > 10) recentSubmissions.pop();
//       localStorage.setItem('recentSubmissions', JSON.stringify(recentSubmissions));

//       // Reset form
//       setSelectedCrops([{ id: 1, cropType: '', area: 0, variety: '', locationId: '' }]);
//       setView('planning');
//     }
//   };

//   const calculateCosts = (cropType, area) => {
//     if (!cropType || !CROP_TYPES[cropType]) return { totalCost: 0, details: {} };

//     const cropData = CROP_TYPES[cropType];
//     const details = {};
//     let totalCost = 0;

//     Object.entries(cropData.costPerAcre).forEach(([key, value]) => {
//       details[key] = value * area;
//       if (key === 'total_cost_of_production') {
//         totalCost = details[key];
//       }
//     });

//     return { totalCost, details };
//   };

//   const calculateRevenue = (cropType, area) => {
//     // Revenue calculation based on crop type (from your screenshot)
//     const revenuePerAcre = {
//       'Wheat': 101500,
//       'Raya (Mustard)': 68800,
//       'Rhodes Grass': 150000,
//       'Rice': 120000,
//       'Cotton': 180000
//     };

//     return revenuePerAcre[cropType] ? revenuePerAcre[cropType] * area : 0;
//   };

//   const calculateProfit = (cropType, area) => {
//     const revenue = calculateRevenue(cropType, area);
//     const { totalCost } = calculateCosts(cropType, area);
//     return revenue - totalCost;
//   };

//   const calculateTotalCost = () => {
//     return selectedCrops
//       .filter(c => c.cropType)
//       .reduce((sum, crop) => {
//         const { totalCost } = calculateCosts(crop.cropType, Number(crop.area) || 0);
//         return sum + totalCost;
//       }, 0);
//   };

//   const calculateTotalRevenue = () => {
//     return selectedCrops
//       .filter(c => c.cropType)
//       .reduce((sum, crop) => {
//         return sum + calculateRevenue(crop.cropType, Number(crop.area) || 0);
//       }, 0);
//   };

//   const calculateTotalProfit = () => {
//     return selectedCrops
//       .filter(c => c.cropType)
//       .reduce((sum, crop) => {
//         return sum + calculateProfit(crop.cropType, Number(crop.area) || 0);
//       }, 0);
//   };

//   // Helper function to check if a crop is complete
//   const isCropComplete = (crop) => {
//     return crop.cropType && crop.area > 0 && crop.variety && crop.locationId;
//   };

//   // Function to export data as CSV
//   const exportToCSV = () => {
//     if (selectedCrops.filter(c => c.cropType).length === 0) {
//       alert('No data to export');
//       return;
//     }

//     const headers = ['Crop', 'Area (acres)', 'Variety', 'Location', 'Total Cost (Rs.)', 'Expected Revenue (Rs.)', 'Gross Profit (Rs.)', 'Margin %'];

//     const rows = selectedCrops.filter(c => c.cropType).map(crop => {
//       const area = Number(crop.area) || 0;
//       const { totalCost } = calculateCosts(crop.cropType, area);
//       const revenue = calculateRevenue(crop.cropType, area);
//       const profit = calculateProfit(crop.cropType, area);
//       const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0;
//       const location = locations.find(l => l.id === parseInt(crop.locationId));

//       return [
//         crop.cropType,
//         area,
//         crop.variety,
//         location ? location.name : 'N/A',
//         totalCost,
//         revenue,
//         profit,
//         margin
//       ];
//     });

//     // Add consolidated row
//     if (selectedCrops.filter(c => c.cropType).length > 1) {
//       rows.push([
//         'CONSOLIDATED',
//         totalUsedArea,
//         '-',
//         '-',
//         calculateTotalCost(),
//         calculateTotalRevenue(),
//         calculateTotalProfit(),
//         calculateTotalRevenue() > 0 ? ((calculateTotalProfit() / calculateTotalRevenue()) * 100).toFixed(2) : 0
//       ]);
//     }

//     let csvContent = "data:text/csv;charset=utf-8,";
//     csvContent += headers.join(",") + "\n";
//     rows.forEach(row => {
//       csvContent += row.join(",") + "\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `crop_plan_${selectedSeason}_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Function to load a saved plan
//   const loadSavedPlan = (plan) => {
//     setSelectedSeason(plan.season);
//     setSelectedCrops(plan.crops);
//     setView('planning');
//     alert(`Loaded plan: ${plan.name}`);
//   };

//   // Function to delete a saved plan
//   const deleteSavedPlan = (planId) => {
//     if (window.confirm('Are you sure you want to delete this plan?')) {
//       const updatedPlans = savedPlans.filter(plan => plan.id !== planId);
//       setSavedPlans(updatedPlans);
//       if (updatedPlans.length === 0) {
//         localStorage.removeItem('cropPlans');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         {/* <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900 mb-2">Crop Planning - {selectedSeason} Season 2025-26</h1>
//           <p className="text-slate-600">Plan your crop cultivation with cost analysis and revenue projection</p>
//         </div> */}

//         {/* Saved Plans Section */}

//         {/* Validation Errors */}
//         {validationErrors.length > 0 && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
//             <h3 className="font-bold text-red-800 mb-2">Please fix the following errors:</h3>
//             <ul className="list-disc pl-5 text-red-700">
//               {validationErrors.map((error, index) => (
//                 <li key={index}>{error}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Main Planning View */}
//         {view === 'planning' && (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
//             {/* Season Selection */}
//             <div className="mb-10">
//               <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-emerald-600" />
//                 Select Season
//               </h2>
//               <div className="flex gap-4">
//                 {SEASONS.map((season) => (
//                   <button
//                     key={season}
//                     onClick={() => handleSeasonChange(season)}
//                     className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedSeason === season 
//                       ? 'bg-emerald-600 text-white shadow-lg' 
//                       : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
//                   >
//                     {season}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Crop Selection Form */}
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//                   <Leaf className="w-5 h-5 text-emerald-600" />
//                   Crop Selection
//                 </h2>
//                 <div className="text-sm text-slate-700">
//                   Available Land: <span className="font-bold">{availableAcres.toLocaleString()}</span> acres
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 {selectedCrops.map((crop, index) => (
//                   <div key={crop.id} className={`border-2 rounded-xl p-6 bg-gradient-to-r from-slate-50 to-white ${
//                     isCropComplete(crop) ? 'border-emerald-200' : 'border-slate-200'
//                   }`}>
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center gap-3">
//                         <h3 className="font-bold text-slate-900">Crop #{index + 1}</h3>
//                         {isCropComplete(crop) && (
//                           <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
//                             ✓ Complete
//                           </span>
//                         )}
//                       </div>
//                       {selectedCrops.length > 1 && (
//                         <button
//                           onClick={() => removeCropRow(index)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                       {/* Crop Type */}
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Crop Type *</label>
//                         <select
//                           value={crop.cropType}
//                           onChange={(e) => handleCropChange(index, 'cropType', e.target.value)}
//                           className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                         >
//                           <option value="">Select crop</option>
//                           {getCropsBySeason(selectedSeason).map(cropName => (
//                             <option key={cropName} value={cropName}>{cropName}</option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Area */}
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">
//                           Area (acres) *
//                           <span className="text-xs font-normal text-slate-500 ml-2">
//                             Max: {crop.cropType && CROP_TYPES[crop.cropType] 
//                               ? CROP_TYPES[crop.cropType].totalAcres.toLocaleString() 
//                               : 'N/A'}
//                           </span>
//                         </label>
//                         <input
//                           type="number"
//                           value={crop.area}
//                           onChange={(e) => handleCropChange(index, 'area', e.target.value)}
//                           min="0"
//                           max={crop.cropType && CROP_TYPES[crop.cropType] 
//                             ? CROP_TYPES[crop.cropType].totalAcres 
//                             : 1000}
//                           step="0.1"
//                           className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                           placeholder="Enter area in acres"
//                         />
//                         <div className="text-xs text-slate-500 mt-1">
//                           Used: {Number(crop.area) || 0} acres
//                         </div>
//                       </div>

//                       {/* Variety */}
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Variety *</label>
//                         <select
//                           value={crop.variety}
//                           onChange={(e) => handleCropChange(index, 'variety', e.target.value)}
//                           disabled={!crop.cropType}
//                           className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
//                         >
//                           <option value="">Select variety</option>
//                           {crop.cropType && CROP_TYPES[crop.cropType] && 
//                             CROP_TYPES[crop.cropType].varieties.map(variety => (
//                               <option key={variety} value={variety}>{variety}</option>
//                             ))
//                           }
//                         </select>
//                       </div>

//                       {/* Location */}
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
//                         <select
//                           value={crop.locationId}
//                           onChange={(e) => handleCropChange(index, 'locationId', e.target.value)}
//                           className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                         >
//                           <option value="">Select location</option>
//                           {locations.map(location => (
//                             <option key={location.id} value={location.id}>
//                               {location.name} - {location.areaSqm} sqm
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     {/* Crop Info Preview */}
//                     {crop.cropType && CROP_TYPES[crop.cropType] && (
//                       <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
//                         <div className="grid grid-cols-4 gap-4 text-sm">
//                           <div>
//                             <p className="text-slate-600 text-xs">Botanical Name</p>
//                             <p className="font-medium text-slate-900">{CROP_TYPES[crop.cropType].botanicalName}</p>
//                           </div>
//                           <div>
//                             <p className="text-slate-600 text-xs">Days to Maturity</p>
//                             <p className="font-medium text-slate-900">{CROP_TYPES[crop.cropType].daysToMaturity}</p>
//                           </div>
//                           <div>
//                             <p className="text-slate-600 text-xs">Optimal Sowing</p>
//                             <p className="font-medium text-slate-900 text-xs">{CROP_TYPES[crop.cropType].optimalSowingTime}</p>
//                           </div>
//                           <div>
//                             <p className="text-slate-600 text-xs">Seed Rate</p>
//                             <p className="font-medium text-slate-900 text-xs">{CROP_TYPES[crop.cropType].seedRate}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Add Crop Button */}
//                 {selectedCrops.length < 3 && (
//                   <button
//                     onClick={addCropRow}
//                     className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition flex items-center justify-center gap-3"
//                   >
//                     <Plus className="w-5 h-5 text-emerald-600" />
//                     <span className="font-medium text-emerald-600">Add Another Crop</span>
//                     <span className="text-sm text-slate-500">(Max 3 crops)</span>
//                   </button>
//                 )}

//                 {/* Summary Stats */}
//                 <div className="bg-slate-100 rounded-xl p-6">
//                   <div className="grid grid-cols-3 gap-6">
//                     <div className="bg-white rounded-lg p-4 border border-slate-200">
//                       <p className="text-slate-600 text-sm mb-1">Total Crops Selected</p>
//                       <p className="text-2xl font-bold text-slate-900">
//                         {selectedCrops.filter(c => c.cropType).length} / 3
//                       </p>
//                     </div>
//                     <div className="bg-white rounded-lg p-4 border border-slate-200">
//                       <p className="text-slate-600 text-sm mb-1">Total Area</p>
//                       <p className="text-2xl font-bold text-slate-900">
//                         {selectedCrops.reduce((sum, crop) => sum + (Number(crop.area) || 0), 0).toFixed(1)} acres
//                       </p>
//                     </div>
//                     <div className="bg-white rounded-lg p-4 border border-slate-200">
//                       <p className="text-slate-600 text-sm mb-1">Available Acres Remaining</p>
//                       <p className="text-2xl font-bold text-slate-900">
//                         {Math.max(0, availableAcres - totalUsedArea).toFixed(1)} acres
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-wrap justify-between gap-4 pt-6 border-t border-slate-200">
//               <div className="flex gap-3">
//                 <button
//                   onClick={handlePreview}
//                   disabled={!selectedCrops.some(c => c.cropType)}
//                   className={`px-6 py-3 border-2 rounded-lg transition font-medium flex items-center gap-2 ${
//                     selectedCrops.some(c => c.cropType)
//                       ? 'border-slate-300 hover:bg-slate-50'
//                       : 'border-slate-200 text-slate-400 cursor-not-allowed'
//                   }`}
//                 >
//                   <Table className="w-4 h-4" />
//                   Preview Summary
//                 </button>
//                 <button
//                   onClick={handleSavePlan}
//                   disabled={!selectedCrops.some(c => c.cropType)}
//                   className={`px-6 py-3 border-2 rounded-lg transition font-medium flex items-center gap-2 ${
//                     selectedCrops.some(c => c.cropType)
//                       ? 'border-emerald-300 hover:bg-emerald-50 text-emerald-700'
//                       : 'border-slate-200 text-slate-400 cursor-not-allowed'
//                   }`}
//                 >
//                   <Save className="w-4 h-4" />
//                   Save Plan
//                 </button>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={exportToCSV}
//                   disabled={!selectedCrops.some(c => c.cropType)}
//                   className={`px-6 py-3 border-2 rounded-lg transition font-medium flex items-center gap-2 ${
//                     selectedCrops.some(c => c.cropType)
//                       ? 'border-blue-300 hover:bg-blue-50 text-blue-700'
//                       : 'border-slate-200 text-slate-400 cursor-not-allowed'
//                   }`}
//                 >
//                   <Download className="w-4 h-4" />
//                   Export CSV
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium shadow-lg"
//                 >
//                   Submit Crop Plan
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Summary Table View - FIXED TABLE */}
//         {view === 'summary' && (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-900">Crop Plan Summary - {selectedSeason} 2025-26</h2>
//                 <p className="text-slate-600">Detailed cost analysis and revenue projection</p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={exportToCSV}
//                   className="px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium flex items-center gap-2 text-blue-700"
//                 >
//                   <Download className="w-4 h-4" />
//                   Export
//                 </button>
//                 <button
//                   onClick={() => setView('planning')}
//                   className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
//                 >
//                   Edit Plan
//                 </button>
//               </div>
//             </div>

//             {/* Summary Table */}
//             <div className="overflow-x-auto rounded-xl border border-slate-200 mb-8">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-800">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Crop</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Area (acres)</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Variety</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Location</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Total Cost (Rs.)</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Expected Revenue (Rs.)</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Gross Profit (Rs.)</th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Margin %</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-200">
//                   {selectedCrops
//                     .filter(crop => crop.cropType)
//                     .map((crop, index) => {
//                       const cropData = CROP_TYPES[crop.cropType];
//                       const area = Number(crop.area) || 0;
//                       const { totalCost } = calculateCosts(crop.cropType, area);
//                       const revenue = calculateRevenue(crop.cropType, area);
//                       const profit = calculateProfit(crop.cropType, area);
//                       const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0;
//                       const location = locations.find(l => l.id === parseInt(crop.locationId));

//                       return (
//                         <tr key={index} className="hover:bg-slate-50 transition">
//                           <td className="px-6 py-4">
//                             <div>
//                               <div className="font-medium text-slate-900">{crop.cropType}</div>
//                               <div className="text-xs text-slate-500">{cropData.botanicalName}</div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <span className="font-semibold">{area.toFixed(1)}</span>
//                             <div className="text-xs text-slate-500">
//                               of {cropData.totalAcres.toLocaleString()} acres
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <span className="font-medium">{crop.variety}</span>
//                           </td>
//                           <td className="px-6 py-4">
//                             {location ? (
//                               <div className="flex items-center gap-2">
//                                 <MapPin className="w-4 h-4 text-emerald-600" />
//                                 <span>{location.name}</span>
//                               </div>
//                             ) : (
//                               <span className="text-slate-400">Not selected</span>
//                             )}
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="font-bold text-slate-900">
//                               Rs. {totalCost.toLocaleString('en-PK')}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="font-bold text-emerald-700">
//                               Rs. {revenue.toLocaleString('en-PK')}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className={`font-bold ${profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
//                               Rs. {profit.toLocaleString('en-PK')}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className={`font-bold ${margin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
//                               {margin}%
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   }

//                   {/* Consolidated Row - Only show if multiple crops */}
//                   {selectedCrops.filter(c => c.cropType).length > 1 && (
//                     <tr className="bg-slate-800 text-white font-bold">
//                       <td className="px-6 py-4">CONSOLIDATED</td>
//                       <td className="px-6 py-4">
//                         {selectedCrops
//                           .filter(c => c.cropType)
//                           .reduce((sum, crop) => sum + (Number(crop.area) || 0), 0)
//                           .toFixed(1)}
//                       </td>
//                       <td className="px-6 py-4">-</td>
//                       <td className="px-6 py-4">-</td>
//                       <td className="px-6 py-4">
//                         Rs. {calculateTotalCost().toLocaleString('en-PK')}
//                       </td>
//                       <td className="px-6 py-4">
//                         Rs. {calculateTotalRevenue().toLocaleString('en-PK')}
//                       </td>
//                       <td className="px-6 py-4">
//                         Rs. {calculateTotalProfit().toLocaleString('en-PK')}
//                       </td>
//                       <td className="px-6 py-4">
//                         {calculateTotalRevenue() > 0 
//                           ? ((calculateTotalProfit() / calculateTotalRevenue()) * 100).toFixed(2)
//                           : 0}%
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Cost Breakdown Section */}
//             <div className="mt-8 bg-slate-50 rounded-xl p-6">
//               <h3 className="text-lg font-bold text-slate-900 mb-4">Cost Breakdown Analysis</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {selectedCrops.filter(c => c.cropType).map((crop, index) => {
//                   const area = Number(crop.area) || 0;
//                   const { details } = calculateCosts(crop.cropType, area);

//                   return (
//                     <div key={index} className="bg-white rounded-lg border border-slate-200 p-4">
//                       <h4 className="font-bold text-slate-900 mb-3">{crop.cropType}</h4>
//                       <div className="space-y-2">
//                         {Object.entries(CROP_TYPES[crop.cropType].costPerAcre).map(([key, perAcre]) => (
//                           <div key={key} className="flex justify-between text-sm">
//                             <span className="text-slate-600">
//                               {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                             </span>
//                             <span className="font-medium text-slate-900">
//                               Rs. {Math.round(perAcre * area).toLocaleString('en-PK')}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Summary Stats */}
//             <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
//               <h3 className="text-lg font-bold text-slate-900 mb-4">Plan Summary</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 <div className="bg-white rounded-lg p-4 border border-slate-200">
//                   <p className="text-slate-600 text-sm mb-1">Total Crops</p>
//                   <p className="text-2xl font-bold text-slate-900">
//                     {selectedCrops.filter(c => c.cropType).length}
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg p-4 border border-slate-200">
//                   <p className="text-slate-600 text-sm mb-1">Total Area</p>
//                   <p className="text-2xl font-bold text-slate-900">
//                     {totalUsedArea.toFixed(1)} acres
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg p-4 border border-slate-200">
//                   <p className="text-slate-600 text-sm mb-1">Total Investment</p>
//                   <p className="text-2xl font-bold text-red-600">
//                     Rs. {calculateTotalCost().toLocaleString('en-PK')}
//                   </p>
//                 </div>
//                 <div className="bg-white rounded-lg p-4 border border-slate-200">
//                   <p className="text-slate-600 text-sm mb-1">Expected Profit</p>
//                   <p className="text-2xl font-bold text-emerald-700">
//                     Rs. {calculateTotalProfit().toLocaleString('en-PK')}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Final Actions */}
//             <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
//               <button
//                 onClick={() => setView('planning')}
//                 className="px-6 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
//               >
//                 Back to Planning
//               </button>
//               <button
//                 onClick={handleSavePlan}
//                 className="px-6 py-3 border-2 border-emerald-300 rounded-lg hover:bg-emerald-50 transition font-medium text-emerald-700"
//               >
//                 <Save className="inline w-4 h-4 mr-2" />
//                 Save Plan
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium shadow-lg"
//               >
//                 Confirm & Submit Plan
//               </button>
//             </div>
//           </div>
//         )}

//          {savedPlans.length > 0 && view === 'planning' && (
//           <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow p-6 my-5">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold text-slate-900">Saved Plans</h2>
//               <span className="text-sm text-slate-600">{savedPlans.length} saved</span>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {savedPlans.slice(0, 3).map(plan => (
//                 <div key={plan.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="font-semibold text-slate-900">{plan.name}</h3>
//                     <button
//                       onClick={() => deleteSavedPlan(plan.id)}
//                       className="text-red-600 hover:text-red-800 text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                   <p className="text-sm text-slate-600 mb-2">
//                     {plan.season} • {plan.crops.length} crops • {plan.totalArea.toFixed(1)} acres
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => loadSavedPlan(plan)}
//                       className="flex-1 px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition"
//                     >
//                       Load
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedSeason(plan.season);
//                         setSelectedCrops(plan.crops);
//                         setView('summary');
//                       }}
//                       className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
//                     >
//                       Preview
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CropPreparation;













// import React, { useState, useEffect } from 'react';
// import { Calendar, Leaf, Plus, Trash2, Table, Download } from 'lucide-react';

// const CropPreparation = () => {
//   const [view, setView] = useState('planning');
//   const [selectedCrops, setSelectedCrops] = useState([
//     { id: 1, cropType: '', area: 0 }
//   ]);
//   const [availableAcres, setAvailableAcres] = useState(0);
//   const [validationErrors, setValidationErrors] = useState([]);

//   // Crop Database - Only Rabi crops
//   const CROP_TYPES = {
//     'Wheat': {
//       botanicalName: 'Triticum aestivum',
//       season: 'Rabi (Winter)',
//       daysToMaturity: 120,
//       totalAcres: 668,
//       costPerAcre: {
//         land_prep: 9800,
//         seed: 5500,
//         seed_treatment: 600,
//         sowing_charges: 2000,
//         irrigation: 14400,
//         fertilizers: 36850,
//         crop_protection: 3600,
//         harvesting_tpt: 6060,
//         total_cost_of_production: 78810
//       }
//     },
//     'Raya (Mustard)': {
//       botanicalName: 'Brassica juncea',
//       season: 'Rabi (Winter)',
//       daysToMaturity: 90,
//       totalAcres: 447,
//       costPerAcre: {
//         land_prep: 10920,
//         seed: 3600,
//         seed_treatment: 0,
//         sowing_charges: 0,
//         irrigation: 10000,
//         fertilizers: 20250,
//         crop_protection: 3600,
//         harvesting_tpt: 7500,
//         total_cost_of_production: 55870
//       }
//     },
//     'Rhodes Grass': {
//       botanicalName: 'Chloris gayana',
//       season: 'Zaid',
//       daysToMaturity: 75,
//       totalAcres: 692,
//       costPerAcre: {
//         land_prep: 4760,
//         seed: 20000,
//         seed_treatment: 0,
//         sowing_charges: 1500,
//         irrigation: 32000,
//         fertilizers: 45100,
//         crop_protection: 2000,
//         harvesting_tpt: 0,
//         total_cost_of_production: 105360
//       }
//     }
//   };

//   // Only Rabi crops available
//   const RABI_CROPS = ['Wheat', 'Raya (Mustard)', 'Rhodes Grass'];

//   useEffect(() => {
//     // Clear validation errors when crops change
//     setValidationErrors([]);
//   }, [selectedCrops]);

//   const handleCropChange = (index, field, value) => {
//     const updatedCrops = [...selectedCrops];
//     updatedCrops[index] = { ...updatedCrops[index], [field]: value };

//     setSelectedCrops(updatedCrops);
//     // Clear validation errors for this field
//     setValidationErrors(prev => prev.filter(error => !error.includes(`Crop ${index + 1}`)));
//   };

//   const addCropRow = () => {
//     if (selectedCrops.length >= 10) {
//       alert('Maximum 10 crops allowed');
//       return;
//     }

//     const newId = selectedCrops.length > 0 ? Math.max(...selectedCrops.map(c => c.id)) + 1 : 1;
//     setSelectedCrops([...selectedCrops, {
//       id: newId,
//       cropType: '',
//       area: 0
//     }]);
//   };

//   const removeCropRow = (index) => {
//     if (selectedCrops.length <= 1) {
//       alert('At least one crop must be selected');
//       return;
//     }

//     const updatedCrops = selectedCrops.filter((_, i) => i !== index);
//     setSelectedCrops(updatedCrops);
//   };

//   const validateForm = () => {
//     const errors = [];

//     // Check if at least 3 crops are selected
//     if (selectedCrops.filter(c => c.cropType).length < 3) {
//       errors.push('Please select at least 3 crops to view the table');
//     }

//     // Validate each crop
//     selectedCrops.forEach((crop, index) => {
//       if (crop.cropType) {
//         if (!crop.area || crop.area <= 0) {
//           errors.push(`Crop ${index + 1}: Please enter a valid area (greater than 0)`);
//         }
//         const cropData = CROP_TYPES[crop.cropType];
//         if (cropData && crop.area > cropData.totalAcres) {
//           errors.push(`Crop ${index + 1}: Area cannot exceed ${cropData.totalAcres} acres`);
//         }
//       }
//     });

//     setValidationErrors(errors);
//     return errors.length === 0;
//   };

//   const handleViewTable = () => {
//     if (validateForm()) {
//       setView('table');
//     } else {
//       alert(`Please fix the following errors:\n\n${validationErrors.join('\n')}`);
//     }
//   };

//   // Function to format numbers with commas
//   const formatNumber = (num) => {
//     return num.toLocaleString('en-US');
//   };

//   // Function to export data as CSV matching the table format
//   const exportToCSV = () => {
//     // Get first 3 crops for the table
//     const tableCrops = selectedCrops.filter(c => c.cropType).slice(0, 3);

//     if (tableCrops.length < 3) {
//       alert('Need at least 3 crops to export');
//       return;
//     }

//     const headers = ['', tableCrops[0].cropType, tableCrops[1].cropType, tableCrops[2].cropType];

//     // Prepare rows based on your screenshot format
//     const rows = [
//       ['Rabi 2025-26',
//         `${tableCrops[0].area || 0} Acre | ${CROP_TYPES[tableCrops[0].cropType]?.totalAcres || 0}`,
//         `${tableCrops[1].area || 0} Acre | ${CROP_TYPES[tableCrops[1].cropType]?.totalAcres || 0}`,
//         `${tableCrops[2].area || 0} Acre | ${CROP_TYPES[tableCrops[2].cropType]?.totalAcres || 0}`],

//       ['Land Prep',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.land_prep || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.land_prep || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.land_prep || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.land_prep || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.land_prep || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.land_prep || 0) * (tableCrops[2].area || 0))}`],

//       ['Seed',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed || 0) * (tableCrops[2].area || 0))}`],

//       ['Seed Treatment',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed_treatment || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed_treatment || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed_treatment || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed_treatment || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed_treatment || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed_treatment || 0) * (tableCrops[2].area || 0))}`],

//       ['Sowing Charges',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.sowing_charges || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.sowing_charges || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.sowing_charges || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.sowing_charges || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.sowing_charges || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.sowing_charges || 0) * (tableCrops[2].area || 0))}`],

//       ['Irrigation',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.irrigation || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.irrigation || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.irrigation || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.irrigation || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.irrigation || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.irrigation || 0) * (tableCrops[2].area || 0))}`],

//       ['Fertilizers',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.fertilizers || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.fertilizers || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.fertilizers || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.fertilizers || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.fertilizers || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.fertilizers || 0) * (tableCrops[2].area || 0))}`],

//       ['Crop Protection',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.crop_protection || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.crop_protection || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.crop_protection || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.crop_protection || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.crop_protection || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.crop_protection || 0) * (tableCrops[2].area || 0))}`],

//       ['Harvesting & TPT',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.harvesting_tpt || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.harvesting_tpt || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.harvesting_tpt || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.harvesting_tpt || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.harvesting_tpt || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.harvesting_tpt || 0) * (tableCrops[2].area || 0))}`],

//       ['Total Cost of Production',
//         `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.total_cost_of_production || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.total_cost_of_production || 0) * (tableCrops[0].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.total_cost_of_production || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.total_cost_of_production || 0) * (tableCrops[1].area || 0))}`,
//         `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.total_cost_of_production || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.total_cost_of_production || 0) * (tableCrops[2].area || 0))}`],
//     ];

//     let csvContent = "data:text/csv;charset=utf-8,";
//     csvContent += headers.join(",") + "\n";
//     rows.forEach(row => {
//       csvContent += row.join(",") + "\n";
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `crop_comparison_rabi_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Helper function to check if a crop is complete
//   const isCropComplete = (crop) => {
//     return crop.cropType && crop.area > 0;
//   };

//   // Get first 3 crops for table display
//   const getTableCrops = () => {
//     return selectedCrops.filter(c => c.cropType).slice(0, 3);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         {/* <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900 mb-2">Crop Planning - Rabi Season 2025-26</h1>
//           <p className="text-slate-600">Select crops and areas for cost comparison analysis</p>
//         </div> */}

//         {/* Validation Errors */}
//         {validationErrors.length > 0 && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
//             <h3 className="font-bold text-red-800 mb-2">Please fix the following errors:</h3>
//             <ul className="list-disc pl-5 text-red-700">
//               {validationErrors.map((error, index) => (
//                 <li key={index}>{error}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Main Planning View */}
//         {view === 'planning' && (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
//             {/* Crop Selection Form */}
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//                   <Leaf className="w-5 h-5 text-emerald-600" />
//                   Crop Selection
//                 </h2>
//                 <div className="text-sm text-slate-700">
//                   Selected: <span className="font-bold">{selectedCrops.filter(c => c.cropType).length} / 3</span> crops
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 {selectedCrops.map((crop, index) => (
//                   <div key={crop.id} className={`border-2 rounded-xl p-6 bg-gradient-to-r from-slate-50 to-white ${isCropComplete(crop) ? 'border-emerald-200' : 'border-slate-200'
//                     }`}>
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center gap-3">
//                         <h3 className="font-bold text-slate-900">Crop #{index + 1}</h3>
//                         {isCropComplete(crop) && (
//                           <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
//                             ✓ Complete
//                           </span>
//                         )}
//                       </div>
//                       {selectedCrops.length > 1 && (
//                         <button
//                           onClick={() => removeCropRow(index)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       {/* Crop Type */}
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Crop Type *</label>
//                         <select
//                           value={crop.cropType}
//                           onChange={(e) => handleCropChange(index, 'cropType', e.target.value)}
//                           className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                         >
//                           <option value="">Select crop</option>
//                           {RABI_CROPS.map(cropName => (
//                             <option key={cropName} value={cropName}>{cropName}</option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Area */}
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">
//                           Area (acres) *
//                           <span className="text-xs font-normal text-slate-500 ml-2">
//                             Max: {crop.cropType && CROP_TYPES[crop.cropType]
//                               ? CROP_TYPES[crop.cropType].totalAcres.toLocaleString()
//                               : 'N/A'}
//                           </span>
//                         </label>
//                         <input
//                           type="number"
//                           value={crop.area}
//                           onChange={(e) => handleCropChange(index, 'area', e.target.value)}
//                           min="0"
//                           max={crop.cropType && CROP_TYPES[crop.cropType]
//                             ? CROP_TYPES[crop.cropType].totalAcres
//                             : 1000}
//                           step="0.1"
//                           className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                           placeholder="Enter area in acres"
//                         />
//                         <div className="text-xs text-slate-500 mt-1">
//                           Used: {Number(crop.area) || 0} acres
//                         </div>
//                       </div>
//                     </div>

//                     {/* Crop Info Preview */}
//                     {crop.cropType && CROP_TYPES[crop.cropType] && (
//                       <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
//                         <div className="grid grid-cols-3 gap-4 text-sm">
//                           <div>
//                             <p className="text-slate-600 text-xs">Total Cost per Acre</p>
//                             <p className="font-medium text-slate-900">
//                               Rs. {formatNumber(CROP_TYPES[crop.cropType].costPerAcre.total_cost_of_production)}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-600 text-xs">Total Acres Available</p>
//                             <p className="font-medium text-slate-900">
//                               {formatNumber(CROP_TYPES[crop.cropType].totalAcres)}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-600 text-xs">Days to Maturity</p>
//                             <p className="font-medium text-slate-900">{CROP_TYPES[crop.cropType].daysToMaturity}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Add Crop Button */}
//                 {selectedCrops.length < 10 && (
//                   <button
//                     onClick={addCropRow}
//                     className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition flex items-center justify-center gap-3"
//                   >
//                     <Plus className="w-5 h-5 text-emerald-600" />
//                     <span className="font-medium text-emerald-600">Add Another Crop</span>
//                     <span className="text-sm text-slate-500">(Max 10 crops)</span>
//                   </button>
//                 )}

//                 {/* Summary Stats */}
//                 <div className="bg-slate-100 rounded-xl p-6">
//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="bg-white rounded-lg p-4 border border-slate-200">
//                       <p className="text-slate-600 text-sm mb-1">Crops Selected</p>
//                       <p className="text-2xl font-bold text-slate-900">
//                         {selectedCrops.filter(c => c.cropType).length} / 3
//                       </p>
//                       {/* <p className="text-xs text-slate-500 mt-1">
//                         Minimum 3 required for table
//                       </p> */}
//                     </div>
//                     <div className="bg-white rounded-lg p-4 border border-slate-200">
//                       <p className="text-slate-600 text-sm mb-1">Total Area</p>
//                       <p className="text-2xl font-bold text-slate-900">
//                         {selectedCrops.reduce((sum, crop) => sum + (Number(crop.area) || 0), 0).toFixed(1)} acres
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-wrap justify-end gap-4 pt-6 border-t border-slate-200">
//               <button
//                 onClick={handleViewTable}
//                 disabled={selectedCrops.filter(c => c.cropType).length < 3}
//                 className={`px-8 py-3 rounded-lg transition font-medium flex items-center gap-3 text-lg ${selectedCrops.filter(c => c.cropType).length >= 3
//                   ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
//                   : 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                   }`}
//               >
//                 <Table className="w-6 h-6" />
//                 View Table
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Table View - Showing first 3 selected crops */}
//         {view === 'table' && (
//           <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-900">Crop Cost Comparison - Rabi 2025-26</h2>
//                 <p className="text-slate-600">Per Acre vs Total Cost Analysis (First 3 selected crops)</p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={exportToCSV}
//                   className="px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium flex items-center gap-2 text-blue-700"
//                 >
//                   <Download className="w-4 h-4" />
//                   Export CSV
//                 </button>
//                 <button
//                   onClick={() => setView('planning')}
//                   className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
//                 >
//                   Back to Planning
//                 </button>
//               </div>
//             </div>

//             {/* Comparison Table */}
//             <div className="overflow-x-auto rounded-xl border border-slate-200">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-800">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"></th>
//                     {getTableCrops().map((crop, index) => (
//                       <th key={index} className="ps-[6rem] px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider text-center" colSpan="2">
//                         {crop.cropType}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-100">
//                   {/* Season Header Row */}
//                   <tr className="bg-slate-100">
//                     <td className="px-6 py-4 font-bold text-slate-900">
//                       Rabi 2025-26
//                     </td>
//                     {getTableCrops().map((crop, index) => (
//                       <td key={index} className="px-6 py-4 text-center" colSpan="2">
//                         <div className="font-bold text-slate-900">
//                           {crop.area || 0} Acre
//                         </div>
//                         <div className="text-xs text-slate-600">
//                           of {formatNumber(CROP_TYPES[crop.cropType]?.totalAcres || 0)} acres
//                         </div>
//                       </td>
//                     ))}
//                   </tr>

//                   {/* Cost Rows */}
//                   {[
//                     { key: 'land_prep', label: 'Land Prep' },
//                     { key: 'seed', label: 'Seed' },
//                     { key: 'seed_treatment', label: 'Seed Treatment' },
//                     { key: 'sowing_charges', label: 'Sowing Charges' },
//                     { key: 'irrigation', label: 'Irrigation' },
//                     { key: 'fertilizers', label: 'Fertilizers' },
//                     { key: 'crop_protection', label: 'Crop Protection' },
//                     { key: 'harvesting_tpt', label: 'Harvesting & TPT' },
//                   ].map((item) => (
//                     <tr key={item.key} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 font-medium text-slate-900">
//                         {item.label}
//                       </td>
//                       {getTableCrops().map((crop, cropIndex) => {
//                         const cropData = CROP_TYPES[crop.cropType];
//                         const perAcre = cropData ? cropData.costPerAcre[item.key] || 0 : 0;
//                         const total = perAcre * (Number(crop.area) || 0);

//                         return (
//                           <React.Fragment key={cropIndex}>
//                             <td className="px-6 py-4 text-right border-r border-slate-200">
//                               <div className="font-medium text-slate-900">
//                                 {formatNumber(perAcre)}
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 text-right">
//                               <div className="font-bold text-slate-900">
//                                 {formatNumber(total)}
//                               </div>
//                             </td>
//                           </React.Fragment>
//                         );
//                       })}
//                     </tr>
//                   ))}

//                   {/* Total Cost Row */}
//                   <tr className="bg-emerald-50 font-bold">
//                     <td className="px-6 py-4 text-slate-900">
//                       Total Cost of Production
//                     </td>
//                     {getTableCrops().map((crop, cropIndex) => {
//                       const cropData = CROP_TYPES[crop.cropType];
//                       const perAcre = cropData ? cropData.costPerAcre.total_cost_of_production : 0;
//                       const total = perAcre * (Number(crop.area) || 0);

//                       return (
//                         <React.Fragment key={cropIndex}>
//                           <td className="px-6 py-4 text-right border-r border-emerald-200">
//                             <div className="text-slate-900">
//                               {formatNumber(perAcre)}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 text-right">
//                             <div className="text-emerald-700">
//                               {formatNumber(total)}
//                             </div>
//                           </td>
//                         </React.Fragment>
//                       );
//                     })}
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer Note */}
//             <div className="mt-6 text-sm text-slate-500 italic">
//               <p>Note: Showing first 3 selected crops. All costs are in Pakistani Rupees (Rs.). Per acre costs shown in left column, total costs in right column for each crop.</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CropPreparation;

















import React, { useState, useEffect } from 'react';
import { Calendar, Leaf, Plus, Trash2, Table, Download } from 'lucide-react';

const CropPreparation = () => {
  const [view, setView] = useState('home');
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState([
    { id: 1, cropType: '', area: 0 }
  ]);
  const [validationErrors, setValidationErrors] = useState([]);

  // Crop Database - Only Rabi crops
  const CROP_TYPES = {
    'Wheat': {
      botanicalName: 'Triticum aestivum',
      season: 'Rabi (Winter)',
      daysToMaturity: 120,
      totalAcres: 668,
      costPerAcre: {
        land_prep: 9800,
        seed: 5500,
        seed_treatment: 600,
        sowing_charges: 2000,
        irrigation: 14400,
        fertilizers: 36850,
        crop_protection: 3600,
        harvesting_tpt: 6060,
        total_cost_of_production: 78810
      }
    },
    'Raya (Mustard)': {
      botanicalName: 'Brassica juncea',
      season: 'Rabi (Winter)',
      daysToMaturity: 90,
      totalAcres: 447,
      costPerAcre: {
        land_prep: 10920,
        seed: 3600,
        seed_treatment: 0,
        sowing_charges: 0,
        irrigation: 10000,
        fertilizers: 20250,
        crop_protection: 3600,
        harvesting_tpt: 7500,
        total_cost_of_production: 55870
      }
    },
    'Rhodes Grass': {
      botanicalName: 'Chloris gayana',
      season: 'Zaid',
      daysToMaturity: 75,
      totalAcres: 692,
      costPerAcre: {
        land_prep: 4760,
        seed: 20000,
        seed_treatment: 0,
        sowing_charges: 1500,
        irrigation: 32000,
        fertilizers: 45100,
        crop_protection: 2000,
        harvesting_tpt: 0,
        total_cost_of_production: 105360
      }
    }
  };

  // Only Rabi crops available
  const RABI_CROPS = ['Wheat', 'Raya (Mustard)', 'Rhodes Grass'];

  useEffect(() => {
    setValidationErrors([]);
  }, [selectedCrops]);

  const handleCropChange = (index, field, value) => {
    const updatedCrops = [...selectedCrops];
    
    // If changing area, validate against max acres
    if (field === 'area') {
      const cropType = updatedCrops[index].cropType;
      if (cropType && CROP_TYPES[cropType]) {
        const maxAcres = CROP_TYPES[cropType].totalAcres;
        const numValue = Number(value);
        if (numValue > maxAcres) {
          alert(`Cannot exceed maximum ${maxAcres} acres for ${cropType}`);
          return;
        }
      }
    }
    
    updatedCrops[index] = { ...updatedCrops[index], [field]: value };
    setSelectedCrops(updatedCrops);
    setValidationErrors(prev => prev.filter(error => !error.includes(`Crop ${index + 1}`)));
  };

  const addCropRow = () => {
    if (selectedCrops.length >= 10) {
      alert('Maximum 10 crops allowed');
      return;
    }

    const newId = selectedCrops.length > 0 ? Math.max(...selectedCrops.map(c => c.id)) + 1 : 1;
    setSelectedCrops([...selectedCrops, {
      id: newId,
      cropType: '',
      area: 0
    }]);
  };

  const removeCropRow = (index) => {
    if (selectedCrops.length <= 1) {
      alert('At least one crop must be selected');
      return;
    }

    const updatedCrops = selectedCrops.filter((_, i) => i !== index);
    setSelectedCrops(updatedCrops);
  };

  const validateForm = () => {
    const errors = [];

    if (selectedCrops.filter(c => c.cropType).length < 3) {
      errors.push('Please select at least 3 crops to view the table');
    }

    selectedCrops.forEach((crop, index) => {
      if (crop.cropType) {
        if (!crop.area || crop.area <= 0) {
          errors.push(`Crop ${index + 1}: Please enter a valid area (greater than 0)`);
        }
        const cropData = CROP_TYPES[crop.cropType];
        if (cropData && crop.area > cropData.totalAcres) {
          errors.push(`Crop ${index + 1}: Area cannot exceed ${cropData.totalAcres} acres`);
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleViewTable = () => {
    if (validateForm()) {
      setView('table');
    } else {
      alert(`Please fix the following errors:\n\n${validationErrors.join('\n')}`);
    }
  };

  const savePlan = () => {
    if (validateForm()) {
      const newPlan = {
        id: Date.now(),
        name: `Plan ${plans.length + 1}`,
        crops: selectedCrops.filter(c => c.cropType).slice(0, 3),
        createdAt: new Date().toISOString()
      };
      setPlans([...plans, newPlan]);
      setView('home');
      setSelectedCrops([{ id: 1, cropType: '', area: 0 }]);
      setValidationErrors([]);
      setCurrentPlan(null);
    } else {
      alert(`Please fix the following errors:\n\n${validationErrors.join('\n')}`);
    }
  };

  const startNewPlan = () => {
    setSelectedCrops([{ id: 1, cropType: '', area: 0 }]);
    setValidationErrors([]);
    setCurrentPlan(null);
    setView('planning');
  };

  const viewPlan = (plan) => {
    setCurrentPlan(plan);
    setSelectedCrops(plan.crops);
    setView('table');
  };

  const deletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(p => p.id !== planId));
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  const exportToCSV = () => {
    const tableCrops = selectedCrops.filter(c => c.cropType).slice(0, 3);

    if (tableCrops.length < 3) {
      alert('Need at least 3 crops to export');
      return;
    }

    const headers = ['', tableCrops[0].cropType, tableCrops[1].cropType, tableCrops[2].cropType];

    const rows = [
      ['Rabi 2025-26',
        `${tableCrops[0].area || 0} Acre | ${CROP_TYPES[tableCrops[0].cropType]?.totalAcres || 0}`,
        `${tableCrops[1].area || 0} Acre | ${CROP_TYPES[tableCrops[1].cropType]?.totalAcres || 0}`,
        `${tableCrops[2].area || 0} Acre | ${CROP_TYPES[tableCrops[2].cropType]?.totalAcres || 0}`],

      ['Land Prep',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.land_prep || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.land_prep || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.land_prep || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.land_prep || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.land_prep || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.land_prep || 0) * (tableCrops[2].area || 0))}`],

      ['Seed',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed || 0) * (tableCrops[2].area || 0))}`],

      ['Seed Treatment',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed_treatment || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.seed_treatment || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed_treatment || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.seed_treatment || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed_treatment || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.seed_treatment || 0) * (tableCrops[2].area || 0))}`],

      ['Sowing Charges',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.sowing_charges || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.sowing_charges || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.sowing_charges || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.sowing_charges || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.sowing_charges || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.sowing_charges || 0) * (tableCrops[2].area || 0))}`],

      ['Irrigation',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.irrigation || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.irrigation || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.irrigation || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.irrigation || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.irrigation || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.irrigation || 0) * (tableCrops[2].area || 0))}`],

      ['Fertilizers',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.fertilizers || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.fertilizers || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.fertilizers || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.fertilizers || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.fertilizers || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.fertilizers || 0) * (tableCrops[2].area || 0))}`],

      ['Crop Protection',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.crop_protection || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.crop_protection || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.crop_protection || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.crop_protection || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.crop_protection || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.crop_protection || 0) * (tableCrops[2].area || 0))}`],

      ['Harvesting & TPT',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.harvesting_tpt || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.harvesting_tpt || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.harvesting_tpt || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.harvesting_tpt || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.harvesting_tpt || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.harvesting_tpt || 0) * (tableCrops[2].area || 0))}`],

      ['Total Cost of Production',
        `${formatNumber(CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.total_cost_of_production || 0)} | ${formatNumber((CROP_TYPES[tableCrops[0].cropType]?.costPerAcre.total_cost_of_production || 0) * (tableCrops[0].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.total_cost_of_production || 0)} | ${formatNumber((CROP_TYPES[tableCrops[1].cropType]?.costPerAcre.total_cost_of_production || 0) * (tableCrops[1].area || 0))}`,
        `${formatNumber(CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.total_cost_of_production || 0)} | ${formatNumber((CROP_TYPES[tableCrops[2].cropType]?.costPerAcre.total_cost_of_production || 0) * (tableCrops[2].area || 0))}`],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crop_comparison_rabi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCropComplete = (crop) => {
    return crop.cropType && crop.area > 0;
  };

  const getTableCrops = () => {
    return selectedCrops.filter(c => c.cropType).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Crop Planning - Rabi Season 2025-26</h1>
          <p className="text-slate-600">Manage your crop plans and cost analysis</p>
        </div> */}

        {/* HOME VIEW - Show all plans */}
        {view === 'home' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">My Crop Plans</h2>
              <button
                onClick={startNewPlan}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add New Plan
              </button>
            </div>

            {plans.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
                <Leaf className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Plans Yet</h3>
                <p className="text-slate-600 mb-6">Create your first crop plan to get started</p>
                <button
                  onClick={startNewPlan}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-xl border-2 border-slate-200 shadow-lg hover:shadow-xl transition overflow-hidden">
                    <div className="bg-emerald-600 px-6 py-4">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-emerald-100 text-sm">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        {plan.crops.map((crop, idx) => (
                          <div key={idx} className="border-2 border-slate-200 rounded-lg p-3 bg-slate-50">
                            <div className="font-bold text-slate-900">{crop.cropType}</div>
                            <div className="text-sm text-slate-600">
                              {crop.area} acres
                            </div>
                            <div className="text-xs text-emerald-600 font-medium mt-1">
                              Cost: Rs. {formatNumber((CROP_TYPES[crop.cropType]?.costPerAcre.total_cost_of_production || 0) * crop.area)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewPlan(plan)}
                          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && view === 'planning' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-bold text-red-800 mb-2">Please fix the following errors:</h3>
            <ul className="list-disc pl-5 text-red-700">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* PLANNING VIEW */}
        {view === 'planning' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Crop Selection
                </h2>
                <div className="text-sm text-slate-700">
                  Selected: <span className="font-bold">{selectedCrops.filter(c => c.cropType).length} / 3</span> crops
                </div>
              </div>

              <div className="space-y-6">
                {selectedCrops.map((crop, index) => (
                  <div key={crop.id} className={`border-4 rounded-xl p-6 bg-gradient-to-r from-slate-50 to-white ${isCropComplete(crop) ? 'border-emerald-400 shadow-lg' : 'border-slate-300'
                    }`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-900">Crop #{index + 1}</h3>
                        {isCropComplete(crop) && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                            ✓ Complete
                          </span>
                        )}
                      </div>
                      {selectedCrops.length > 1 && (
                        <button
                          onClick={() => removeCropRow(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Crop Type *</label>
                        <select
                          value={crop.cropType}
                          onChange={(e) => handleCropChange(index, 'cropType', e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        >
                          <option value="">Select crop</option>
                          {RABI_CROPS.map(cropName => (
                            <option key={cropName} value={cropName}>{cropName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Area (acres) *
                          <span className="text-xs font-normal text-slate-500 ml-2">
                            Max: {crop.cropType && CROP_TYPES[crop.cropType]
                              ? CROP_TYPES[crop.cropType].totalAcres.toLocaleString()
                              : 'N/A'}
                          </span>
                        </label>
                        <input
                          type="number"
                          value={crop.area}
                          onChange={(e) => handleCropChange(index, 'area', e.target.value)}
                          min="0"
                          max={crop.cropType && CROP_TYPES[crop.cropType]
                            ? CROP_TYPES[crop.cropType].totalAcres
                            : 1000}
                          step="0.1"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          placeholder="Enter area in acres"
                        />
                        <div className="text-xs text-slate-500 mt-1">
                          Used: {Number(crop.area) || 0} acres
                        </div>
                      </div>
                    </div>

                    {crop.cropType && CROP_TYPES[crop.cropType] && (
                      <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600 text-xs">Total Cost per Acre</p>
                            <p className="font-medium text-slate-900">
                              Rs. {formatNumber(CROP_TYPES[crop.cropType].costPerAcre.total_cost_of_production)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-xs">Total Acres Available</p>
                            <p className="font-medium text-slate-900">
                              {formatNumber(CROP_TYPES[crop.cropType].totalAcres)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-xs">Days to Maturity</p>
                            <p className="font-medium text-slate-900">{CROP_TYPES[crop.cropType].daysToMaturity}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {selectedCrops.length < 10 && (
                  <button
                    onClick={addCropRow}
                    className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition flex items-center justify-center gap-3"
                  >
                    <Plus className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-600">Add Another Crop</span>
                    <span className="text-sm text-slate-500">(Max 10 crops)</span>
                  </button>
                )}

                <div className="bg-slate-100 rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-600 text-sm mb-1">Crops Selected</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {selectedCrops.filter(c => c.cropType).length} / 3
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-600 text-sm mb-1">Total Area</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {selectedCrops.reduce((sum, crop) => sum + (Number(crop.area) || 0), 0).toFixed(1)} acres
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={() => setView('home')}
                className="px-6 py-3 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleViewTable}
                disabled={selectedCrops.filter(c => c.cropType).length < 3}
                className={`px-8 py-3 rounded-lg transition font-medium flex items-center gap-3 text-lg ${selectedCrops.filter(c => c.cropType).length >= 3
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <Table className="w-6 h-6" />
                Preview Table
              </button>
            </div>
          </div>
        )}

        {/* TABLE VIEW */}
        {view === 'table' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Crop Cost Comparison - Rabi 2025-26</h2>
                <p className="text-slate-600">Per Acre vs Total Cost Analysis (First 3 selected crops)</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition font-medium flex items-center gap-2 text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={savePlan}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2 shadow-lg"
                >
                  Save Plan
                </button>
                <button
                  onClick={() => setView('planning')}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
                >
                  Back to Edit
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider"></th>
                    {getTableCrops().map((crop, index) => (
                      <th key={index} className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider" colSpan="2">
                        {crop.cropType}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  <tr className="bg-slate-100">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      Rabi 2025-26
                    </td>
                    {getTableCrops().map((crop, index) => (
                      <td key={index} className="px-6 py-4 text-center" colSpan="2">
                        <div className="font-bold text-slate-900">
                          {crop.area || 0} Acre
                        </div>
                        <div className="text-xs text-slate-600">
                          of {formatNumber(CROP_TYPES[crop.cropType]?.totalAcres || 0)} acres
                        </div>
                      </td>
                    ))}
                  </tr>

                  {[
                    { key: 'land_prep', label: 'Land Prep' },
                    { key: 'seed', label: 'Seed' },
                    { key: 'seed_treatment', label: 'Seed Treatment' },
                    { key: 'sowing_charges', label: 'Sowing Charges' },
                    { key: 'irrigation', label: 'Irrigation' },
                    { key: 'fertilizers', label: 'Fertilizers' },
                    { key: 'crop_protection', label: 'Crop Protection' },
                    { key: 'harvesting_tpt', label: 'Harvesting & TPT' },
                  ].map((item) => (
                    <tr key={item.key} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.label}
                      </td>
                      {getTableCrops().map((crop, cropIndex) => {
                        const cropData = CROP_TYPES[crop.cropType];
                        const perAcre = cropData ? cropData.costPerAcre[item.key] || 0 : 0;
                        const total = perAcre * (Number(crop.area) || 0);

                        return (
                          <React.Fragment key={cropIndex}>
                            <td className="px-6 py-4 text-right border-r border-slate-200">
                              <div className="font-medium text-slate-900">
                                {formatNumber(perAcre)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="font-bold text-slate-900">
                                {formatNumber(total)}
                              </div>
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}

                  <tr className="bg-emerald-50 font-bold">
                    <td className="px-6 py-4 text-slate-900">
                      Total Cost of Production
                    </td>
                    {getTableCrops().map((crop, cropIndex) => {
                      const cropData = CROP_TYPES[crop.cropType];
                      const perAcre = cropData ? cropData.costPerAcre.total_cost_of_production : 0;
                      const total = perAcre * (Number(crop.area) || 0);

                      return (
                        <React.Fragment key={cropIndex}>
                          <td className="px-6 py-4 text-right border-r border-emerald-200">
                            <div className="text-slate-900">
                              {formatNumber(perAcre)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-emerald-700">
                              {formatNumber(total)}
                            </div>
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-sm text-slate-500 italic">
              <p>Note: Showing first 3 selected crops. All costs are in Pakistani Rupees (Rs.). Per acre costs shown in left column, total costs in right column for each crop.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPreparation;
