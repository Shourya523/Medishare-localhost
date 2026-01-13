import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import type { RootState } from "../store"
import { removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice"

const OrderSummary: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const handleEmptyCart = () => {
    dispatch(clearCart())
  }

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log("Proceeding to checkout")
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-emerald-600">Order Summary</h1>
          <button
            onClick={() => navigate("/store")}
            className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Store
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between py-4 border-b">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 flex justify-between items-center">
              <button onClick={handleEmptyCart} className="text-red-500 hover:text-red-600 transition-colors">
                Empty Cart
              </button>
              <div className="text-xl font-bold">
                Total: <span className="text-emerald-600">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderSummary

