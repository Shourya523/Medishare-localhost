import React from 'react';
import { Scan, Share2, Activity, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-transparent pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 mt-20" >
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block">Reduce Medicine Waste.</span>
            <span className="block text-emerald-500">Save Lives.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg font-medium text-gray-500 sm:text-xl">
            Connect unused medicines with those in need. Our AI-powered platform makes medicine donation smart, safe, and efficient.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#donate"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300"
            >
              Donate Medicine
            </a>
            <a
              href="#ngos"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-full text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300"
            >
              Find NGOs <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 bg-white rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative group border border-gray-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
            <div>
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
                <Scan className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 leading-tight">
                Smart Scanning.<br />
                Verifying in seconds.
              </h3>
              <p className="mt-4 text-lg text-gray-500 max-w-xs">
                Scan medicine packaging to instantly verify authenticity and details using our proprietary vision AI.
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="w-full h-40 bg-gradient-to-t from-emerald-50 to-transparent rounded-2xl border-t border-emerald-100 flex items-center justify-center">
                 <div className="h-2 w-3/4 bg-emerald-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/3 animate-pulse"></div>
                 </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 md:row-span-1 bg-emerald-600 rounded-[2.5rem] p-10 flex flex-col justify-center relative overflow-hidden group transition-transform duration-500 hover:scale-[1.01]">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 text-white mb-4 backdrop-blur-md">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Smart Matching</h3>
              <p className="mt-2 text-emerald-50 max-w-sm">
                AI matches your donations with NGOs and hospitals in need in real-time.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-20">
               <Share2 className="h-32 w-32 text-white" />
            </div>
          </div>

          <div className="md:col-span-2 md:row-span-1 bg-white rounded-[2.5rem] p-10 flex flex-col justify-center border border-gray-100 shadow-sm transition-transform duration-500 hover:scale-[1.01]">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 text-white">
                <Activity className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Health Insights</h3>
                <p className="mt-1 text-gray-500">
                  Get personalized health insights from your medical reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}