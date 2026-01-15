import React from 'react';
import { Package, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import RegisterNewMedicine from './RegisterNewMedicine'; 

export default function Dashboard() {
  // Mock data for the donation dashboard
  const donations = [
    {
      id: '1',
      medicine: 'Paracetamol 500mg',
      quantity: 20,
      status: 'completed',
      ngo: 'HealthCare Foundation',
      date: '2024-03-15',
    },
    {
      id: '2',
      medicine: 'Amoxicillin 250mg',
      quantity: 15,
      status: 'pending',
      ngo: 'Medical Aid Society',
      date: '2024-03-14',
    },
    {
      id: '3',
      medicine: 'Ibuprofen 400mg',
      quantity: 50,
      status: 'in-transit',
      ngo: 'Global Relief',
      date: '2024-03-16',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="dashboard">

      <RegisterNewMedicine />
      {/* ---------------------------------------------- */}

      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Total Donations</p>
                <p className="text-2xl font-bold text-emerald-700">1,234</p>
              </div>
              <Package className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Active Requests</p>
                <p className="text-2xl font-bold text-blue-700">56</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-purple-700">1,178</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Growth</p>
                <p className="text-2xl font-bold text-orange-700">+12.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NGO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.medicine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.quantity} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.ngo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : donation.status === 'in-transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}