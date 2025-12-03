// import React, { useState, useEffect } from 'react';
// import { MapPin, Calendar, Droplets, Sun, Sprout, ArrowLeft, Info, Leaf, Bug, Beaker, TrendingUp, Pill, Truck, Shield, Bean } from 'lucide-react';
// import CROP_DATABASE from "../../data/crops";
// import Calender from '../Calender';
// const CropPreparation = () => {
//   const [view, setView] = useState('addCrop');
//   const [crops, setCrops] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [plantings, setPlantings] = useState([]);
//   const [selectedCrop, setSelectedCrop] = useState(null);
//   const [step, setStep] = useState(1);
//   const costItems = [
//     { key: 'land_prep', label: 'Land Preparation', icon: <Sprout /> },
//     { key: 'seed', label: 'Seed Cost', icon: <Bean /> },
//     { key: 'seed_treatment', label: 'Seed Treatment', icon: <Pill /> },
//     { key: 'sowing_charges', label: 'Sowing Charges', icon: <Truck /> },
//     { key: 'irrigation', label: 'Irrigation', icon: <Droplets /> },
//     { key: 'fertilizers', label: 'Fertilizers', icon: <Beaker /> },
//     { key: 'crop_protection', label: 'Crop Protection', icon: <Shield /> },
//     { key: 'harvesting_tpt', label: 'Harvesting & Transport', icon: <Truck /> }
//   ];
//   const [cropForm, setCropForm] = useState({ type: '', variety: '', locationId: '' });
//   const [plantingForm, setPlantingForm] = useState({
//     cropId: null,
//     locationId: '',
//     numPlantings: 1,
//     seedStarted: new Date().toISOString().split('T')[0],
//     planted: new Date().toISOString().split('T')[0],
//     plantSpacing: 0,
//     rowSpacing: 0,
//     plantedArea: 100.0,
//     plannedHarvest: '',
//     expectedHarvestAmount: 0,
//     harvestDuration: 7 // Default 7 days for harvest period
//   });
//   useEffect(() => {
//     fetchLocationsFromAPI();
//   }, []);

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
//           { id: 2, name: 'Field B - Rawalpindi', areaSqm: 1500, status: 'Active' }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//       setLocations([
//         { id: 1, name: 'Field A - Islamabad', areaSqm: 2000, status: 'Active' },
//         { id: 2, name: 'Field B - Rawalpindi', areaSqm: 1500, status: 'Active' }
//       ]);
//     }
//   };
//   const handleAddCrop = () => {
//     if (!cropForm.type || !cropForm.variety || !cropForm.locationId) {
//       alert('Please select crop type, variety, and location');
//       return;
//     }
//     const cropData = CROP_DATABASE[cropForm.type];
//     const location = locations.find(l => l.id === parseInt(cropForm.locationId));
//     const newCrop = {
//       id: Date.now(),
//       type: cropForm.type,
//       variety: cropForm.variety,
//       location: location,
//       ...cropData
//     };
//     setCrops([...crops, newCrop]);
//     setCropForm({ type: '', variety: '', locationId: '' });
//     setView('cropList');
//   };

//   const isLocationPlanted = (locationId) => {
//     return plantings.some(p => p.location.id === locationId && !p.harvested);
//   };
//   const handleStartPlanting = (crop) => {
//     setSelectedCrop(crop);

//     const today = new Date();
//     const expectedHarvest = new Date(today);
//     expectedHarvest.setDate(today.getDate() + crop.daysToMaturity);

//     setPlantingForm({
//       cropId: crop.id,
//       locationId: '',
//       numPlantings: 1,
//       seedStarted: today.toISOString().split('T')[0],
//       planted: today.toISOString().split('T')[0],
//       plantSpacing: crop.plantSpacing,
//       rowSpacing: crop.rowSpacing,
//       plantedArea: 100.0,
//       plannedHarvest: expectedHarvest.toISOString().split('T')[0],
//       expectedHarvestAmount: 0
//     });
//     setView('plantingWizard');
//     setStep(1);
//   };
//   // Calculate yield based on optimal formula
//   const calculateYield = (crop, area) => {
//     const yieldPerAcre = {
//       'Wheat': 50,
//       'Rice': 45,
//       'Sesame': 8,
//       'Maize': 35,
//       'Cotton': 20,
//       'Potato': 200,
//       'Onion': 150,
//       'Sorghum': 40
//     };
//     const baseYield = yieldPerAcre[crop.type] || 30;
//     const areaInAcres = (area / 4047) || 0.024; // 1 acre = 4047 sqm
//     const calculatedYield = baseYield * areaInAcres;
//     return parseFloat(calculatedYield.toFixed(2));
//   };
//   // Validate planting dates
//   const validatePlantingDates = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const seedDate = new Date(plantingForm.seedStarted);
//     const plantDate = new Date(plantingForm.planted);
//     const harvestDate = new Date(plantingForm.plannedHarvest);
//     if (seedDate < today) {
//       alert('⚠️ Sowing date cannot be in the past');
//       return false;
//     }
//     if (plantDate < today) {
//       alert('⚠️ Planting date cannot be in the past');
//       return false;
//     }
//     if (harvestDate <= plantDate) {
//       alert('⚠️ Harvest date must be after planting date');
//       return false;
//     }
//     if (plantDate < seedDate) {
//       alert('⚠️ Planting date cannot be before sowing date');
//       return false;
//     }
//     const daysDifference = Math.floor((harvestDate - plantDate) / (1000 * 60 * 60 * 24));
//     if (daysDifference < selectedCrop.daysToMaturity * 0.8) {
//       alert(`⚠️ Harvest period too short. Recommend at least ${selectedCrop.daysToMaturity} days after planting`);
//       return false;
//     }
//     return true;
//   };
//   const handleCreatePlanting = () => {
//     if (!validatePlantingDates()) {
//       return;
//     }
//     // Auto-calculate yield
//     const calculatedYield = calculateYield(selectedCrop, plantingForm.plantedArea);
//     const newPlanting = {
//       id: Date.now(),
//       crop: selectedCrop,
//       location: location,
//       ...plantingForm,
//       expectedHarvestAmount: calculatedYield,
//       createdAt: new Date().toISOString(),
//       harvested: false
//     };
//     setPlantings([...plantings, newPlanting]);
//     alert('✓ Planting created successfully!\nExpected Yield: ' + calculatedYield + ' ' + selectedCrop.harvestUnits);
//     setView('schedule');
//   };
//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };
//   const getFirstDayOfMonth = (month, year) => {
//     return new Date(year, month, 1).getDay();
//   };
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="max-w-7xl mx-auto p-6">
//         {view === 'addCrop' && (
//           <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
//             <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
//               <Leaf className="w-6 h-6 text-emerald-600" />
//               Add New Crop
//             </h2>

//             <div className="space-y-5 max-w-full">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">Crop Type *</label>
//                 <select
//                   value={cropForm.type}
//                   onChange={(e) => setCropForm({ ...cropForm, type: e.target.value, variety: '', locationId: '' })}
//                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                 >
//                   <option value="">Select crop type</option>
//                   {Object.keys(CROP_DATABASE).sort().map(crop => (
//                     <option key={crop} value={crop}>{crop}</option>
//                   ))}
//                 </select>
//               </div>

//               {cropForm.type && (
//                 <>
//                   <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
//                     <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
//                       <Info className="w-4 h-4 text-emerald-600" />
//                       Crop Details
//                     </h3>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <p className="text-slate-600 text-xs">Botanical Name</p>
//                         <p className="font-medium text-slate-900">{CROP_DATABASE[cropForm.type].botanicalName}</p>
//                       </div>
//                       <div>
//                         <p className="text-slate-600 text-xs">Season</p>
//                         <p className="font-medium text-slate-900">{CROP_DATABASE[cropForm.type].season}</p>
//                       </div>
//                       <div>
//                         <p className="text-slate-600 text-xs">Days to Maturity</p>
//                         <p className="font-medium text-slate-900">{CROP_DATABASE[cropForm.type].daysToMaturity} days</p>
//                       </div>
//                       <div>
//                         <p className="text-slate-600 text-xs">Optimal Sowing</p>
//                         <p className="font-medium text-slate-900 text-xs">{CROP_DATABASE[cropForm.type].optimalSowingTime}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">Variety/Strain *</label>
//                     <select
//                       value={cropForm.variety}
//                       onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
//                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                     >
//                       <option value="">Select variety</option>
//                       {CROP_DATABASE[cropForm.type].varieties.map(variety => (
//                         <option key={variety} value={variety}>{variety}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">Select Location *</label>
//                     <select
//                       value={cropForm.locationId}
//                       onChange={(e) => setCropForm({ ...cropForm, locationId: e.target.value })}
//                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                     >
//                       <option value="">Choose a location...</option>
//                       {locations.map(location => (
//                         <option key={location.id} value={location.id}>
//                           {location.name} - {location.areaSqm} sqm
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </>
//               )}

//               <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
//                 {crops.length > 0 && (
//                   <button
//                     onClick={() => setView('cropList')}
//                     className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   onClick={handleAddCrop}
//                   disabled={!cropForm.type || !cropForm.variety || !cropForm.locationId}
//                   className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Save Crop
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Crop List */}
//         {view === 'cropList' && (
//           <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
//             <h2 className="text-2xl font-bold text-slate-900 mb-6">My Crops</h2>

//             {crops.length === 0 ? (
//               <div className="text-center py-12">
//                 <Sprout className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500 mb-4">No crops added yet</p>
//                 <button
//                   onClick={() => setView('addCrop')}
//                   className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
//                 >
//                   Add Your First Crop
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {crops.map(crop => (
//                   <div key={crop.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition bg-slate-50">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between mb-2">
//                           <h3 className="text-lg font-bold text-slate-900">
//                             {crop.type} - {crop.variety}
//                           </h3>
//                           <button
//                             onClick={() => handleStartPlanting(crop)}
//                             className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
//                           >
//                             Add Planting
//                           </button>
//                         </div>
//                         <p className="text-sm text-slate-600 italic mt-1">{crop.botanicalName}</p>
//                         {crop.location && (
//                           <div className="flex items-center gap-2 mt-2 text-sm text-slate-700">
//                             <MapPin className="w-4 h-4 text-emerald-600" />
//                             <span className="font-medium">{crop.location.name}</span>
//                             <span className="text-slate-500">({crop.location.areaSqm} sqm)</span>
//                           </div>
//                         )}
//                         <div className="mt-4 grid grid-cols-4 gap-3">
//                           <div className="bg-white rounded p-3 text-sm border border-slate-200">
//                             <p className="text-slate-600 text-xs">Season</p>
//                             <p className="font-semibold text-slate-900">{crop.season}</p>
//                           </div>
//                           <div className="bg-white rounded p-3 text-sm border border-slate-200">
//                             <p className="text-slate-600 text-xs">Maturity</p>
//                             <p className="font-semibold text-slate-900">{crop.daysToMaturity} d</p>
//                           </div>
//                           <div className="bg-white rounded p-3 text-sm border border-slate-200">
//                             <p className="text-slate-600 text-xs">Method</p>
//                             <p className="font-semibold text-slate-900">{crop.startMethod}</p>
//                           </div>
//                           <div className="bg-white rounded p-3 text-sm border border-slate-200">
//                             <p className="text-slate-600 text-xs">Seed Rate</p>
//                             <p className="font-semibold text-slate-900 text-xs">{crop.seedRate}</p>
//                           </div>
//                         </div>

//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Planting Wizard */}
//         {view === 'plantingWizard' && selectedCrop && (
//           <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
//             <div className="flex items-center gap-3 mb-8">
//               <button
//                 onClick={() => setView('cropList')}
//                 className="p-2 hover:bg-slate-100 rounded-lg transition"
//               >
//                 <ArrowLeft className="w-5 h-5 text-slate-600" />
//               </button>
//               <h2 className="text-2xl font-bold text-slate-900">New Planting</h2>
//             </div>

//             {/* Progress Steps */}
//             <div className="flex items-center justify-center mb-8">
//               <div className="flex items-center gap-3 mx-3">
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
//                   }`}>
//                   1
//                 </div>
//                 <span className="text-sm font-bold text-slate-700">Cost Overview</span>
//               </div>
//               <div className={`w-12 h-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
//               <div className="flex items-center gap-3">
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
//                   }`}>
//                   2
//                 </div>
//                 <span className="text-sm font-bold text-slate-700">Details</span>
//               </div>
//             </div>

//             {/* Step 1: Cost Breakdown */}
//             {step === 1 && (
//               <div className="space-y-6">
//                 {/* Cost Breakdown */}
//                 {selectedCrop.cost && (
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
//                     <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
//                       <TrendingUp className="w-8 h-8 text-blue-600" />
//                       Cost Breakdown Analysis
//                     </h3>

//                     {/* Table Header */}
//                     <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg overflow-hidden mb-2">
//                       <div className="grid grid-cols-12 gap-4 p-6 text-white font-bold">
//                         <div className="col-span-4">Cost Category</div>
//                         <div className="col-span-4 text-right">Per Acre (Rs.)</div>
//                         <div className="col-span-4 text-right">Total for All Acres (Rs.)</div>
//                       </div>
//                     </div>

//                     {/* Cost Items */}
//                     <div className="space-y-2 mb-4">
//                       {costItems.map((item, idx) => (
//                         <div
//                           key={item.key}
//                           className={`grid grid-cols-12 gap-4 p-5 rounded-lg transition-all hover:shadow-md ${idx % 2 === 0
//                             ? 'bg-white border border-blue-100'
//                             : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100'
//                             }`}
//                         >
//                           {/* Category */}
//                           <div className="col-span-4 flex items-center gap-3">
//                             <span className="text-3xl">{item.icon}</span>
//                             <div>
//                               <p className="font-semibold text-slate-900">{item.label}</p>
//                               <p className="text-xs text-slate-500">{item.key}</p>
//                             </div>
//                           </div>

//                           {/* Per Acre */}
//                           <div className="col-span-4 flex items-center justify-end pr-4">
//                             <div className="text-right">
//                               <p className="text-lg font-bold text-emerald-600">
//                                 Rs. {selectedCrop.cost.per_acre[item.key].toLocaleString('en-PK')}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Total for All Acres */}
//                           <div className="col-span-4 flex items-center justify-end">
//                             <div className="bg-gradient-to-l from-emerald-100 to-blue-100 px-6 py-4 rounded-lg border-2 border-emerald-300 w-full text-right">
//                               <p className="text-lg font-bold text-emerald-700">
//                                 Rs. {selectedCrop.cost.total_for_all_acres[item.key].toLocaleString('en-PK')}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Total Row */}
//                     <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg overflow-hidden mt-6">
//                       <div className="grid grid-cols-12 gap-4 p-6 text-white font-bold">
//                         <div className="col-span-4 text-lg">Total Cost of Production</div>
//                         <div className="col-span-4 text-right text-2xl">
//                           Rs. {selectedCrop.cost.per_acre.total_cost_of_production.toLocaleString('en-PK')}
//                         </div>
//                         <div className="col-span-4 text-right text-2xl">
//                           Rs. {selectedCrop.cost.total_for_all_acres.total_cost_of_production.toLocaleString('en-PK')}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
//                   <button
//                     onClick={() => setView('cropList')}
//                     className="px-6 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm text-slate-700"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => setStep(2)}
//                     className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm"
//                   >
//                     Continue to Details
//                   </button>
//                 </div>

//               </div>
//             )}









//             {/* Step 2: Cultivation & Harvest Details */}
//             {step === 2 && (
//               <div className="space-y-6">
//                 <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
//                   <p className="text-sm text-emerald-800 font-medium">✓ Auto-populated planting details for {selectedCrop.type}</p>
//                 </div>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
//                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//                     <Sprout className="w-5 h-5 text-emerald-600" />
//                     Cultivation Details
//                   </h3>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Sowing Start Date *</label>
//                         <input
//                           type="date"
//                           value={plantingForm.seedStarted}
//                           onChange={(e) => setPlantingForm({ ...plantingForm, seedStarted: e.target.value })}
//                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                           min={new Date().toISOString().split('T')[0]}
//                         />
//                         <p className="text-xs text-slate-600 mt-1">Cannot be in the past</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Planting Date *</label>
//                         <input
//                           type="date"
//                           value={plantingForm.planted}
//                           onChange={(e) => setPlantingForm({ ...plantingForm, planted: e.target.value })}
//                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                           min={plantingForm.seedStarted}
//                         />
//                         <p className="text-xs text-slate-600 mt-1">Must be after sowing date</p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Plant Spacing (cm)</label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={plantingForm.plantSpacing}
//                           onChange={(e) => setPlantingForm({ ...plantingForm, plantSpacing: parseFloat(e.target.value) })}
//                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-700 mb-2">Row Spacing (cm)</label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={plantingForm.rowSpacing}
//                           onChange={(e) => setPlantingForm({ ...plantingForm, rowSpacing: parseFloat(e.target.value) })}
//                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700 mb-2">Planted Area (sqm)</label>
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={plantingForm.plantedArea}
//                         onChange={(e) => setPlantingForm({ ...plantingForm, plantedArea: parseFloat(e.target.value) })}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Harvest Plan */}
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
//                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//                     <Calendar className="w-5 h-5 text-slate-700" />
//                     Harvest Plan
//                   </h3>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700 mb-2">Planned Harvest Date *</label>
//                       <input
//                         type="date"
//                         value={plantingForm.plannedHarvest}
//                         onChange={(e) => setPlantingForm({ ...plantingForm, plannedHarvest: e.target.value })}
//                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                         min={new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]}
//                       />
//                       <p className="text-xs text-slate-600 mt-1">
//                         ⓘ Must be at least {selectedCrop.daysToMaturity} days after planting date
//                       </p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Yield ({selectedCrop.harvestUnits})</label>
//                       <div className="flex gap-2">
//                         <input
//                           type="number"
//                           step="0.01"
//                           value={plantingForm.expectedHarvestAmount}
//                           onChange={(e) => setPlantingForm({ ...plantingForm, expectedHarvestAmount: parseFloat(e.target.value) })}
//                           className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
//                         />
//                         <button
//                           onClick={() => {
//                             const calculated = calculateYield(selectedCrop, plantingForm.plantedArea);
//                             setPlantingForm({ ...plantingForm, expectedHarvestAmount: calculated });
//                           }}
//                           className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium text-sm"
//                           title="Auto-calculate based on area and crop type"
//                         >
//                           Auto
//                         </button>
//                       </div>
//                       <p className="text-xs text-slate-600 mt-1">
//                         ⓘ Formula: Base yield per acre × Area (acres) | Click 'Auto' to calculate
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Agronomic Guidelines */}
//                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
//                   <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//                     <Info className="w-5 h-5 text-amber-600" />
//                     Recommended Practices
//                   </h3>

//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div className="bg-white rounded p-3 border border-amber-200">
//                       <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
//                         <Droplets className="w-4 h-4 text-blue-500" />
//                         Water Requirement
//                       </p>
//                       <p className="text-slate-600 text-xs">{selectedCrop.waterRequirement}</p>
//                     </div>
//                     <div className="bg-white rounded p-3 border border-amber-200">
//                       <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
//                         <Beaker className="w-4 h-4 text-slate-600" />
//                         Soil Conditions
//                       </p>
//                       <p className="text-slate-600 text-xs">{selectedCrop.soilConditions}</p>
//                     </div>
//                     <div className="bg-white rounded p-3 border border-amber-200">
//                       <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
//                         <Sun className="w-4 h-4 text-yellow-500" />
//                         Light Profile
//                       </p>
//                       <p className="text-slate-600 text-xs">{selectedCrop.lightProfile}</p>
//                     </div>
//                     <div className="bg-white rounded p-3 border border-amber-200">
//                       <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
//                         <Bug className="w-4 h-4 text-red-500" />
//                         Pest/Disease
//                       </p>
//                       <p className="text-slate-600 text-xs">{selectedCrop.pests.slice(0, 2).join(', ')}</p>
//                     </div>
//                   </div>

//                   <div className="mt-4 space-y-2 text-xs">
//                     <div>
//                       <p className="font-semibold text-slate-900 mb-1">Critical Irrigations:</p>
//                       <p className="text-slate-600">{selectedCrop.criticalIrrigations.join(' • ')}</p>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-slate-900 mb-1">Harvest Indicators:</p>
//                       <p className="text-slate-600">{selectedCrop.harvestIndicators.join(' • ')}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
//                   <button
//                     onClick={() => setStep(1)}
//                     className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={handleCreatePlanting}
//                     className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
//                   >
//                     Create Planting
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Schedule View */}
//         {view === 'schedule' && (
//           <div>
//             <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//                   <Calendar className="w-6 h-6 text-slate-700" />
//                   Planting Schedule & Timeline
//                 </h2>
//                 <button
//                   onClick={() => setView('cropList')}
//                   className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
//                 >
//                   New Planting
//                 </button>
//               </div>

//               {plantings.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                   <p className="text-slate-500 mb-4">No plantings scheduled yet</p>
//                   <button
//                     onClick={() => setView('cropList')}
//                     className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
//                   >
//                     Create Your First Planting
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {crops.map(crop => {
//                     const cropPlantings = plantings.filter(p => p.crop.id === crop.id);
//                     if (cropPlantings.length === 0) return null;

//                     return (
//                       <div key={crop.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50 hover:shadow-md transition">
//                         <div className="flex gap-4">
//                           <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                             <Sprout className="w-5 h-5 text-white" />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="text-lg font-bold text-slate-900">{crop.type} - {crop.variety}</h3>
//                             <p className="text-sm text-slate-600 italic">{crop.botanicalName}</p>

//                             <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
//                               <div className="bg-white rounded p-3 border border-slate-200">
//                                 <p className="text-slate-600 text-xs">Total Plantings</p>
//                                 <p className="font-bold text-slate-900">{cropPlantings.length}</p>
//                               </div>
//                               <div className="bg-white rounded p-3 border border-slate-200">
//                                 <p className="text-slate-600 text-xs">Total Area</p>
//                                 <p className="font-bold text-slate-900">{cropPlantings.reduce((s, p) => s + p.plantedArea, 0).toFixed(1)} sqm</p>
//                               </div>
//                               <div className="bg-white rounded p-3 border border-slate-200">
//                                 <p className="text-slate-600 text-xs">Expected Yield</p>
//                                 <p className="font-bold text-slate-900">{cropPlantings.reduce((s, p) => s + p.expectedHarvestAmount, 0).toFixed(2)} {crop.harvestUnits}</p>
//                               </div>
//                               <div className="bg-white rounded p-3 border border-slate-200">
//                                 <p className="text-slate-600 text-xs">Status</p>
//                                 <p className="font-bold text-slate-900">{cropPlantings[0].harvested ? 'Done' : 'Active'}</p>
//                               </div>
//                             </div>

//                             {cropPlantings.map((planting, idx) => (
//                               <div key={idx} className="mt-4 bg-white rounded p-4 border border-slate-200">
//                                 <div className="flex justify-between items-center">
//                                   <div className="flex gap-6 text-xs flex-wrap">
//                                     <div>
//                                       <span className="text-amber-600 font-bold">●</span>
//                                       <span className="text-slate-600"> Sow: </span>
//                                       <span className="font-semibold text-slate-900">{new Date(planting.seedStarted).toLocaleDateString()}</span>
//                                     </div>
//                                     <div>
//                                       <span className="text-emerald-600 font-bold">●</span>
//                                       <span className="text-slate-600"> Plant: </span>
//                                       <span className="font-semibold text-slate-900">{new Date(planting.planted).toLocaleDateString()}</span>
//                                     </div>
//                                     <div>
//                                       <span className="text-slate-800 font-bold">●</span>
//                                       <span className="text-slate-600"> Harvest: </span>
//                                       <span className="font-semibold text-slate-900">{new Date(planting.plannedHarvest).toLocaleDateString()}</span>
//                                     </div>
//                                   </div>
//                                   {!planting.harvested && (
//                                     <button
//                                       onClick={() => {
//                                         const updated = plantings.map(p =>
//                                           p.id === planting.id ? { ...p, harvested: true } : p
//                                         );
//                                         setPlantings(updated);
//                                       }}
//                                       className="px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800 transition font-medium"
//                                     >
//                                       Mark Harvested
//                                     </button>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Calendar View */}
//             {plantings.length > 0 && <Calender getDaysInMonth={getDaysInMonth} getFirstDayOfMonth={getFirstDayOfMonth} plantings={plantings} />}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default CropPreparation;





import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Droplets, Sun, Sprout, ArrowLeft, Info, Leaf, Bug, Beaker, TrendingUp, Pill, Truck, Shield, Bean, AlertCircle } from 'lucide-react';
import PlantingCalendar from '../Calender';

const CropPreparation = () => {
  const [view, setView] = useState('addCrop');
  const [crops, setCrops] = useState([]);
  const [locations, setLocations] = useState([]);
  const [plantings, setPlantings] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [step, setStep] = useState(1);

  // Crop Database as constants
  const CROP_TYPES = {
    'Wheat': {
      botanicalName: 'Triticum aestivum',
      season: 'Rabi (Winter)',
      varieties: ['Arooj-22', 'Dilkash-21', 'Fakhr-e-Bakhar', 'Zinkol-16'],
      startMethod: 'Drill Sowing',
      lightProfile: 'Full Sun',
      daysToMaturity: 120,
      harvestWindow: { min: 115, max: 125 },
      optimalSowingTime: '1st – 20th November',
      rowSpacing: 22.5,
      plantSpacing: 25,
      seedRate: '50–60 kg/acre',
      soilConditions: 'Well-prepared, weed-free loam',
      waterRequirement: 'Moderate - 3-4 irrigations',
      criticalIrrigations: ['Tillering (20-25 DAS)', 'Stem elongation (45-50 DAS)', 'Booting (80-95 DAS)'],
      seedTreatment: 'Thiophanate methyl 2.5 g/kg OR Imidacloprid + Tebuconazole 2 ml/kg',
      diseases: ['Black Rust', 'Yellow Rust', 'Loose Smut', 'Karnal Bunt'],
      pests: ['Termites', 'Cutworm', 'Aphid', 'Pink Borer'],
      harvestIndicators: ['Stem and leaves turn yellow', 'Grain moisture 25-30%'],
      harvestUnits: 'maunds',
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
      varieties: ['Raya Anmol', 'BARD-1', 'Sultan Raya', 'KS-400'],
      startMethod: 'Broadcast or Line Sowing',
      lightProfile: 'Full Sun',
      daysToMaturity: 90,
      harvestWindow: { min: 85, max: 95 },
      optimalSowingTime: 'Mid-September – Early October',
      rowSpacing: 45,
      plantSpacing: 10,
      seedRate: '1.5–2 kg/acre',
      soilConditions: 'Well-drained, slightly sandy to loam soils',
      waterRequirement: 'Very Low – rain-fed or 1 irrigation',
      criticalIrrigations: ['Flower initiation', 'Pod formation'],
      seedTreatment: 'Not required',
      diseases: ['Alternaria Blight', 'White Rust', 'Downy Mildew'],
      pests: ['Aphids', 'Painted Bug', 'Sawfly'],
      harvestIndicators: ['Pods turn golden brown', 'Seeds become hard and rattle'],
      harvestUnits: 'maunds',
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
      season: 'Warm Season (Spring–Summer)',
      varieties: ['Fine Cut', 'Callide', 'Tolgar'],
      startMethod: 'Broadcast or Drill Sowing',
      lightProfile: 'Full Sun',
      daysToMaturity: 75,
      harvestWindow: { min: 70, max: 80 },
      optimalSowingTime: 'March – May',
      rowSpacing: 30,
      plantSpacing: 15,
      seedRate: '4–6 kg/acre',
      soilConditions: 'Sandy loam, well-drained soils',
      waterRequirement: 'High – 6–8 irrigations',
      criticalIrrigations: ['Early establishment', 'Tillering', 'After every cutting'],
      seedTreatment: 'Not used',
      diseases: ['Leaf Spot', 'Rust'],
      pests: ['Armyworm', 'Grasshoppers'],
      harvestIndicators: ['Cut at 50% flowering', 'Soft stems and green leaves'],
      harvestUnits: 'maunds (fresh fodder)',
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

  const costItems = [
    { key: 'land_prep', label: 'Land Preparation', icon: <Sprout /> },
    { key: 'seed', label: 'Seed Cost', icon: <Bean /> },
    { key: 'seed_treatment', label: 'Seed Treatment', icon: <Pill /> },
    { key: 'sowing_charges', label: 'Sowing Charges', icon: <Truck /> },
    { key: 'irrigation', label: 'Irrigation', icon: <Droplets /> },
    { key: 'fertilizers', label: 'Fertilizers', icon: <Beaker /> },
    { key: 'crop_protection', label: 'Crop Protection', icon: <Shield /> },
    { key: 'harvesting_tpt', label: 'Harvesting & Transport', icon: <Truck /> }
  ];

  const [cropForm, setCropForm] = useState({ type: '', variety: '', locationId: '' });
  const [plantingForm, setPlantingForm] = useState({
    cropId: null,
    locationId: '',
    numPlantings: 1,
    seedStarted: new Date().toISOString().split('T')[0],
    planted: new Date().toISOString().split('T')[0],
    plantSpacing: 0,
    rowSpacing: 0,
    plantedArea: 100.0,
    plannedHarvest: '',
    harvestWindowMin: 0,
    harvestWindowMax: 0,
    expectedHarvestAmount: 0,
    harvestDuration: 7
  });

  useEffect(() => {
    fetchLocationsFromAPI();
  }, []);

  const fetchLocationsFromAPI = async () => {
    try {
      const response = await fetch(
        "https://earthscansystems.com/farmerdatauser/userfarm/",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access")}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const transformedLocations = data.map(farm => ({
          id: farm.id,
          name: farm.farm_name || farm.location_name || 'Unknown Field',
          areaSqm: farm.area || 1000,
          status: 'Active'
        }));
        setLocations(transformedLocations);
      } else {
        setLocations([
          { id: 1, name: 'Field A - Islamabad', areaSqm: 2000, status: 'Active' },
          { id: 2, name: 'Field B - Rawalpindi', areaSqm: 1500, status: 'Active' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([
        { id: 1, name: 'Field A - Islamabad', areaSqm: 2000, status: 'Active' },
        { id: 2, name: 'Field B - Rawalpindi', areaSqm: 1500, status: 'Active' }
      ]);
    }
  };

  const handleAddCrop = () => {
    if (!cropForm.type || !cropForm.variety || !cropForm.locationId) {
      alert('Please select crop type, variety, and location');
      return;
    }

    const cropData = CROP_TYPES[cropForm.type];
    const location = locations.find(l => l.id === parseInt(cropForm.locationId));
    
    const newCrop = {
      id: Date.now(),
      type: cropForm.type,
      variety: cropForm.variety,
      location: location,
      ...cropData
    };

    setCrops([...crops, newCrop]);
    setCropForm({ type: '', variety: '', locationId: '' });
    setView('cropList');
  };

  const calculateTotalCost = (crop, areaSqm) => {
    const areaInAcres = areaSqm / 4047;
    return Math.round(crop.costPerAcre.total_cost_of_production * areaInAcres);
  };

  const calculateYield = (crop, area) => {
    const yieldPerAcre = {
      'Wheat': 50,
      'Raya (Mustard)': 8,
      'Rhodes Grass': 40
    };
    const baseYield = yieldPerAcre[crop.type] || 30;
    const areaInAcres = (area / 4047) || 0.024;
    return parseFloat((baseYield * areaInAcres).toFixed(2));
  };

  const handleStartPlanting = (crop) => {
    setSelectedCrop(crop);
    const today = new Date();
    const harvestMin = new Date(today);
    const harvestMax = new Date(today);

    harvestMin.setDate(today.getDate() + crop.harvestWindow.min);
    harvestMax.setDate(today.getDate() + crop.harvestWindow.max);

    setPlantingForm({
      cropId: crop.id,
      locationId: '',
      numPlantings: 1,
      seedStarted: today.toISOString().split('T')[0],
      planted: today.toISOString().split('T')[0],
      plantSpacing: crop.plantSpacing,
      rowSpacing: crop.rowSpacing,
      plantedArea: 100.0,
      plannedHarvest: harvestMin.toISOString().split('T')[0],
      harvestWindowMin: crop.harvestWindow.min,
      harvestWindowMax: crop.harvestWindow.max,
      expectedHarvestAmount: 0,
      harvestDuration: 7
    });
    setView('plantingWizard');
    setStep(1);
  };

  const validatePlantingDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seedDate = new Date(plantingForm.seedStarted);
    const plantDate = new Date(plantingForm.planted);
    const harvestDate = new Date(plantingForm.plannedHarvest);

    if (seedDate < today) {
      alert('⚠️ Sowing date cannot be in the past');
      return false;
    }
    if (plantDate < today) {
      alert('⚠️ Planting date cannot be in the past');
      return false;
    }
    if (harvestDate <= plantDate) {
      alert('⚠️ Harvest date must be after planting date');
      return false;
    }
    if (plantDate < seedDate) {
      alert('⚠️ Planting date cannot be before sowing date');
      return false;
    }

    const daysDifference = Math.floor((harvestDate - plantDate) / (1000 * 60 * 60 * 24));
    const minDays = selectedCrop.harvestWindow.min;
    const maxDays = selectedCrop.harvestWindow.max;

    if (daysDifference < minDays) {
      alert(`⚠️ Harvest too early. Minimum: ${minDays} days`);
      return false;
    }
    if (daysDifference > maxDays) {
      alert(`⚠️ Harvest too late. Maximum: ${maxDays} days`);
      return false;
    }

    return true;
  };

  const handleCreatePlanting = () => {
    if (!validatePlantingDates()) {
      return;
    }

    const calculatedYield = calculateYield(selectedCrop, plantingForm.plantedArea);
    const totalCost = calculateTotalCost(selectedCrop, plantingForm.plantedArea);

    const newPlanting = {
      id: Date.now(),
      crop: selectedCrop,
      location: locations.find(l => l.id === parseInt(plantingForm.locationId)),
      ...plantingForm,
      expectedHarvestAmount: calculatedYield,
      totalCost: totalCost,
      createdAt: new Date().toISOString(),
      harvested: false
    };

    setPlantings([...plantings, newPlanting]);
    alert(`✓ Planting created successfully!\nExpected Yield: ${calculatedYield} ${selectedCrop.harvestUnits}\nTotal Cost: Rs. ${totalCost.toLocaleString('en-PK')}`);
    setView('schedule');
  };



  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Add Crop View */}
        {view === 'addCrop' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-600" />
              Add New Crop
            </h2>

            <div className="space-y-5 max-w-full">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Crop Type *</label>
                <select
                  value={cropForm.type}
                  onChange={(e) => setCropForm({ ...cropForm, type: e.target.value, variety: '', locationId: '' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                  <option value="">Select crop type</option>
                  {Object.keys(CROP_TYPES).sort().map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {cropForm.type && (
                <>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-600" />
                      Crop Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600 text-xs">Botanical Name</p>
                        <p className="font-medium text-slate-900">{CROP_TYPES[cropForm.type].botanicalName}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Season</p>
                        <p className="font-medium text-slate-900">{CROP_TYPES[cropForm.type].season}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Days to Maturity</p>
                        <p className="font-medium text-slate-900">{CROP_TYPES[cropForm.type].daysToMaturity} days</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Optimal Sowing</p>
                        <p className="font-medium text-slate-900 text-xs">{CROP_TYPES[cropForm.type].optimalSowingTime}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Variety/Strain *</label>
                    <select
                      value={cropForm.variety}
                      onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    >
                      <option value="">Select variety</option>
                      {CROP_TYPES[cropForm.type].varieties.map(variety => (
                        <option key={variety} value={variety}>{variety}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Select Location *</label>
                    <select
                      value={cropForm.locationId}
                      onChange={(e) => setCropForm({ ...cropForm, locationId: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    >
                      <option value="">Choose a location...</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name} - {location.areaSqm} sqm
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                {crops.length > 0 && (
                  <button
                    onClick={() => setView('cropList')}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleAddCrop}
                  disabled={!cropForm.type || !cropForm.variety || !cropForm.locationId}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crop List View */}
        {view === 'cropList' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">My Crops</h2>

            {crops.length === 0 ? (
              <div className="text-center py-12">
                <Sprout className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No crops added yet</p>
                <button
                  onClick={() => setView('addCrop')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Add Your First Crop
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {crops.map(crop => (
                  <div key={crop.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition bg-slate-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {crop.type} - {crop.variety}
                          </h3>
                          <button
                            onClick={() => handleStartPlanting(crop)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
                          >
                            Add Planting
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 italic mt-1">{crop.botanicalName}</p>
                        {crop.location && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-slate-700">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span className="font-medium">{crop.location.name}</span>
                            <span className="text-slate-500">({crop.location.areaSqm} sqm)</span>
                          </div>
                        )}
                        <div className="mt-4 grid grid-cols-4 gap-3">
                          <div className="bg-white rounded p-3 text-sm border border-slate-200">
                            <p className="text-slate-600 text-xs">Season</p>
                            <p className="font-semibold text-slate-900">{crop.season}</p>
                          </div>
                          <div className="bg-white rounded p-3 text-sm border border-slate-200">
                            <p className="text-slate-600 text-xs">Maturity</p>
                            <p className="font-semibold text-slate-900">{crop.daysToMaturity} d</p>
                          </div>
                          <div className="bg-white rounded p-3 text-sm border border-slate-200">
                            <p className="text-slate-600 text-xs">Method</p>
                            <p className="font-semibold text-slate-900">{crop.startMethod}</p>
                          </div>
                          <div className="bg-white rounded p-3 text-sm border border-slate-200">
                            <p className="text-slate-600 text-xs">Seed Rate</p>
                            <p className="font-semibold text-slate-900 text-xs">{crop.seedRate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Planting Wizard */}
        {view === 'plantingWizard' && selectedCrop && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setView('cropList')}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-2xl font-bold text-slate-900">New Planting</h2>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-3 mx-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  1
                </div>
                <span className="text-sm font-bold text-slate-700">Cost Overview</span>
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  2
                </div>
                <span className="text-sm font-bold text-slate-700">Details</span>
              </div>
            </div>

            {/* Step 1: Cost Breakdown */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    Cost Breakdown Analysis
                  </h3>

                  <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg overflow-hidden mb-2">
                    <div className="grid grid-cols-12 gap-4 p-6 text-white font-bold">
                      <div className="col-span-4">Cost Category</div>
                      <div className="col-span-4 text-right">Per Acre (Rs.)</div>
                      <div className="col-span-4 text-right">Total (Rs.)</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {costItems.map((item, idx) => (
                      <div
                        key={item.key}
                        className={`grid grid-cols-12 gap-4 p-5 rounded-lg transition-all hover:shadow-md ${idx % 2 === 0 ? 'bg-white border border-blue-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100'}`}
                      >
                        <div className="col-span-4 flex items-center gap-3">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <p className="font-semibold text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.key}</p>
                          </div>
                        </div>

                        <div className="col-span-4 flex items-center justify-end pr-4">
                          <p className="text-lg font-bold text-emerald-600">
                            Rs. {selectedCrop.costPerAcre[item.key].toLocaleString('en-PK')}
                          </p>
                        </div>

                        <div className="col-span-4 flex items-center justify-end">
                          <div className="bg-gradient-to-l from-emerald-100 to-blue-100 px-6 py-4 rounded-lg border-2 border-emerald-300 w-full text-right">
                            <p className="text-lg font-bold text-emerald-700">
                              Rs. {Math.round((selectedCrop.costPerAcre[item.key] * selectedCrop.totalAcres)).toLocaleString('en-PK')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg overflow-hidden mt-6">
                    <div className="grid grid-cols-12 gap-4 p-6 text-white font-bold">
                      <div className="col-span-4 text-lg">Total Cost of Production</div>
                      <div className="col-span-4 text-right text-2xl">
                        Rs. {selectedCrop.costPerAcre.total_cost_of_production.toLocaleString('en-PK')}
                      </div>
                      <div className="col-span-4 text-right text-2xl">
                        Rs. {Math.round((selectedCrop.costPerAcre.total_cost_of_production * selectedCrop.totalAcres)).toLocaleString('en-PK')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setView('cropList')}
                    className="px-6 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium text-sm"
                  >
                    Continue to Details
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Cultivation & Harvest Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-800 font-medium">✓ Auto-populated planting details for {selectedCrop.type}</p>
                </div>

                {/* Cultivation Details */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    Cultivation Details
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sowing Start Date *</label>
                        <input
                          type="date"
                          value={plantingForm.seedStarted}
                          onChange={(e) => setPlantingForm({ ...plantingForm, seedStarted: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <p className="text-xs text-slate-600 mt-1">Cannot be in the past</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Planting Date *</label>
                        <input
                          type="date"
                          value={plantingForm.planted}
                          onChange={(e) => setPlantingForm({ ...plantingForm, planted: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          min={plantingForm.seedStarted}
                        />
                        <p className="text-xs text-slate-600 mt-1">Must be after sowing date</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Plant Spacing (cm)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={plantingForm.plantSpacing}
                          onChange={(e) => setPlantingForm({ ...plantingForm, plantSpacing: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Row Spacing (cm)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={plantingForm.rowSpacing}
                          onChange={(e) => setPlantingForm({ ...plantingForm, rowSpacing: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Planted Area (sqm)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={plantingForm.plantedArea}
                        onChange={(e) => setPlantingForm({ ...plantingForm, plantedArea: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Harvest Plan with Window Guidance */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-700" />
                    Harvest Plan
                  </h3>

                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Harvest Window: {plantingForm.harvestWindowMin} - {plantingForm.harvestWindowMax} days</p>
                      <p className="text-xs text-blue-800 mt-1">Harvest should occur within this optimal window for best results</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Planned Harvest Date *</label>
                      <input
                        type="date"
                        value={plantingForm.plannedHarvest}
                        onChange={(e) => setPlantingForm({ ...plantingForm, plannedHarvest: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        min={new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]}
                      />
                      <p className="text-xs text-slate-600 mt-1">
                        ⓘ Must be between {plantingForm.harvestWindowMin} and {plantingForm.harvestWindowMax} days after planting
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Yield ({selectedCrop.harvestUnits})</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={plantingForm.expectedHarvestAmount}
                          onChange={(e) => setPlantingForm({ ...plantingForm, expectedHarvestAmount: parseFloat(e.target.value) })}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                        <button
                          onClick={() => {
                            const calculated = calculateYield(selectedCrop, plantingForm.plantedArea);
                            setPlantingForm({ ...plantingForm, expectedHarvestAmount: calculated });
                          }}
                          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium text-sm"
                          title="Auto-calculate based on area and crop type"
                        >
                          Auto
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        ⓘ Formula: Base yield per acre × Area (acres) | Click 'Auto' to calculate
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agronomic Guidelines */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-600" />
                    Recommended Practices
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="bg-white rounded p-3 border border-amber-200">
                      <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        Water Requirement
                      </p>
                      <p className="text-slate-600 text-xs">{selectedCrop.waterRequirement}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-amber-200">
                      <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                        <Beaker className="w-4 h-4 text-slate-600" />
                        Soil Conditions
                      </p>
                      <p className="text-slate-600 text-xs">{selectedCrop.soilConditions}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-amber-200">
                      <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        Light Profile
                      </p>
                      <p className="text-slate-600 text-xs">{selectedCrop.lightProfile}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-amber-200">
                      <p className="font-semibold text-slate-900 flex items-center gap-2 mb-1">
                        <Bug className="w-4 h-4 text-red-500" />
                        Pest/Disease
                      </p>
                      <p className="text-slate-600 text-xs">{selectedCrop.pests.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">Critical Irrigations:</p>
                      <p className="text-slate-600">{selectedCrop.criticalIrrigations.join(' • ')}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">Harvest Indicators:</p>
                      <p className="text-slate-600">{selectedCrop.harvestIndicators.join(' • ')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreatePlanting}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
                  >
                    Create Planting
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schedule View */}
        {view === 'schedule' && (
          <div>
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-slate-700" />
                  Planting Schedule & Timeline
                </h2>
                <button
                  onClick={() => setView('cropList')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
                >
                  New Planting
                </button>
              </div>

              {plantings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">No plantings scheduled yet</p>
                  <button
                    onClick={() => setView('cropList')}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                  >
                    Create Your First Planting
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {crops.map(crop => {
                    const cropPlantings = plantings.filter(p => p.crop.id === crop.id);
                    if (cropPlantings.length === 0) return null;

                    return (
                      <div key={crop.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50 hover:shadow-md transition">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sprout className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">{crop.type} - {crop.variety}</h3>
                            <p className="text-sm text-slate-600 italic">{crop.botanicalName}</p>

                            <div className="mt-4 grid grid-cols-5 gap-3 text-sm">
                              <div className="bg-white rounded p-3 border border-slate-200">
                                <p className="text-slate-600 text-xs">Total Plantings</p>
                                <p className="font-bold text-slate-900">{cropPlantings.length}</p>
                              </div>
                              <div className="bg-white rounded p-3 border border-slate-200">
                                <p className="text-slate-600 text-xs">Total Area</p>
                                <p className="font-bold text-slate-900">{cropPlantings.reduce((s, p) => s + p.plantedArea, 0).toFixed(1)} sqm</p>
                              </div>
                              <div className="bg-white rounded p-3 border border-slate-200">
                                <p className="text-slate-600 text-xs">Expected Yield</p>
                                <p className="font-bold text-slate-900">{cropPlantings.reduce((s, p) => s + p.expectedHarvestAmount, 0).toFixed(2)}</p>
                              </div>
                              <div className="bg-white rounded p-3 border border-slate-200">
                                <p className="text-slate-600 text-xs">Total Cost</p>
                                <p className="font-bold text-slate-900">Rs. {cropPlantings.reduce((s, p) => s + (p.totalCost || 0), 0).toLocaleString('en-PK')}</p>
                              </div>
                              <div className="bg-white rounded p-3 border border-slate-200">
                                <p className="text-slate-600 text-xs">Status</p>
                                <p className="font-bold text-slate-900">{cropPlantings.some(p => !p.harvested) ? 'Active' : 'Done'}</p>
                              </div>
                            </div>

                            {cropPlantings.map((planting, idx) => (
                              <div key={idx} className="mt-4 bg-white rounded p-4 border border-slate-200">
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-6 text-xs flex-wrap">
                                    <div>
                                      <span className="text-amber-600 font-bold">●</span>
                                      <span className="text-slate-600"> Sow: </span>
                                      <span className="font-semibold text-slate-900">{new Date(planting.seedStarted).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-emerald-600 font-bold">●</span>
                                      <span className="text-slate-600"> Plant: </span>
                                      <span className="font-semibold text-slate-900">{new Date(planting.planted).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-800 font-bold">●</span>
                                      <span className="text-slate-600"> Harvest: </span>
                                      <span className="font-semibold text-slate-900">{new Date(planting.plannedHarvest).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                      <span className="text-blue-600 font-bold">●</span>
                                      <span className="text-slate-600"> Window: </span>
                                      <span className="font-semibold text-slate-900">{planting.harvestWindowMin}-{planting.harvestWindowMax} days</span>
                                    </div>
                                  </div>
                                  {!planting.harvested && (
                                    <button
                                      onClick={() => {
                                        const updated = plantings.map(p =>
                                          p.id === planting.id ? { ...p, harvested: true } : p
                                        );
                                        setPlantings(updated);
                                      }}
                                      className="px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-800 transition font-medium"
                                    >
                                      Mark Harvested
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
           {plantings.length > 0 && <PlantingCalendar plantings={plantings} />}

          </div>
        )}
      </div>
    </div>
  );
};

export default CropPreparation;