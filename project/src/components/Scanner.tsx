import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useDispatch } from 'react-redux';
import {
  setMedicineName,
  setExpiryDate,
  setQuantity,
  resetForm
} from '../store/slices/uploadSlice';
import axiosInstance from '../config/axios.config';
import { CheckCircle, AlertCircle, ShieldCheck, Box, Calendar, Factory, Zap, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Scanner() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logic from Code 1: Comprehensive State Management
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [batchNumber, setBatchNumber] = useState<string | null>(null);
  const [medicineName, setMedicineNameState] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [manufacturerDetails, setManufacturerDetails] = useState<string | null>(null);
  const [manufacturer, setManufacturer] = useState<string | null>(null);
  const [quantity, setQuantityState] = useState<number>(1);
  const [expiryDate, setExpiryDateState] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<any>(null);
  const [donationStatus, setDonationStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Logic from Code 1: Robust Parsing & Scanner Control
  const startScanner = () => {
    console.log("Starting QR Scanner...");
    const newScanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    newScanner.render(
      (decodedText) => {
        console.log('✅ QR Code Scanned:', decodedText);
        try {
          const formattedJson = decodedText.replace(/'/g, '"');
          const rawData = JSON.parse(formattedJson);

          const parsedData = {
            medicineName: rawData.mn || rawData.medicineName || '',
            batchNumber: rawData.bn || rawData.batchNumber || '',
            brand: rawData.br || rawData.brand || '',
            manufacturerDetails: rawData.md || rawData.manufacturerDetails || '',
            manufacturer: rawData.m || rawData.manufacturer || '',
            quantity: rawData.q || rawData.quantity || 1,
            expiryDate: rawData.ed || rawData.expiryDate || '',
          };

          const formattedExpiryDate = parsedData.expiryDate ? parsedData.expiryDate.split('T')[0] : '';

          // Update Redux
          dispatch(setMedicineName(parsedData.medicineName));
          dispatch(setExpiryDate(formattedExpiryDate));
          dispatch(setQuantity(Number(parsedData.quantity) || 1));

          // Update Local State
          setBatchNumber(parsedData.batchNumber);
          setMedicineNameState(parsedData.medicineName);
          setBrand(parsedData.brand);
          setManufacturerDetails(parsedData.manufacturerDetails);
          setManufacturer(parsedData.manufacturer);
          setQuantityState(Number(parsedData.quantity) || 1);
          setExpiryDateState(formattedExpiryDate);

          setScanResult(decodedText);
          newScanner.clear();
          setIsScanning(false);
        } catch (error) {
          console.error('❌ Error parsing QR code data:', error);
        }
      },
      (errorMessage) => { /* Silent error for frame mismatches */ }
    );

    setScanner(newScanner);
    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setIsScanning(false);
    }
  };

  const verifyBatch = async () => {
    if (!batchNumber) {
      setVerificationStatus('No batch number to verify');
      return;
    }

    setIsLoading(true);
    setVerificationStatus('Verifying...');
    setVerificationDetails(null);

    try {
      const response = await axiosInstance.get(`/chain/api/verify/${batchNumber}`);
      const batchDetails = response.data.batchDetails;

      if (batchDetails) {
        setVerificationDetails(batchDetails);
        if (batchDetails.isVerified) {
          setVerificationStatus('Medicine is blockchain verified');
        } else if (batchDetails.isValid) {
          setVerificationStatus('Medicine is valid (Manual Check)');
        } else {
          setVerificationStatus('Medicine validation failed');
        }
      }
    } catch (error) {
      setVerificationStatus('Verification failed. Server error.');
    } finally {
      setIsLoading(false);
    }
  };

  const donateMedicine = async () => {
    if (!batchNumber) {
      setDonationStatus('Missing required information');
      return;
    }

    setIsLoading(true);
    setDonationStatus('Processing donation...');

    try {
      const donationData = {
        batchNumber,
        medicineName,
        brand,
        expiryDate,
        manufacturerDetails,
        manufacturer,
        quantity
      };

      await axiosInstance.post('/users/donation/', donationData);
      setDonationStatus('Donation successful!');
      dispatch(resetForm());
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setDonationStatus('Please Login to Donate');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setDonationStatus('Donation failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-auto bg-transparent py-12 px-4 sm:px-6 lg:px-8 font-sans scroll-mt-24" id="donate">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">Verify & Donate.</h2>
          <p className="mt-2 text-gray-500 font-medium">Apple-grade security for your medical contributions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Scanner Viewport */}
          <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white/20 flex flex-col items-center justify-center transition-all">
            <div id="qr-reader" className="w-full max-w-md overflow-hidden rounded-3xl border-0 bg-gray-50/50 mb-8"></div>
            
            <button
              onClick={isScanning ? stopScanner : startScanner}
              className={`group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold transition-all duration-300 ${
                isScanning 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
              }`}
            >
              {isScanning ? <ScanLine className="h-5 w-5 animate-pulse" /> : <Zap className="h-5 w-5 fill-current" />}
              {isScanning ? 'Stop Scanner' : 'Activate Camera'}
            </button>
          </div>

          {/* Security Status Card */}
          <div className={`rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 border shadow-sm ${
            verificationDetails?.isVerified 
            ? 'bg-emerald-500 border-emerald-400 text-white' 
            : 'bg-white/70 backdrop-blur-md border-white/20 text-gray-900'
          }`}>
            <div>
              <ShieldCheck className={`h-12 w-12 mb-6 ${verificationDetails?.isVerified ? 'text-emerald-100' : 'text-emerald-500'}`} />
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Security Check</h3>
              <p className={`font-medium ${verificationDetails?.isVerified ? 'text-emerald-50' : 'text-gray-500'}`}>
                {verificationStatus || 'Awaiting scan to initiate blockchain validation.'}
              </p>
            </div>
            
            {verificationDetails && (
              <div className={`mt-6 p-4 rounded-2xl backdrop-blur-md ${verificationDetails?.isVerified ? 'bg-white/10' : 'bg-gray-50/50'}`}>
                <div className="flex justify-between text-sm mb-1">
                   <span className="opacity-70 font-medium">Batch ID</span>
                   <span className="font-bold">#{batchNumber?.slice(-6)}</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="opacity-70 font-medium">Authenticated</span>
                   <span className="font-bold">{verificationDetails.isVerified ? 'Yes' : 'Pending'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Scanned Data Bento Grid */}
          {scanResult && (
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white/20 flex items-center gap-5">
                <div className="h-14 w-14 bg-emerald-50/50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Box className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Medicine</p>
                  <p className="text-xl font-bold text-gray-900">{medicineName || 'Unknown'}</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white/20 flex flex-col justify-between">
                <Calendar className="h-6 w-6 text-orange-500 mb-2" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Expires</p>
                  <p className="text-lg font-bold">{expiryDate || '--/--/--'}</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white/20">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Quantity</p>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantityState(parseInt(e.target.value) || 1)}
                  className="text-2xl font-bold text-emerald-600 bg-transparent w-full outline-none"
                />
              </div>

              <div className="md:col-span-2 bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white/20 flex items-center gap-5">
                <div className="h-12 w-12 bg-blue-50/50 rounded-xl flex items-center justify-center text-blue-600">
                  <Factory className="h-6 w-6" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Manufacturer</p>
                  <p className="text-lg font-bold truncate">{brand || manufacturerDetails || 'N/A'}</p>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <button
                  onClick={verifyBatch}
                  disabled={isLoading}
                  className="bg-gray-900 text-white rounded-[1.5rem] font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading && verificationStatus === 'Verifying...' ? '...' : 'Verify'}
                </button>
                <button
                  onClick={donateMedicine}
                  disabled={isLoading}
                  className="bg-emerald-600 text-white rounded-[1.5rem] font-bold hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  Donate Now
                </button>
              </div>
            </div>
          )}
        </div>

        {donationStatus && (
          <div className={`mt-8 max-w-md mx-auto p-4 rounded-2xl flex items-center justify-center gap-3 animate-in zoom-in duration-300 ${
            donationStatus.includes('successful') ? 'bg-emerald-100/80 text-emerald-800' : 'bg-red-100/80 text-red-800'
          } backdrop-blur-sm border border-white/20`}>
            {donationStatus.includes('Login') ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            <span className="font-bold">{donationStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}