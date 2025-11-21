import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Droplets, Sun, Sprout, ArrowLeft, Info, Leaf, Bug, Beaker, TrendingUp } from 'lucide-react';
import CROP_DATABASE from "../../data/crops"
const CropPreparation = () => {
  console.log(CROP_DATABASE)
  const [view, setView] = useState('addCrop');
  const [crops, setCrops] = useState([]);
  const [locations, setLocations] = useState([]);
  const [plantings, setPlantings] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [cropForm, setCropForm] = useState({ type: '', variety: '' });
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
    expectedHarvestAmount: 0
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
    if (!cropForm.type || !cropForm.variety) {
      alert('Please select crop type and variety');
      return;
    }

    const cropData = CROP_DATABASE[cropForm.type];
    const newCrop = {
      id: Date.now(),
      type: cropForm.type,
      variety: cropForm.variety,
      ...cropData
    };

    setCrops([...crops, newCrop]);
    setCropForm({ type: '', variety: '' });
    setView('cropList');
  };

  const isLocationPlanted = (locationId) => {
    return plantings.some(p => p.location.id === locationId && !p.harvested);
  };

  const getAvailableLocations = () => {
    return locations.filter(loc => !isLocationPlanted(loc.id));
  };

  const handleStartPlanting = (crop) => {
    setSelectedCrop(crop);

    const today = new Date();
    const expectedHarvest = new Date(today);
    expectedHarvest.setDate(today.getDate() + crop.daysToMaturity);

    setPlantingForm({
      cropId: crop.id,
      locationId: '',
      numPlantings: 1,
      seedStarted: today.toISOString().split('T')[0],
      planted: today.toISOString().split('T')[0],
      plantSpacing: crop.plantSpacing,
      rowSpacing: crop.rowSpacing,
      plantedArea: 100.0,
      plannedHarvest: expectedHarvest.toISOString().split('T')[0],
      expectedHarvestAmount: 0
    });

    setView('plantingWizard');
    setStep(1);
  };

  // Calculate yield based on optimal formula
  const calculateYield = (crop, area) => {
    const yieldPerAcre = {
      'Wheat': 50,
      'Rice': 45,
      'Sesame': 8,
      'Maize': 35,
      'Cotton': 20,
      'Potato': 200,
      'Onion': 150,
      'Sorghum': 40
    };

    const baseYield = yieldPerAcre[crop.type] || 30;
    const areaInAcres = (area / 4047) || 0.024; // 1 acre = 4047 sqm
    const calculatedYield = baseYield * areaInAcres;

    return parseFloat(calculatedYield.toFixed(2));
  };

  // Validate planting dates
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
    if (daysDifference < selectedCrop.daysToMaturity * 0.8) {
      alert(`⚠️ Harvest period too short. Recommend at least ${selectedCrop.daysToMaturity} days after planting`);
      return false;
    }

    return true;
  };

  const handleCreatePlanting = () => {
    if (!plantingForm.locationId) {
      alert('Please select a location');
      return;
    }

    if (!validatePlantingDates()) {
      return;
    }

    const location = locations.find(l => l.id === parseInt(plantingForm.locationId));

    if (isLocationPlanted(location.id)) {
      alert('This location is already planted! Please harvest first.');
      return;
    }

    // Auto-calculate yield
    const calculatedYield = calculateYield(selectedCrop, plantingForm.plantedArea);

    const newPlanting = {
      id: Date.now(),
      crop: selectedCrop,
      location: location,
      ...plantingForm,
      expectedHarvestAmount: calculatedYield,
      createdAt: new Date().toISOString(),
      harvested: false
    };

    setPlantings([...plantings, newPlanting]);
    alert('✓ Planting created successfully!\nExpected Yield: ' + calculatedYield + ' ' + selectedCrop.harvestUnits);
    setView('schedule');
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getCellColor = (date, planting) => {
    const currentDate = new Date(date);
    const sowingStart = new Date(planting.seedStarted);
    const sowingEnd = new Date(sowingStart);
    sowingEnd.setDate(sowingEnd.getDate() + 7);
    const harvestDate = new Date(planting.plannedHarvest);

    if (planting.harvested && currentDate >= harvestDate) {
      return 'bg-slate-700 text-white';
    }
    if (currentDate >= sowingStart && currentDate < sowingEnd) {
      return 'bg-amber-100 text-slate-900 border border-amber-300';
    }
    if (currentDate >= sowingEnd && currentDate < harvestDate) {
      return 'bg-emerald-600 text-white';
    }
    if (currentDate.toDateString() === harvestDate.toDateString()) {
      return 'bg-slate-800 text-white font-bold';
    }
    return '';
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 bg-slate-50 rounded"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const plantingsOnDay = plantings.filter(p => getCellColor(date, p) !== '');

      days.push(
        <div
          key={day}
          className={`h-20 border border-slate-200 rounded p-2 text-sm ${
            plantingsOnDay.length > 0 ? getCellColor(date, plantingsOnDay[0]) : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="font-semibold">{day}</div>
          {plantingsOnDay.length > 0 && (
            <div className="text-xs truncate mt-1 opacity-90">{plantingsOnDay[0].crop.type}</div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded transition text-sm"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold text-slate-800">{monthNames[currentMonth]} {currentYear}</h3>
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded transition text-sm"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-slate-600 py-2 text-xs">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>

        <div className="flex gap-6 mt-6 justify-center flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
            <span className="text-slate-700">Sowing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-600 rounded"></div>
            <span className="text-slate-700">Growing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800 rounded"></div>
            <span className="text-slate-700">Harvest</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        {/* <div className="bg-white rounded-lg border-l-4 border-emerald-600 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Crop Preparation System</h1>
                <p className="text-slate-600 text-sm mt-1">Plan, track and optimize your farming operations</p>
              </div>
            </div>
            <div className="flex gap-3">
              {view !== 'addCrop' && (
                <button
                  onClick={() => setView('addCrop')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Crop
                </button>
              )}
              {crops.length > 0 && view !== 'schedule' && (
                <button
                  onClick={() => setView('schedule')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              )}
            </div>
          </div>
        </div> */}

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
                  onChange={(e) => setCropForm({ ...cropForm, type: e.target.value, variety: '' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                >
                  <option value="">Select crop type</option>
                  {Object.keys(CROP_DATABASE).sort().map(crop => (
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
                        <p className="font-medium text-slate-900">{CROP_DATABASE[cropForm.type].botanicalName}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Season</p>
                        <p className="font-medium text-slate-900">{CROP_DATABASE[cropForm.type].season}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Days to Maturity</p>
                        <p className="font-medium text-slate-900">{CROP_DATABASE[cropForm.type].daysToMaturity} days</p>
                      </div>
                      <div>
                        <p className="text-slate-600 text-xs">Optimal Sowing</p>
                        <p className="font-medium text-slate-900 text-xs">{CROP_DATABASE[cropForm.type].optimalSowingTime}</p>
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
                      {CROP_DATABASE[cropForm.type].varieties.map(variety => (
                        <option key={variety} value={variety}>{variety}</option>
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
                  disabled={!cropForm.type || !cropForm.variety}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crop List */}
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
                        <h3 className="text-lg font-bold text-slate-900">
                          {crop.type} - {crop.variety}
                        </h3>
                        <p className="text-sm text-slate-600 italic mt-1">{crop.botanicalName}</p>
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
                      <button
                        onClick={() => handleStartPlanting(crop)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm whitespace-nowrap"
                      >
                        Add Planting
                      </button>
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
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                  step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  1
                </div>
                <span className="text-sm font-bold text-slate-700">Location</span>
              </div>
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                  step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  2
                </div>
                <span className="text-sm font-bold text-slate-700">Details</span>
              </div>
            </div>

            {/* Step 1: Select Location */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">{selectedCrop.type.substring(0, 2)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{selectedCrop.type} - {selectedCrop.variety}</h3>
                      <p className="text-sm text-slate-600 italic">{selectedCrop.botanicalName}</p>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        <div className="bg-white rounded p-2 text-sm border border-slate-200">
                          <p className="text-slate-600 text-xs">Season</p>
                          <p className="font-semibold text-slate-900">{selectedCrop.season}</p>
                        </div>
                        <div className="bg-white rounded p-2 text-sm border border-slate-200">
                          <p className="text-slate-600 text-xs">Maturity</p>
                          <p className="font-semibold text-slate-900">{selectedCrop.daysToMaturity} days</p>
                        </div>
                        <div className="bg-white rounded p-2 text-sm border border-slate-200">
                          <p className="text-slate-600 text-xs">Seed Rate</p>
                          <p className="font-semibold text-slate-900 text-xs">{selectedCrop.seedRate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Field Location *</label>
                  <select
                    value={plantingForm.locationId}
                    onChange={(e) => setPlantingForm({ ...plantingForm, locationId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  >
                    <option value="">Choose a farm...</option>
                    {getAvailableLocations().map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.areaSqm} sqm
                      </option>
                    ))}
                  </select>
                  {getAvailableLocations().length === 0 && (
                    <p className="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg">
                      ⚠️ All locations are currently planted. Harvest before replanting.
                    </p>
                  )}
                </div>

                {/* {plantingForm.locationId && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Plantings</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={plantingForm.numPlantings}
                      onChange={(e) => setPlantingForm({ ...plantingForm, numPlantings: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                )} */}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setView('cropList')}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!plantingForm.locationId}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
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

                {/* Harvest Plan */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-700" />
                    Harvest Plan
                  </h3>

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
                        ⓘ Must be at least {selectedCrop.daysToMaturity} days after planting date
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

                  <div className="grid grid-cols-2 gap-4 text-sm">
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

                  <div className="mt-4 space-y-2 text-xs">
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

                            <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
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
                                <p className="font-bold text-slate-900">{cropPlantings.reduce((s, p) => s + p.expectedHarvestAmount, 0).toFixed(2)} {crop.harvestUnits}</p>
                              </div>
                              <div className="bg-white rounded p-3 border border-slate-200">
                                <p className="text-slate-600 text-xs">Status</p>
                                <p className="font-bold text-slate-900">{cropPlantings[0].harvested ? 'Done' : 'Active'}</p>
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

            {/* Calendar View */}
            {plantings.length > 0 && renderCalendar()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPreparation;
