import { useState } from "react";
import {
  Plus,
  Droplet,
  Bug,
  Shield,
  Leaf,
  Sprout,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import useInventaryManagement from "../../hooks/useInventaryManagement";
export default function AdminInventoryManagement() {
  const { crops, loading, error, addCrop, updateCrop, deleteCrop } =
    useInventaryManagement();
  console.log("Items", crops.data);
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Glyphosate",
      amount: 45,
      color: "bg-blue-500",
      icon: "Droplet",
      expiryDate: "2026-12-31",
    },
    {
      id: 2,
      name: "Malathion",
      amount: 32,
      color: "bg-green-500",
      icon: "Bug",
      expiryDate: "2026-08-15",
    },
    {
      id: 3,
      name: "Cypermethrin",
      amount: 28,
      color: "bg-purple-500",
      icon: "Shield",
      expiryDate: "2027-03-20",
    },
    {
      id: 4,
      name: "Atrazine",
      amount: 15,
      color: "bg-orange-500",
      icon: "Leaf",
      expiryDate: "2026-11-10",
    },
    {
      id: 5,
      name: "Chlorpyrifos",
      amount: 52,
      color: "bg-red-500",
      icon: "Sprout",
      expiryDate: "2027-01-25",
    },
    {
      id: 6,
      name: "Imidacloprid",
      amount: 38,
      color: "bg-indigo-500",
      icon: "Bug",
      expiryDate: "2026-09-30",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    expiryDate: "",
    amount: "",
  });

  const iconMap = {
    Droplet,
    Bug,
    Shield,
    Leaf,
    Sprout,
  };

  const colorOptions = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  const iconOptions = ["Droplet", "Bug", "Shield", "Leaf", "Sprout"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.name && formData.expiryDate && formData.amount) {
//       if (editingId) {
//         // Update existing item
//         setInventory(inventory.map(item =>
//           item.id === editingId
//             ? { ...item, name: formData.name, expiryDate: formData.expiryDate, amount: parseInt(formData.amount) }
//             : item
//         ));
//       } else {
//         // Add new item
//         const newItem = {
//           id: Date.now(),
//           name: formData.name,
//           amount: parseInt(formData.amount),
//           color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
//           icon: iconOptions[Math.floor(Math.random() * iconOptions.length)],
//           expiryDate: formData.expiryDate
//         };
//         setInventory([...inventory, newItem]);
//       }
//       setFormData({ name: '', expiryDate: '', amount: '' });
//       setIsModalOpen(false);
//       setEditingId(null);
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingId(item.id);
//     setFormData({
//       name: item.name,
//       expiryDate: item.expiryDate,
//       amount: item.amount.toString()
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id) => {
//     setInventory(inventory.filter(item => item.id !== id));
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);

    // ✅ Frontend Validations
    if (!formData.name.trim()) {
      alert("Please enter a valid pesticide name");
      return;
    }

    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    if (!formData.expiryDate) {
      alert("Please select a valid expiry date");
      return;
    }

    // ✅ Ensure expiry date is not in the past
    const today = new Date().setHours(0, 0, 0, 0);
    const expiry = new Date(formData.expiryDate).setHours(0, 0, 0, 0);
    if (expiry <= today) {
      alert("Expiry date must be in the future");
      return;
    }

    // ✅ Prepare payload in correct format
    const payload = {
      name: formData.name.trim(),
      amount: formData.amount.toString(),
      expiry_date: formatDateForAPI(formData.expiryDate),
    };

    try {
      if (editingId) {
        // 🟠 Confirm before update
        const confirmUpdate = window.confirm(
          "Are you sure you want to update this pesticide?"
        );
        if (!confirmUpdate) return;

        console.log("Editing Id", editingId);
        await updateCrop(editingId, payload);
        // alert("Pesticide updated successfully ✅");
      } else {
        // 🟢 Add new item via API
        await addCrop(payload);
        // alert("Pesticide added successfully ✅");
      }

      // Reset form and modal
      setFormData({ name: "", expiryDate: "", amount: "" });
      setIsModalOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Something went wrong while saving data. Please try again!");
    }
  };

  const formatDateForAPI = (date) => {
    if (!date) return "";
    // If already in YYYY-MM-DD format (from <input type="date">), return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

    // Otherwise try to parse and format
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return date; // fallback: return original
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      expiryDate: item.expiry_date, // ✅ API response uses expiry_date
      amount: item.amount.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pesticide?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCrop(id);
      // alert("Pesticide deleted successfully ✅");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete pesticide. Please try again!");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", expiryDate: "", amount: "" });
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex justify-end">
          {/* <h1 className="text-4xl font-bold text-gray-800">Pesticide Inventory Management</h1> */}
          <div className="mb-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md"
            >
              <Plus size={20} />
              Add Inventory
            </button>
          </div>
        </div>

        {/* Add Inventory Button */}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.data && crops.data.map((item) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div
                  className="p-3 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-transparent">
                      {IconComponent ? (
                        <IconComponent size={32} className="text-white" />
                      ) : (
                        <Plus size={32} className="text-white" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {item.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 font-medium">
                      Available Amount:
                    </span>
                    <span className="text-3xl font-bold text-gray-800">
                      {item.amount}
                    </span>
                  </div>
                  <div className="mb-4 text-sm text-gray-500">
                    <span>Bottles</span>
                  </div>
                  <div className="mb-4 text-sm text-gray-600">
                    <span className="font-semibold">Expiry: </span>
                    <span>
                      {new Date(item.expiry_date).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEdit(item)}
                    className={`${item.color} w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors`}
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {editingId ? "Edit Pesticide" : "Add New Pesticide"}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pesticide Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter pesticide name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (Bottles)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-md"
                  >
                    {editingId ? "Update" : "Add Item"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
