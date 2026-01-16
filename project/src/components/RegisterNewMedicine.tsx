import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Package, QrCode, Download, AlertCircle, CheckCircle, Wallet, Loader2, Calendar, Database, Hash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../config/axios.config';

export interface MedicineData {
  medicineId: string;
  adminId: string;
  batchNumber: string;
  medicineName: string;
  brand: string;
  manufacturerDetails: string;
  manufacturer: string; 
  quantity: string;
  expiryDate: string;
  registeredAt: string;
}

const RegisterNewMedicine = () => {
  const [formData, setFormData] = useState<Omit<MedicineData, 'medicineId' | 'registeredAt'>>({
    adminId: '',
    batchNumber: '',
    medicineName: '',
    brand: '',
    manufacturerDetails: '',
    manufacturer: '', 
    quantity: '',
    expiryDate: '',
  });

  const [generatedData, setGeneratedData] = useState<MedicineData | null>(null);
  const [qrString, setQrString] = useState<string>(''); 
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const qrRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.adminId.includes('@') && formData.adminId.length < 5) {
       setMessage({ type: 'error', text: "Please enter a valid Admin Email or unique ID." });
       return false;
    }
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === '') {
        setMessage({ type: 'error', text: "All fields are required." });
        return false;
      }
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;
    setIsLoading(true);

    try {
        const apiPayload = {
            batchNumber: formData.batchNumber,
            name: formData.medicineName, 
            brand: formData.brand,
            expiryDate: formData.expiryDate,
            manufacturerDetails: formData.manufacturerDetails,
            manufacturer: formData.manufacturer
        };
        
        await axiosInstance.post('/chain/api/medicines/add', apiPayload);

        const newMedicineId = uuidv4();
        const registrationTime = new Date().toISOString();
        const newMedicineData: MedicineData = {
          ...formData,
          medicineId: newMedicineId,
          registeredAt: registrationTime,
        };

        setGeneratedData(newMedicineData);

        const compressedData = {
          id: newMedicineId,
          aid: newMedicineData.adminId,
          bn: newMedicineData.batchNumber,
          mn: newMedicineData.medicineName,
          br: newMedicineData.brand,
          md: newMedicineData.manufacturerDetails,
          m: newMedicineData.manufacturer,
          q: newMedicineData.quantity,
          ed: newMedicineData.expiryDate,
          ts: registrationTime
        };
        
        setQrString(JSON.stringify(compressedData));
        setMessage({ type: 'success', text: "Asset Secured on Blockchain." });

    } catch (error: any) {
        const errorMsg = error.response?.data?.error || error.message || "Blockchain transaction failed.";
        setMessage({ type: 'error', text: errorMsg });
    } finally {
        setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
        const imageURI = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageURI;
        link.download = `QR-${generatedData?.batchNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-transparent min-h-screen py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Chain Registry.</h1>
          <p className="text-gray-500 text-lg mt-2">Mint new pharmaceutical assets onto the secure ledger.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Registration Form */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Database className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Metadata Entry</h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Registrar Identity</label>
                  <input type="text" name="adminId" value={formData.adminId} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="admin@vault.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Manufacturer Wallet</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="w-full pl-11 pr-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="0x..." />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Medicine Nomenclature</label>
                  <input type="text" name="medicineName" value={formData.medicineName} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="Product Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Units</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Batch ID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} className="w-full pl-11 pr-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="B-000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="Label" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Expiry</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full pl-11 pr-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Origin Details</label>
                <textarea name="manufacturerDetails" value={formData.manufacturerDetails} onChange={handleChange} rows={2} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none" placeholder="Facility address and certification numbers..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 text-white py-5 rounded-2xl transition-all font-bold active:scale-[0.98] shadow-lg shadow-blue-100 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <QrCode className="h-6 w-6" />}
                {isLoading ? 'Authorizing Transaction...' : 'Mint to Blockchain'}
              </button>
            </form>
          </div>

          {/* QR & Status Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`rounded-[2.5rem] p-8 border transition-all duration-500 ${message?.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-100 shadow-xl' : 'bg-white border-gray-100 shadow-sm'}`}>
               <div className="flex items-center gap-4 mb-4">
                 {message?.type === 'success' ? <CheckCircle className="h-8 w-8 text-emerald-100" /> : <AlertCircle className={`h-8 w-8 ${message?.type === 'error' ? 'text-red-500' : 'text-gray-300'}`} />}
                 <h3 className="text-xl font-bold">System Status</h3>
               </div>
               <p className={message?.type === 'success' ? 'text-emerald-50' : 'text-gray-500'}>
                 {message?.text || "Awaiting registration data to initiate cryptographic sealing."}
               </p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              {generatedData ? (
                <div className="w-full animate-in fade-in zoom-in duration-500">
                  <div className="bg-gray-50 p-6 rounded-[2rem] flex justify-center mb-6" ref={qrRef}>
                    <QRCodeCanvas
                      value={qrString}
                      size={220} 
                      level={"H"} 
                      includeMargin={false}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                       <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Asset Hash</p>
                       <p className="text-[11px] font-mono break-all text-gray-600">{generatedData.medicineId}</p>
                    </div>
                    <button 
                      onClick={downloadQR}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl hover:bg-black transition-all font-bold active:scale-95"
                    >
                      <Download className="h-5 w-5" />
                      Save Identity Tag
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-10 w-10 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-medium">QR will be generated<br/>after minting.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterNewMedicine;