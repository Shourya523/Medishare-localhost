import React from 'react';
import { Package, CheckCircle, Clock, TrendingUp, ArrowUpRight, Filter, Download } from 'lucide-react';
import RegisterNewMedicine from './RegisterNewMedicine';

export default function Dashboard() {
  const donations = [
    { id: '1', medicine: 'Paracetamol 500mg', quantity: 20, status: 'completed', ngo: 'HealthCare Foundation', date: '2024-03-15' },
    { id: '2', medicine: 'Amoxicillin 250mg', quantity: 15, status: 'pending', ngo: 'Medical Aid Society', date: '2024-03-14' },
    { id: '3', medicine: 'Ibuprofen 400mg', quantity: 50, status: 'in-transit', ngo: 'Global Relief', date: '2024-03-16' },
  ];

  const stats = [
    { label: 'Total Donations', value: '1,234', icon: Package, color: 'emerald', bg: 'bg-emerald-50/50', text: 'text-emerald-600' },
    { label: 'Active Requests', value: '56', icon: Clock, color: 'blue', bg: 'bg-blue-50/50', text: 'text-blue-600' },
    { label: 'Completed', value: '1,178', icon: CheckCircle, color: 'purple', bg: 'bg-purple-50/50', text: 'text-purple-600' },
    { label: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'orange', bg: 'bg-orange-50/50', text: 'text-orange-600' },
  ];

  return (
    // Changed bg-[#f5f5f7] to bg-transparent
    <div className="bg-transparent min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans mt-10 relative z-10" id="dashboard">
      <div className="max-w-7xl mx-auto">
        
        {/* We keep the glassmorphism for the internal cards so content remains readable over background icons */}
        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-2 border border-white/20 shadow-xl">
           <RegisterNewMedicine />
        </div>

        <div className="mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">Activity Ledger.</h2>
              <p className="text-gray-500 mt-1">Real-time overview of your contribution ecosystem.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl text-sm font-semibold text-gray-600 hover:shadow-md transition-all active:scale-95">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-900 rounded-2xl text-sm font-semibold text-white hover:bg-black transition-all active:scale-95 shadow-lg">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white/40 transition-transform hover:scale-[1.02] duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bg} ${stat.text} rounded-2xl`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50/50 backdrop-blur-sm px-2 py-1 rounded-lg border border-emerald-100/20">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-[10px] font-bold">LIVE</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/20 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100/20 bg-white/20 sticky top-0">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white/10">
                    {['Medicine', 'Quantity', 'Recipient NGO', 'Status', 'Timestamp'].map((header) => (
                      <th key={header} className="px-8 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/10">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-white/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <Package className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-gray-900">{donation.medicine}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-600">
                        {donation.quantity} units
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-gray-600">
                        {donation.ngo}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          donation.status === 'completed' 
                            ? 'bg-emerald-100/60 text-emerald-800' 
                            : donation.status === 'in-transit'
                            ? 'bg-blue-100/60 text-blue-800'
                            : 'bg-amber-100/60 text-amber-800'
                        } backdrop-blur-md`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-400 font-mono">
                        {donation.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-white/10 border-t border-gray-100/10 text-center">
              <button className="text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors">
                View All Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}