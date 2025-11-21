"use client";

import React, { useRef, useState, useEffect } from "react";
import LeafletMap from "./LeafletMap";
import {
  FileText,
  Lock,
  MapPin,
  Check,
  Save,
  Trash2,
} from "lucide-react";

export default function MapDetail() {
  const mapRef = useRef();
  const [farmType, setFarmType] = useState("Wheat");
  const [farmNotes, setFarmNotes] = useState("");
  const [areaInfo, setAreaInfo] = useState(null);
  const [savedFarms, setSavedFarms] = useState([]);

  // Load saved farms
  useEffect(() => {
    const saved = localStorage.getItem("savedFarms");
    if (saved) setSavedFarms(JSON.parse(saved));
  }, []);

  // Update localStorage whenever savedFarms changes
  useEffect(() => {
    localStorage.setItem("savedFarms", JSON.stringify(savedFarms));
  }, [savedFarms]);

  const handleSaveFarm = () => {
    if (!areaInfo) {
      alert("Please draw a shape first!");
      return;
    }
    const newFarm = {
      ...areaInfo,
      type: farmType,
      notes: farmNotes,
      savedAt: new Date().toISOString(),
    };
    setSavedFarms((prev) => [...prev, newFarm]);
    setFarmNotes("");
    alert("Farm saved successfully!");
  };

  const handleDeleteFarm = (farmId) => {
    const confirmed = confirm("Are you sure you want to delete this farm?");
    if (!confirmed) return;
    setSavedFarms((prev) => prev.filter((f) => f.farmId !== farmId));
  };

  const handleClearMap = () => {
    if (mapRef.current) mapRef.current.clearShapes();
    setAreaInfo(null);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 p-4 bg-white shadow-lg flex flex-col gap-4 overflow-y-auto">
        <h2 className="text-xl font-bold">Farm Details</h2>

        {/* Farm Type */}
        <div>
          <label className="block mb-1 font-medium">Farm Type:</label>
          <select
            value={farmType}
            onChange={(e) => setFarmType(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="Wheat">Wheat</option>
            <option value="Corn">Corn</option>
            <option value="Rice">Rice</option>
            <option value="Vegetables">Vegetables</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium">Notes:</label>
          <textarea
            value={farmNotes}
            onChange={(e) => setFarmNotes(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            rows={3}
            placeholder="Enter notes about the farm..."
          />
        </div>

        {/* Area Info */}
        {areaInfo && (
          <div className="bg-gray-100 p-2 rounded">
            <p><strong>Farm ID:</strong> {areaInfo.farmId}</p>
            <p>
              <strong>Area:</strong>{" "}
              {areaInfo.areaAcres} acres / {areaInfo.areaHectares} ha
            </p>
            <p><strong>Shape Type:</strong> {areaInfo.type}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSaveFarm}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded flex items-center justify-center gap-1"
          >
            <Save size={16} /> Save
          </button>
          <button
            onClick={handleClearMap}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded flex items-center justify-center gap-1"
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>

        {/* Saved Farms */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Saved Farms</h3>
          {savedFarms.length === 0 && <p className="text-gray-500">No farms saved yet.</p>}
          {savedFarms.map((farm) => (
            <div
              key={farm.farmId}
              className="border p-2 rounded mb-2 bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{farm.farmId}</p>
                <p className="text-sm text-gray-600">{farm.type}</p>
              </div>
              <button
                onClick={() => handleDeleteFarm(farm.farmId)}
                className="text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <LeafletMap ref={mapRef} onAreaData={setAreaInfo} />
      </div>
    </div>
  );
}
