import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, AlertCircle, X, DollarSign, Calendar } from "lucide-react"
import axiosInstance from "../config/axios.config"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { Navigate } from "react-router-dom"

interface UserData {
  _id: string;
  name: string;
}

interface DonationApiResponse {
  _id: string;
  medicine: string;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  user: UserData;
  createdAt: string;
  batchNumber: string;
  brand: string;
  expiryDate: string;
  manufacturerDetails: string;
  manufacturer: string;
}

interface VerifyBatchResponse {
  batchDetails: {
    isVerified: boolean;
  };
}

interface MedicineDonation {
  _id: string;
  medicine: string;
  quantity: number;
  status: "pending" | "approved" | "rejected";
  donorName: string;
  userId: string;
  createdAt: string;
  batchNumber: string;
  brand: string;
  expiryDate: string;
  manufacturerDetails: string;
  manufacturer: string;
}

const AdminPanel: React.FC = () => {
  const [medicineDonations, setMedicineDonations] = useState<MedicineDonation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verifiedBatches, setVerifiedBatches] = useState<{ [key: string]: boolean }>({})
  const { user } = useSelector((state: RootState) => state.auth)

  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<MedicineDonation | null>(null)
  const [priceInput, setPriceInput] = useState<string>("")
  const [expiryInput, setExpiryInput] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user?.role) return
    fetchMedicineDonations()
  }, [user])

  const fetchMedicineDonations = async (): Promise<void> => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get<DonationApiResponse[]>("/users/donation/")
      
      setMedicineDonations(data.map((item: DonationApiResponse) => ({
        _id: item._id,
        medicine: item.medicine,
        quantity: item.quantity,
        status: item.status,
        donorName: item.user.name,
        userId: item.user._id,
        createdAt: item.createdAt,
        batchNumber: item.batchNumber,
        brand: item.brand,
        expiryDate: item.expiryDate, // Now this will populate if backend has it
        manufacturerDetails: item.manufacturerDetails,
        manufacturer: item.manufacturer,
      })))
      
      setError("")
    } catch (err) {
      console.error("Error fetching donations:", err)
      setError("Failed to fetch medicine donations")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyBatch = async (batchNumber: string): Promise<void> => {
    try {
      const { data } = await axiosInstance.get<VerifyBatchResponse>(`/chain/api/verify/${batchNumber}`)
      
      if (data?.batchDetails?.isVerified) {
        setVerifiedBatches((prev) => ({ ...prev, [batchNumber]: true }))
      } else {
        alert("This batch could not be verified.")
      }
    } catch (err) {
      console.error("Error verifying batch:", err)
      setError("Failed to verify batch number")
    }
  }

  // --- Open Modal ---
  const openStoreModal = (donation: MedicineDonation) => {
    setSelectedDonation(donation);
    setPriceInput("0"); // Default price
    
    // Try to format existing date for the input field (YYYY-MM-DD)
    try {
        if (donation.expiryDate && donation.expiryDate !== "Invalid Date") {
            const dateObj = new Date(donation.expiryDate);
            if (!isNaN(dateObj.getTime())) {
                setExpiryInput(dateObj.toISOString().split('T')[0]);
            } else {
                setExpiryInput(""); 
            }
        } else {
            setExpiryInput("");
        }
    } catch (e) {
        setExpiryInput("");
    }
    
    setIsModalOpen(true);
  };

  // --- Submit to Store ---
  const handleSubmitToStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonation) return;

    if (!priceInput || Number(priceInput) < 0) {
        alert("Please enter a valid price");
        return;
    }
    if (!expiryInput) {
        alert("Please enter a valid expiry date");
        return;
    }

    try {
        setSubmitting(true);
        
        const payload = {
            name: selectedDonation.medicine,
            description: `${selectedDonation.brand || selectedDonation.manufacturerDetails || ''} - ${selectedDonation.medicine}`,
            price: Number(priceInput), // User input price
            quantity: selectedDonation.quantity,
            expirationDate: new Date(expiryInput).toISOString(), // User corrected date
            donatedBy: selectedDonation.userId,
        }

        console.log("Sending payload to store:", payload);
        await axiosInstance.post("/ecommerce/medicine", payload);
        
        alert("Medicine added to store successfully!");
        setIsModalOpen(false);
        fetchMedicineDonations();

    } catch (err) {
        console.error("Error adding to store:", err);
        alert(`Failed to add: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
        setSubmitting(false);
    }
  };

  const formatDisplayDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  if (!user?.role) return <Navigate to="/" replace />

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-full overflow-x-auto relative">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 text-center">Medicine Donations Administration</h1>
          <button 
            onClick={fetchMedicineDonations} 
            className="flex items-center px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Medicine", "Quantity", "Donor", "Batch Number", "Brand", "Expiry Date", "Created At", "Verify", "Add to Store"].map((col) => (
                    <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-sm">
                {medicineDonations.length > 0 ? (
                  medicineDonations.map((donation) => (
                    <motion.tr key={donation._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="hover:bg-gray-100">
                      <td className="px-3 py-2 whitespace-nowrap">{donation.medicine}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{donation.quantity}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{donation.donorName}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{donation.batchNumber}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{donation.brand || donation.manufacturerDetails}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {/* Show raw date or 'Invalid' but user can fix it in modal */}
                        <span className={formatDisplayDate(donation.expiryDate) === "Invalid date" ? "text-red-500 font-bold" : ""}>
                           {formatDisplayDate(donation.expiryDate)}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatDisplayDate(donation.createdAt)}</td>
                      <td className="px-3 py-2">
                        <button 
                          onClick={() => handleVerifyBatch(donation.batchNumber)} 
                          className={`px-3 py-1 text-white rounded-md text-xs md:text-sm ${
                            verifiedBatches[donation.batchNumber] ? 'bg-green-600 cursor-default' : 'bg-green-500 hover:bg-green-600'
                          }`}
                          disabled={verifiedBatches[donation.batchNumber]}
                        >
                          {verifiedBatches[donation.batchNumber] ? 'Verified' : 'Verify'}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        {verifiedBatches[donation.batchNumber] && (
                          <button 
                            onClick={() => openStoreModal(donation)} // Changed to open modal
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs md:text-sm"
                          >
                            Add to Store
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr><td colSpan={9} className="px-3 py-4 text-center text-gray-500">No medicine donations available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ADD TO STORE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && selectedDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
                <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg">Add to Store</h3>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmitToStore} className="p-6 space-y-4">
                    <div className="bg-emerald-50 p-3 rounded-lg text-sm text-emerald-800 mb-4">
                        <p><strong>Adding:</strong> {selectedDonation.medicine}</p>
                        <p><strong>Batch:</strong> {selectedDonation.batchNumber}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <DollarSign size={14} /> Price ($)
                        </label>
                        <input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Calendar size={14} /> Expiry Date (Verify)
                        </label>
                        <input 
                            type="date" 
                            value={expiryInput}
                            onChange={(e) => setExpiryInput(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Please confirm or correct the expiry date before publishing.</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {submitting ? 'Publishing...' : 'Publish to Store'}
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPanel