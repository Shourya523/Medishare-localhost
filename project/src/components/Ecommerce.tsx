import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../config/axios.config"
import { addToCart } from "../store/slices/cartSlice"
import type { RootState } from "../store"

interface Medicine {
  _id: string
  name: string
  description: string
  price: number
  quantity: number
  expirationDate: string
  donatedBy: string
}

const MedicineEcommerce: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axiosInstance.get("/ecommerce/medicine")
        setMedicines(response.data)
      } catch (error) {
        console.error("Error fetching medicines:", error)
      }
    }

    fetchMedicines()
  }, [])

  const handleAddToCart = (medicine: Medicine) => {
    dispatch(addToCart({ ...medicine, quantity: 1 }))
  }

  const goToOrderSummary = () => {
    navigate("/order-summary")
  }

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-emerald-600 px-4 py-2 rounded-md border border-emerald-600 hover:bg-emerald-50 transition-colors">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => (
          <div key={medicine._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{medicine.name}</h2>
              <p className="text-gray-600 mb-4">{medicine.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-bold">${medicine.price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddToCart(medicine)}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4">
        <button
          onClick={goToOrderSummary}
          className="bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition-colors relative"
        >
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default MedicineEcommerce

