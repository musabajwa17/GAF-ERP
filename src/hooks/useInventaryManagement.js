import axios from "axios";
import { useState, useEffect, useCallback } from "react";

const useInventaryManagement = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Base URL
  const BASE_URL = "https://earthscansystems.com/erp/pesticides/";

  // ✅ Helper: Get Auth Headers from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // ✅ Fetch All Crops
  const fetchCrops = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL, { headers: getAuthHeaders() });
      setCrops(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Add Crop
  const addCrop = async (data) => {
    try {
      await axios.post(BASE_URL, data, { headers: getAuthHeaders() });
      // 🔁 Refresh list after successful add
      await fetchCrops();
    } catch (err) {
      console.error("Add Error:", err);
      setError(err.message);
    }
  };

  // ✅ Update Crop
  const updateCrop = async (id, updatedData) => {
    try {
      await axios.put(`${BASE_URL}${id}/`, updatedData, {
        headers: getAuthHeaders(),
      });
      // 🔁 Refresh list after successful update
      await fetchCrops();
    } catch (err) {
      console.error("Update Error:", err);
      setError(err.message);
    }
  };

  // ✅ Delete Crop
  const deleteCrop = async (id) => {
    try {
      await axios.delete(`${BASE_URL}${id}/`, { headers: getAuthHeaders() });
      // 🔁 Refresh list after successful delete
      await fetchCrops();
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.message);
    }
  };

  // ✅ Load data on mount
  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  return { crops, loading, error, addCrop, updateCrop, deleteCrop };
};
export default useInventaryManagement