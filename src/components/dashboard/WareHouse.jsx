"use client";

import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import Toast from '../../components/dashboard/warehouse/toast';
import InventorySection from '../../components/dashboard/warehouse/inventory_section';
import ProcurementSection from '../../components/dashboard/warehouse/procurement_section';
import FarmerRequestsSection from '../../components/dashboard/warehouse/farmer_request_section';

const STORAGE_KEYS = {
  INVENTORY: "warehouse_inventory_v2",
  FARMER_REQUESTS: "farmer_requests_v1",
  ISSUANCES: "issuances_v1",
  PROC_REQUESTS: "procurement_requests_v2",
};

export default function WarehouseModule() {
  const [inventory, setInventory] = useState([]);
  const [currentSeason, setCurrentSeason] = useState("kharif");
  const [farmerRequests, setFarmerRequests] = useState([]);
  const [issuances, setIssuances] = useState([]);
  const [procRequests, setProcRequests] = useState([]);
  const [toast, setToast] = useState(null);

  // Load everything once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInventory(parsed.inventory || []);
        setCurrentSeason(parsed.currentSeason || "kharif");
      }

      const freq = localStorage.getItem(STORAGE_KEYS.FARMER_REQUESTS);
      if (freq) setFarmerRequests(JSON.parse(freq));

      const iss = localStorage.getItem(STORAGE_KEYS.ISSUANCES);
      if (iss) setIssuances(JSON.parse(iss));

      const proc = localStorage.getItem(STORAGE_KEYS.PROC_REQUESTS);
      if (proc) setProcRequests(JSON.parse(proc));
    } catch (e) {
      console.error("Load error:", e);
    }
  }, []);

  // Save inventory + season together
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify({
        inventory,
        currentSeason
      }));
    } catch (e) { console.error(e); }
  }, [inventory, currentSeason]);

  useEffect(() => localStorage.setItem(STORAGE_KEYS.FARMER_REQUESTS, JSON.stringify(farmerRequests)), [farmerRequests]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.ISSUANCES, JSON.stringify(issuances)), [issuances]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.PROC_REQUESTS, JSON.stringify(procRequests)), [procRequests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* <header className="bg-white border-b-2 border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Warehouse Management</h1>
              <p className="text-sm text-slate-600">Streamline inventory and farmer requests</p>
            </div>
          </div>
        </div>
      </header> */}

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <InventorySection
              inventory={inventory}
              setInventory={setInventory}
              currentSeason={currentSeason}
              setCurrentSeason={setCurrentSeason}
              setToast={setToast}
            />
          </div>
          <div>
            <ProcurementSection procRequests={procRequests} />
          </div>
        </div>

        <div className="mt-6">
          <FarmerRequestsSection
            farmerRequests={farmerRequests}
            setFarmerRequests={setFarmerRequests}
            inventory={inventory}
            setInventory={setInventory}
            issuances={issuances}
            setIssuances={setIssuances}
            setProcRequests={setProcRequests}
            setToast={setToast}
          />
        </div>
      </main>
    </div>
  );
}