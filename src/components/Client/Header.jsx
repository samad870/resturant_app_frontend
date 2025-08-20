import { useState } from "react";
import { X, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../features/cartSlice"; // ✅ adjust path

export default function Header({ logo, siteName = "Default Name" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();

  // Get cart from Redux
  const cartItems = useSelector((state) => state.cart.items);

  // total items count
  const cartCount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // total amount
  const totalAmount = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <header className="flex items-center justify-between py-4">
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

              {/* Total Amount Section */}
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              <Button className="bg-primary text-white w-full" disabled={cartCount === 0}>
                Order Now
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
