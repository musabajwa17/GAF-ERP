"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

export const useLaborManagement = () => {
  const [laborers, setLaborers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLaborers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/labor");
      setLaborers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaborers();
  }, []);

  return { laborers, loading };
};
