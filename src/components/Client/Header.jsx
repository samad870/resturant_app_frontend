import { useState } from "react";
import { X, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({
  logo,
  siteName = "Default Name",
  cartCount = 0,
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

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

        <div className="p-4">
          <p className="text-gray-500">Your cart is empty.</p>
        </div>
      </div>
    </>
  );
}
