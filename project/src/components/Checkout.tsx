import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, CreditCard, DollarSign } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "../store"

const dummyCartItems = [
  { id: 1, name: "Product A", price: 20, quantity: 2 },
  { id: 2, name: "Product B", price: 15, quantity: 1 },
  { id: 3, name: "Product C", price: 30, quantity: 3 },
]

const Checkout: React.FC = () => {
  // Check if Redux slice exists before accessing state
  const cartItems = useSelector((state: RootState) =>  dummyCartItems)//state?.cart?.items

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleCheckout = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      alert("Thank you for your donation!")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-emerald-600 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Your Donation Cart</h2>
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center border-b border-gray-200 py-4"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <button className="text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="mt-4 text-right">
            <p className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    paymentMethod === "card" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <CreditCard size={20} />
                  <span>Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    paymentMethod === "cash" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <DollarSign size={20} />
                  <span>Cash</span>
                </button>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isProcessing}
              className={`w-full bg-emerald-500 text-white py-2 rounded-md transition-colors ${
                cartItems.length === 0 || isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600"
              }`}
            >
              {isProcessing ? "Processing..." : "Complete Donation"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Checkout
