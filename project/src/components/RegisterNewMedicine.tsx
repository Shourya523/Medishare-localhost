import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Package, QrCode, Download, AlertCircle, CheckCircle, Wallet, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../config/axios.config'; // Ensure this path matches your project structure

// Define the structure of the medicine data
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
  // Form state
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
    
    // Check all fields
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
        // 1. First, save to Blockchain/Database
        // Mapping fields to match what your backend '/chain/api/medicines/add' expects
        const apiPayload = {
            batchNumber: formData.batchNumber,
            name: formData.medicineName, 
            brand: formData.brand,
            expiryDate: formData.expiryDate,
            manufacturerDetails: formData.manufacturerDetails,
            manufacturer: formData.manufacturer
        };

        console.log("Saving to blockchain:", apiPayload);
        
        await axiosInstance.post('/chain/api/medicines/add', apiPayload);

        // 2. If successful, generate the QR Code logic
        const newMedicineData: MedicineData = {
          ...formData,
          medicineId: uuidv4(),
          registeredAt: new Date().toISOString(),
        };

        setGeneratedData(newMedicineData);

        // Compress data for QR Code (Mapping long keys to short keys)
        const compressedData = {
          id: newMedicineData.medicineId,
          aid: newMedicineData.adminId,
          bn: newMedicineData.batchNumber,
          mn: newMedicineData.medicineName,
          br: newMedicineData.brand,
          md: newMedicineData.manufacturerDetails,
          m: newMedicineData.manufacturer,
          q: newMedicineData.quantity,
          ed: newMedicineData.expiryDate,
          ts: newMedicineData.registeredAt
        };
        
        setQrString(JSON.stringify(compressedData));
        setMessage({ type: 'success', text: "Medicine registered on Blockchain & QR Generated!" });

    } catch (error: any) {
        console.error("Registration failed:", error);
        const errorMsg = error.response?.data?.error || error.message || "Failed to register medicine on blockchain.";
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
        link.download = `${generatedData?.medicineName}-${generatedData?.batchNumber}-QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <Package className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Register New Medicine</h2>
          <p className="text-sm text-gray-500">Enter details to save to blockchain and generate QR</p>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20} />}
            {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID / Email</label>
                <input type="text" name="adminId" value={formData.adminId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@example.com" required />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Wallet size={14} /> Manufacturer Blockchain ID
                </label>
                <input 
                    type="text" 
                    name="manufacturer" 
                    value={formData.manufacturer} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="0x..." 
                    required
                />
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="BATCH-001" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" min="1" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
            <input type="text" name="medicineName" value={formData.medicineName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Amoxicillin" required />
          </div>
          
           <div className="grid grid-cols-2 gap-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                 <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
             </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
             </div>
           </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer Details (Physical)</label>
            <textarea name="manufacturerDetails" value={formData.manufacturerDetails} onChange={handleChange} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Address, Contact info..." required></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-colors font-medium ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
            {isLoading ? 'Registering on Blockchain...' : 'Register & Generate QR'}
          </button>
        </form>

        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
          {generatedData ? (
            <div className="text-center space-y-4 w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Generated QR Code</h3>
              <div className="bg-white p-4 rounded-xl shadow-sm inline-block" ref={qrRef}>
                <QRCodeCanvas
                  value={qrString}
                  size={300} 
                  level={"M"} 
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-gray-500 font-mono mt-2 break-all px-4">
                 ID: {generatedData.medicineId}
              </p>
              <button 
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5" />
                Download QR Code
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Fill the form to generate a QR code.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterNewMedicine;