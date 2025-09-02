import { useState } from "react";
import { X, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../../features/cartSlice";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import OrderComplete from "@/components/Client/OrderComplete";

export default function Header({ logo, siteName = "Default Name" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // form inputs
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableId, setTableId] = useState("");

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalAmount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // handle order API
  const handleOrderSubmit = async () => {
    try {
      setLoading(true);
      const restaurantId = "cafe";

      const orderItems = Object.values(cartItems).map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        price: item.price,
      }));
      toast({
        title: "Order Commplete thankyou!",
        description: "it will take upto 10 t0 15 min",
      });

      const response = await fetch(
        `https://restaurant-app-backend-mihf.onrender.com/api/order/${restaurantId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName,
            customerPhone,
            tableId,
            items: orderItems,
            totalAmount,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to place order");

      const data = await response.json();
      console.log("Order Success:", data);

      // ✅ close modal + cart
      setShowModal(false);
      setIsCartOpen(false);

      // ✅ THEN clear cart
      setTimeout(() => {
        dispatch(clearCart());
      }, 300);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <OrderComplete
        amount={totalAmount.toFixed(2)}
        buttonText="Order Now"
        disabled={cartCount === 0}
        onClick={() => setShowModal(true)}
      />
      {/* Header */}
      <header className="flex items-center justify-between pt-4 pb-2">
        <Link to="/" className="flex items-center space-x-2">
          {logo && <img src={logo} alt="Logo" className="h-12 w-auto" />}
          <span className="text-primary font-mostrate text-2xl">
            {siteName}
          </span>
        </Link>

        <button onClick={() => setIsCartOpen(true)} className="relative">
          <Utensils className="w-6 h-6 text-gray-700 hover:text-black" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsCartOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Your Food</h2>
          <button onClick={() => setIsCartOpen(false)}>
            <X className="w-6 h-6 text-gray-600 hover:text-black" />
          </button>
        </div>

        <div className="p-4 flex flex-col justify-between gap-6 h-[calc(100%-4rem)]">
          {cartCount === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-4 flex-1 overflow-y-auto">
                {Object.values(cartItems).map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                      <button
                        className="text-xs text-red-600 hover:underline"
                        onClick={() => dispatch(removeFromCart(item._id))}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="font-semibold text-sm">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              <Button
                className="bg-primary text-white w-full"
                disabled={cartCount === 0}
                onClick={() => setShowModal(true)} // open modal instead of API
              >
                Order Now
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modal for Customer Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            />

            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="">Select Table</option>
              <option value="T1">Table 1</option>
              <option value="T2">Table 2</option>
              <option value="T3">Table 3</option>
              <option value="T4">Table 4</option>
              <option value="T5">Table 5</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-white"
                onClick={handleOrderSubmit}
                disabled={
                  !customerName || !customerPhone || !tableId || loading
                }
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
