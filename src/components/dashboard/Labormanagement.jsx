"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function LaborManagement() {
  const API_URL = "https://earthscansystems.com/erp/labors/"; // Django endpoint

  // 🔹 Common function to get token
  const getToken = () => localStorage.getItem("access");

  // 🔹 Centralized API functions
  const api = {
    getLabors: async () => {
      const token = getToken();
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      return res;
    },

    createLabor: async (data) => {
      const token = getToken();
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return res;
    },

    updateLabor: async (id, data) => {
      const token = getToken();
      const res = await fetch(`${API_URL}${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return res;
    },

    deleteLabor: async (id) => {
      const token = getToken();
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization:` Bearer ${token}`,
        },
      });
      return res;
    },
  };

  // --------------------------------------------------------------------
  // 🌾 React Component Logic
  // --------------------------------------------------------------------
  const [labors, setLabors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabor, setEditingLabor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
    dob: "",
    email: "",
  });

  // ✅ Fetch all labors
  const fetchLabors = async () => {
    try {
      const res = await api.getLabors();
      if (!res.ok) {
        console.error("Failed to fetch labors:", res.status);
        return;
      }
      const data = await res.json();
      const laborsArray = Array.isArray(data) ? data : data.data;
      setLabors(laborsArray || []);
    } catch (err) {
      console.error("Error fetching labors:", err);
    }
  };

  useEffect(() => {
    fetchLabors();
  }, []);

  const handleOpenModal = (labor = null) => {
    setEditingLabor(labor);
    setFormData(
      labor
        ? {
            name: labor.name,
            status: labor.status,
            dob: labor.dob,
            email: labor.email,
          }
        : {
            name: "",
            status: "active",
            dob: "",
            email: "",
          }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLabor(null);
    setFormData({
      name: "",
      status: "active",
      dob: "",
      email: "",
    });
  };

  // ✅ Submit (Create or Update)
  const handleSubmit = async () => {
    if (!formData.name || !formData.dob || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = editingLabor
        ? await api.updateLabor(editingLabor.id, formData)
        : await api.createLabor(formData);

      if (res.ok) {
        alert(editingLabor ? "Labor updated successfully!" : "Labor added successfully!");
        fetchLabors();
        handleCloseModal();
      } else {
        const errorData = await res.json();
        console.error("Error:", errorData);
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error saving labor:", error);
    }
  };

  // ✅ Delete labor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this labor?")) return;

    try {
      const res = await api.deleteLabor(id);
      if (res.ok) {
        alert("Labor deleted successfully!");
        setLabors((prev) => prev.filter((labor) => labor.id !== id));
      } else {
        alert("Failed to delete labor!");
      }
    } catch (error) {
      console.error("Error deleting labor:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------------------------
  // 🌾 JSX Rendering
  // --------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Labor Management</h1>
              <p className="text-slate-600">Manage your workforce efficiently</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Labor
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Date of Birth</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Array.isArray(labors) && labors.length > 0 ? (
                  labors.map((labor) => (
                    <tr key={labor.id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                            {labor.name ? labor.name.charAt(0) : "?"}
                          </div>
                          <span className="text-slate-800 font-medium">{labor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            labor.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {labor.status
                            ? labor.status.charAt(0).toUpperCase() + labor.status.slice(1)
                            : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {labor.dob
                          ? new Date(labor.dob).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">{labor.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(labor)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-150"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(labor.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-500">
                      No labor records found. Click "Add Labor" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold">{editingLabor ? "Edit Labor" : "Add New Labor"}</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-slate-600 p-2 rounded-lg transition-colors duration-150"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Labor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                  placeholder="Enter labor name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                  placeholder="labor@example.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-150 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-150 font-medium shadow-md hover:shadow-lg"
                >
                  {editingLabor ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}