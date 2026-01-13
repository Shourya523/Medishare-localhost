// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <div className="min-h-screen bg-gray-50">
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
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Made By Team LocalHost
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;