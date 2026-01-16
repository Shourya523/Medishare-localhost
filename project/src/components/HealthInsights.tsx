import React, { useState } from 'react';
import axiosInstance from '../config/axios.config.ts'
import { FileText, Brain, AlertCircle, Upload, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCurrentReport, addReport } from '../store/slices/healthSlice';
import { useNavigate } from 'react-router-dom';

export default function HealthInsights() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      const response = await axiosInstance.post('http://localhost:8000/users/upload', formData);
      const report = response.data;
      dispatch(addReport(report));
      dispatch(setCurrentReport(report));
      navigate('/report-analysis');
    } catch (error) {
      console.error('Error analyzing report:', error);
      alert('Failed to analyze the report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent py-16 px-4 sm:px-6 lg:px-8 font-sans mt-4 relative z-10" id="insights">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-widest text-xs uppercase">
              <Activity className="h-4 w-4" />
              Diagnostic Engine
            </div>
            <h2 className="text-5xl font-extrabold tracking-tight text-gray-900">Health Insights.</h2>
            <p className="text-xl text-gray-500 max-w-2xl">
              Upload your medical reports and let our AI decipher complex lab results into actionable wellness intelligence.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white px-6 py-4 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-600">Join <span className="text-emerald-600 font-bold">2,000+</span> users tracking health</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full md:h-[500px]">
          {/* Upload Bento Box */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5 group/main">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="health-report"
              />
              <label
                htmlFor="health-report"
                className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] py-20 transition-all duration-500 group/label ${
                  file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                  file ? 'bg-emerald-600 text-white scale-110' : 'bg-emerald-50 text-emerald-600 group-hover/label:scale-110'
                }`}>
                  {file ? <FileText className="h-10 w-10" /> : <Upload className="h-10 w-10" />}
                </div>
                <h4 className="text-2xl font-bold text-gray-900">
                  {file ? file.name : "Select Medical Report"}
                </h4>
                <p className="text-gray-400 mt-2 font-medium">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Drag and drop your PDF or DOCX here"}
                </p>
              </label>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !file}
                className="flex-[2] bg-emerald-600 text-white py-5 rounded-[1.5rem] font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none flex items-center justify-center gap-3 shadow-xl shadow-emerald-200"
              >
                {loading ? (
                  <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Analyze with Med-AI
                  </>
                )}
              </button>
              {file && (
                <button 
                  onClick={() => setFile(null)}
                  className="flex-1 px-8 py-5 bg-gray-50 text-gray-500 rounded-[1.5rem] font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 bg-emerald-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-center relative overflow-hidden group/card shadow-lg shadow-emerald-200">
              <div className="relative z-10">
                <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Advanced Neural Analysis</h3>
                <p className="text-emerald-50/90 leading-relaxed font-medium">
                  Our system cross-references your lab values against clinical guidelines to flag trends before they become issues.
                </p>
              </div>
              <div className="absolute -bottom-12 -right-12 opacity-10 group-hover/card:scale-125 transition-transform duration-1000 ease-in-out">
                <Brain className="h-64 w-64" />
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-start gap-5 hover:border-blue-100 transition-colors">
              <div className="h-14 w-14 bg-blue-50 rounded-[1.25rem] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Privacy Vault</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Your medical data is encrypted with AES-256. Analysis is transient and compliant with global health privacy standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}