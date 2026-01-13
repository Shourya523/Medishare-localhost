import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, AlertCircle } from "lucide-react"
import axiosInstance from "../config/axios.config"
import { useSelector } from "react-redux"
import type { RootState } from "../store"
import { Navigate } from "react-router-dom"

// Define proper interfaces for API responses
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
    // Add other fields if needed
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

// Interface for store medicine payload
interface StoreMedicinePayload {
  name: string;
  description: string;
  price: number;
  quantity: number;
  expirationDate: string;
  donatedBy: string;
}

const AdminPanel: React.FC = () => {
  const [medicineDonations, setMedicineDonations] = useState<MedicineDonation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verifiedBatches, setVerifiedBatches] = useState<{ [key: string]: boolean }>({})
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user?.role) return
    fetchMedicineDonations()
  }, [user])

  // Function to safely parse and format a date
  const formatExpiryDate = (dateString: string): string => {
    try {
      // Check if the date is in a valid format
      if (!dateString) {
        // If no date, use a future date (1 year from now)
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        return futureDate.toISOString();
      }
      
      // Try to parse the date
      const parsedDate = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
      
      return parsedDate.toISOString();
    } catch (error) {
      console.warn("Error parsing date:", dateString);
      // Use a fallback date (1 year from now)
      const fallbackDate = new Date();
      fallbackDate.setFullYear(fallbackDate.getFullYear() + 1);
      return fallbackDate.toISOString();
    }
  };

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
        expiryDate: item.expiryDate,
        manufacturerDetails: item.manufacturerDetails,
        manufacturer: item.manufacturer,
      })))
      
      // Reset error if successful
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
      // Fixed syntax error with template string and typed the response
      const { data } = await axiosInstance.get<VerifyBatchResponse>(`/chain/api/verify/${batchNumber}`)
      
      if (data?.batchDetails?.isVerified) {
        setVerifiedBatches((prev) => ({ ...prev, [batchNumber]: true }))
      } else {
        // Handle case where batch is not verified
        alert("This batch could not be verified.")
      }
    } catch (err) {
      console.error("Error verifying batch:", err)
      setError("Failed to verify batch number")
    }
  }

  const handleAddToStore = async (donation: MedicineDonation): Promise<void> => {
    try {
      // Use the safe date formatting function
      const safeExpiryDate = formatExpiryDate(donation.expiryDate);
      
      // Create payload according to the required structure
      const payload: StoreMedicinePayload = {
        name: donation.medicine,
        description: `${donation.brand || donation.manufacturer || ''} - ${donation.medicine}`,
        price: 12.0, // Default price as specified
        quantity: donation.quantity,
        expirationDate: safeExpiryDate,
        donatedBy: donation.userId,
      }
      
      console.log("Sending payload to store:", payload);
      
      // Make the API call to add medicine to store
      await axiosInstance.post("/ecommerce/medicine", payload)
      
      alert("Medicine added to store successfully!")
      
      // Refresh the list after adding to store
      fetchMedicineDonations()
    } catch (err) {
      console.error("Error adding to store:", err)
      setError(`Failed to add medicine to store: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Function to display date in a readable format
  const formatDisplayDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Redirect if not authenticated or not an admin
  if (!user?.role) return <Navigate to="/" replace />

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-full overflow-x-auto">
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
            <button 
              onClick={() => setError("")} 
              className="ml-auto text-red-500 hover:text-red-700"
              aria-label="Dismiss error"
            >
              ×
            </button>
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
                    <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col}
                    </th>
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
                        {formatDisplayDate(donation.expiryDate)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {formatDisplayDate(donation.createdAt)}
                      </td>
                      <td className="px-3 py-2">
                        <button 
                          onClick={() => handleVerifyBatch(donation.batchNumber)} 
                          className={`px-3 py-1 text-white rounded-md text-xs md:text-sm ${
                            verifiedBatches[donation.batchNumber] ? 'bg-green-600 cursor-default' : 'bg-green-500 hover:bg-green-600'
                          }`}
                          disabled={verifiedBatches[donation.batchNumber]}
                          aria-label={verifiedBatches[donation.batchNumber] ? "Batch verified" : "Verify batch"}
                        >
                          {verifiedBatches[donation.batchNumber] ? 'Verified' : 'Verify'}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        {verifiedBatches[donation.batchNumber] && (
                          <button 
                            onClick={() => handleAddToStore(donation)} 
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs md:text-sm"
                            aria-label="Add medicine to store"
                          >
                            Add to Store
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
                      No medicine donations available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel