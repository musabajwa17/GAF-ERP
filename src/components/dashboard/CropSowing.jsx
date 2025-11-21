'use client';

import { useState, useEffect } from 'react';
import useCropManagement from '../../hooks/useCropManagement';

export default function CropSowing() {
  const { addCrop, deleteCrop, crops, loading, error } = useCropManagement();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    task: '',
    field: '',
    crew: '',
    dueDate: '',
    notes: '',
  });

  // ✅ Example dropdown options (you can replace these with dynamic data)
  const taskOptions = ['Soil Preparation', 'Seed Sowing', 'Irrigation', 'Weed Control', 'Harvesting'];
  const fieldOptions = ['Field A', 'Field B', 'Field C'];
  const crewOptions = ['Crew 1', 'Crew 2', 'Crew 3'];

  // ✅ Sync hook data with local state
  useEffect(() => {
    setTasks(crops);
  }, [crops]);

  // ✅ Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Add Task
  const handleAssignTask = async () => {
    const { task, field, crew, dueDate, notes } = newTask;

    if (!task || !field || !crew || !dueDate) {
      alert('⚠️ Please fill in all required fields');
      return;
    }

    const taskData = {
      task,
      field,
      crew,
      due_date: dueDate,
      notes: notes || '',
    };

    try {
      await addCrop(taskData);
      alert('✅ Task added successfully!');
      setNewTask({ task: '', field: '', crew: '', dueDate: '', notes: '' }); // reset form
    } catch (error) {
      console.error('Add Task Error:', error);
      alert('❌ Failed to add task. Please try again.');
    }
  };

  // ✅ Handle Delete Task
  const handleDeleteTask = async (id) => {
    if (!id) {
      alert('⚠️ Invalid task ID.');
      return;
    }
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;
    try {
      await deleteCrop(id);
      alert('🗑️ Task deleted successfully!');
    } catch (error) {
      console.error('Delete Task Error:', error);
      alert('❌ Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Task Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Task Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Task</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Field</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Crew</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        No tasks assigned yet
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-sm text-gray-800">{task.task}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{task.field}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{task.crew}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{task.dueDate}</td>
                        <td className="py-3 px-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
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
          </div>

          {/* Right Side - Assign New Task */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Assign New Task</h2>

            <div className="flex flex-col space-y-4">
              {/* Task Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task <span className="text-red-500">*</span>
                </label>
                <select
                  name="task"
                  value={newTask.task}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a task</option>
                  {taskOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field <span className="text-red-500">*</span>
                </label>
                <select
                  name="field"
                  value={newTask.field}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a field</option>
                  {fieldOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crew Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crew <span className="text-red-500">*</span>
                </label>
                <select
                  name="crew"
                  value={newTask.crew}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a crew</option>
                  {crewOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={newTask.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add any additional notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Assign Task Button */}
              <button
                onClick={handleAssignTask}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
