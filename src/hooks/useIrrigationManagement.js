'use client';
import { useState, useEffect } from 'react';
import useIrrigationManagement from '../../hooks/useIrrigationManagement';

export default function IrrigationManagement() {
  const {
    irrigations,
    loading,
    error,
    addIrrigation,
    updateIrrigation,
    deleteIrrigation,
  } = useIrrigationManagement();

  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    field: '',
    irrigationMethod: '',
    waterUsed: '',
    date: '',
    notes: '',
  });

  // ✅ Dropdown options
  const irrigationMethods = ['Drip', 'Sprinkler', 'Surface', 'Furrow', 'Manual'];

  // ✅ Sync state with hook data
  useEffect(() => {
    setRecords(irrigations);
  }, [irrigations]);

  // ✅ Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add new irrigation record
  const handleAddRecord = async () => {
    const { field, irrigationMethod, waterUsed, date } = newRecord;

    if (!field || !irrigationMethod || !waterUsed || !date) {
      alert('⚠️ Please fill in all required fields!');
      return;
    }

    try {
      await addIrrigation(newRecord);
      alert('✅ Irrigation record added successfully!');
      setNewRecord({ field: '', irrigationMethod: '', waterUsed: '', date: '', notes: '' });
    } catch (error) {
      alert('❌ Failed to add irrigation record. Please try again.');
    }
  };

  // ✅ Delete irrigation record
  const handleDeleteRecord = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this irrigation record?');
    if (!confirmDelete) return;

    try {
      await deleteIrrigation(id);
      alert('🗑️ Record deleted successfully!');
    } catch (error) {
      alert('❌ Failed to delete record. Please try again.');
    }
  };

  // ✅ Update irrigation record
  const handleUpdateRecord = async (id) => {
    const updated = window.prompt('Enter new notes for this record:');
    if (updated === null) return;

    try {
      await updateIrrigation(id, { notes: updated });
      alert('✅ Record updated successfully!');
    } catch (error) {
      alert('❌ Failed to update record.');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">💧 Irrigation Management</h1>

        {/* Table of Records */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Irrigation Records</h2>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Field</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Method</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Water Used</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Notes</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No irrigation records found
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{record.field}</td>
                        <td className="py-3 px-4">{record.irrigationMethod}</td>
                        <td className="py-3 px-4">{record.waterUsed}</td>
                        <td className="py-3 px-4">{record.date}</td>
                        <td className="py-3 px-4">{record.notes || '-'}</td>
                        <td className="py-3 px-4 space-x-3">
                          <button
                            onClick={() => handleUpdateRecord(record.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New Record */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Irrigation Record</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="field"
              placeholder="Field name"
              value={newRecord.field}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            />

            <select
              name="irrigationMethod"
              value={newRecord.irrigationMethod}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Irrigation Method</option>
              {irrigationMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="waterUsed"
              placeholder="Water used (liters)"
              value={newRecord.waterUsed}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            />

            <input
              type="date"
              name="date"
              value={newRecord.date}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            />

            <textarea
              name="notes"
              placeholder="Additional notes..."
              value={newRecord.notes}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 resize-none md:col-span-2"
              rows="3"
            ></textarea>
          </div>

          <button
            onClick={handleAddRecord}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
          >
            Add Record
          </button>
        </div>
      </div>
    </div>
  );
}
