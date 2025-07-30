import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/tapNOrder.webp"; // Add your logo image here (PNG/WebP/SVG)

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-s">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Logo" className="h-12 w-auto" />
      </Link>

      {/* Cart Icon */}
      <Link to="/cart" className="relative">
        <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
        {/* Optional: Badge */}
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          2
        </span>
      </Link>
    </header>
  );
}
