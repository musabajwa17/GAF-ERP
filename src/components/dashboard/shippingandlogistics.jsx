import React, { useState } from 'react';
import { Package, TrendingUp, Clock } from 'lucide-react';

const Shippingandlogistics = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Shipments', value: '245', icon: Package },
    { label: 'On-Time Delivery Rate', value: '98%', icon: TrendingUp },
    { label: 'Average Transit Time', value: '3 Days', icon: Clock },
  ];

  const upcomingShipments = [
    { id: 'SHP2024001', crop: 'Wheat', buyer: 'AgriCorp', destination: 'Milltown', dispatchDate: '2024-07-20', status: 'Scheduled', statusColor: 'blue' },
    { id: 'SHP2024002', crop: 'Corn', buyer: 'Grain Traders Inc.', destination: 'Harvest City', dispatchDate: '2024-07-22', status: 'In Transit', statusColor: 'yellow' },
    { id: 'SHP2024003', crop: 'Soybeans', buyer: 'Global Foods Ltd.', destination: 'Portside', dispatchDate: '2024-07-25', status: 'Scheduled', statusColor: 'blue' },
    { id: 'SHP2024004', crop: 'Barley', buyer: 'Brewers Co.', destination: 'Breweryville', dispatchDate: '2024-07-28', status: 'Scheduled', statusColor: 'blue' },
    { id: 'SHP2024005', crop: 'Rice', buyer: 'Rice Importers LLC', destination: 'Riceville', dispatchDate: '2024-07-30', status: 'Scheduled', statusColor: 'blue' },
  ];

  const recentShipments = [
    { id: 'SHP2024006', crop: 'Wheat', buyer: 'AgriCorp', destination: 'Milltown', dispatchDate: '2024-07-10', status: 'Delivered', statusColor: 'green' },
    { id: 'SHP2024007', crop: 'Corn', buyer: 'Grain Traders Inc.', destination: 'Harvest City', dispatchDate: '2024-07-08', status: 'Delivered', statusColor: 'green' },
    { id: 'SHP2024008', crop: 'Soybeans', buyer: 'Global Foods Ltd.', destination: 'Portside', dispatchDate: '2024-07-05', status: 'Delivered', statusColor: 'green' },
    { id: 'SHP2024009', crop: 'Barley', buyer: 'Brewers Co.', destination: 'Breweryville', dispatchDate: '2024-07-02', status: 'Delivered', statusColor: 'green' },
    { id: 'SHP2024010', crop: 'Rice', buyer: 'Rice Importers LLC', destination: 'Riceville', dispatchDate: '2024-06-29', status: 'Delivered', statusColor: 'green' },
  ];

  const getStatusStyles = (color) => {
    const styles = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
    };
    return styles[color] || styles.blue;
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 text-gray-900">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Shipping & Logistics
        </h1>
        <p className="text-gray-600">
          Manage and track your crop shipments with real-time GPS tracking and digital dispatch notes.
        </p>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'book'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Book Transport
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'track'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Track Shipments
          </button>
        </nav>
      </div>

      {/* Stats Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Shipment Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upcoming Shipments Table */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Shipments
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Shipment ID', 'Crop', 'Buyer', 'Destination', 'Dispatch Date', 'Status'].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipment.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.crop}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.buyer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.destination}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.dispatchDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(shipment.statusColor)}`}>
                        {shipment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recent Shipments Table */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Shipments
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Shipment ID', 'Crop', 'Buyer', 'Destination', 'Dispatch Date', 'Status'].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {shipment.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.crop}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.buyer}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.destination}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{shipment.dispatchDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(shipment.statusColor)}`}>
                        {shipment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shippingandlogistics;
