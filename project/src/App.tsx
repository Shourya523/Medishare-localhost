import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Pill, Activity, Shield, HeartPulse, Stethoscope, Microscope } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import NGOMap from './components/NGOMap';
import HealthInsights from './components/HealthInsights';
import Dashboard from './components/Dashboard';
import ReportAnalysis from './components/ReportAnalysis';
import LoginPage from './components/LoginPage';
import Register from './components/RegisterPage';
import MedicineEcommerce from './components/Ecommerce';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import OrderSummary from './components/OrderSummary';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
        
        {/* Decorative Background Layer */}
        <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
          {/* Ambient Color Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/20 blur-[120px]" />

          {/* Large Left Floating Icons */}
          <div className="absolute top-1/4 -left-20 opacity-[0.03] -rotate-12 transition-transform hover:rotate-0 duration-[3s]">
            <Activity size={400} className="text-emerald-900" />
          </div>
          <div className="absolute bottom-10 -left-10 opacity-[0.02] rotate-45">
            <Shield size={300} className="text-blue-900" />
          </div>

          {/* Large Right Floating Icons */}
          <div className="absolute top-10 -right-20 opacity-[0.03] rotate-12">
            <Pill size={450} className="text-emerald-900" />
          </div>
          <div className="absolute bottom-1/4 -right-10 opacity-[0.02] -rotate-12">
            <HeartPulse size={350} className="text-red-900" />
          </div>
          
          {/* Central Subtle Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01]">
            <Microscope size={600} />
          </div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10">
          <Header />
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <Scanner />
                <NGOMap />
                <HealthInsights />
                <Dashboard />
              </main>
            } />
            <Route path="/report-analysis" element={<ReportAnalysis />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/store" element={<MedicineEcommerce />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/order-summary" element={<OrderSummary />} />
          </Routes>

          <footer className="bg-white/60 backdrop-blur-md border-t border-gray-200 py-10 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-tighter text-xl">
                  <Activity className="h-6 w-6" />
                  Medishare Health
                </div>
                <p className="text-gray-400 text-sm">
                  © 2026 LocalHost Intelligence Systems
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;