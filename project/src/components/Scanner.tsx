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



export default function Scanner() {
  const dispatch = useDispatch();

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
          const parsedData = JSON.parse(formattedJson);

          console.log('📌 Parsed QR Data:', parsedData);

          const formattedExpiryDate = parsedData.expiryDate
            ? parsedData.expiryDate.split('T')[0]
            : '';

          dispatch(setMedicineName(parsedData.medicineName || ''));
          dispatch(setExpiryDate(formattedExpiryDate));
          dispatch(setQuantity(parsedData.quantity || 1));
          setBatchNumber(parsedData.batchNumber || '');
          setMedicineNameState(parsedData.medicineName || '');
          setBrand(parsedData.brand || '');
          setManufacturerDetails(parsedData.manufacturerDetails || '');
          setManufacturer(parsedData.manufacturer || '');


          setQuantityState(parsedData.quantity || 1);
          setExpiryDateState(formattedExpiryDate);
          setScanResult(decodedText);

          newScanner.clear();
          setIsScanning(false);
        } catch (error) {
          console.error('❌ Error parsing QR code data:', error);
        }
      },
      (errorMessage) => {
        console.warn('⚠️ QR Code Scan Error:', errorMessage);
      }
    );

    setScanner(newScanner);
    setIsScanning(true);
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
      const response = await axiosInstance.get(`http://localhost:8000/chain/api/verify/${batchNumber}`);
      console.log('Verification response:', response.data);

      const batchDetails = response.data.batchDetails;

      if (batchDetails) {
        setVerificationDetails(batchDetails);

        if (batchDetails.isVerified) {
          setVerificationStatus('Medicine is blockchain verified');
        } else if (batchDetails.isValid) {
          setVerificationStatus('Medicine is valid but not blockchain verified');
        } else {
          setVerificationStatus('Medicine validation failed');
        }
      } else {
        setVerificationStatus('Could not retrieve batch details');
      }
    } catch (error) {
      console.error('Error verifying batch:', error);
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
        batchNumber: batchNumber,
        medicineName: medicineName,
        brand: brand,
        expiryDate: expiryDate,
        manufacturerDetails: manufacturerDetails,
        manufacturer: manufacturer,
        quantity: quantity
      };

      console.log('Sending donation data:', donationData);
      const response = await axiosInstance.post(
        'http://localhost:8000/users/donation/',
        donationData
      );

      console.log('Donation response:', response.data);
      setDonationStatus('Donation successful');
      dispatch(resetForm());
      setScanResult(null);
      setBatchNumber(null);
      setMedicineNameState(null);
      setBrand(null);
      setManufacturerDetails(null);
      setManufacturer(null);
      setQuantityState(1);
      setExpiryDateState(null);
      setVerificationDetails(null);
      setVerificationStatus(null);

    } catch (error) {
      console.error('Error donating medicine:', error);
      setDonationStatus('Donation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="donate">
      <div className="bg-white text-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-600">Scan Medicine QR Code</h2>

        <div id="qr-reader" className="mb-6 border-2 border-gray-300 rounded-lg p-4 bg-gray-100"></div>

        <div className="flex justify-center">
          <button
            onClick={isScanning ? stopScanner : startScanner}
            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
            disabled={isLoading}
          >
            {isScanning ? 'Stop Scanning' : 'Start Scan'}
          </button>
        </div>

        {scanResult && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-emerald-600">Scanned Medicine Details</h3>

            {verificationDetails && verificationDetails.isVerified && (
              <div className="mb-4 flex items-center bg-green-100 p-3 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-green-800">Blockchain Verified</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-bold">Batch Number:</label>
                <input type="text" value={batchNumber || ''} readOnly className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold">Medicine Name:</label>
                <input type="text" value={medicineName || ''} readOnly className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold">Brand:</label>
                <input type="text" value={brand || ''} readOnly className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold">Manufacturer Details:</label>
                <input type="text" value={manufacturerDetails || ''} readOnly className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold">Manufacturer:</label>
                <input type="text" value={manufacturer || ''} readOnly className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold">Quantity:</label>
                <input
                  type="number"
                  value={quantity || 1}
                  onChange={(e) => setQuantityState(parseInt(e.target.value) || 1)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold">Expiry Date:</label>
                <input type="text" value={expiryDate || ''} readOnly className="w-full border p-2 rounded" />
              </div>
            </div>
          </div>
        )}

        {verificationStatus && (
          <div className={`mt-4 p-3 rounded ${verificationStatus.includes('blockchain verified')
              ? 'bg-green-100 text-green-800'
              : verificationStatus.includes('valid')
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
            {verificationStatus}
          </div>
        )}

        {verificationDetails && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-2">Blockchain Verification Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Valid:</div>
              <div>{verificationDetails.isValid ? 'Yes' : 'No'}</div>

              <div className="font-medium">Verified:</div>
              <div>{verificationDetails.isVerified ? 'Yes' : 'No'}</div>

              <div className="font-medium">Authenticated:</div>
              <div>{verificationDetails.isAuthenticated ? 'Yes' : 'No'}</div>

              <div className="font-medium">Active:</div>
              <div>{verificationDetails.isActive ? 'Yes' : 'No'}</div>

              <div className="font-medium">NFT Valid:</div>
              <div>{verificationDetails.isNFTValid ? 'Yes' : 'No'}</div>

              <div className="font-medium">Token ID:</div>
              <div>{verificationDetails.tokenId}</div>
            </div>
          </div>
        )}

        {donationStatus && (
          <div className={`mt-4 p-3 rounded ${donationStatus.includes('success') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {donationStatus}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <button
            type="button"
            onClick={verifyBatch}
            disabled={!scanResult || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isLoading && verificationStatus === 'Verifying...' ? 'Verifying...' : 'Verify Batch'}
          </button>

          <button
            type="button"
            onClick={donateMedicine}
            disabled={!scanResult || isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition disabled:bg-purple-300"
          >
            {isLoading && donationStatus === 'Processing donation...' ? 'Donating...' : 'Donate Medicine'}
          </button>
        </div>
      </div>
    </div>
  );
}