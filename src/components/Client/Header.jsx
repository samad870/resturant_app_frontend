import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({
  logo,
  siteName = "Default Name",
  cartCount = 0,
}) {
  return (
    <header className="flex items-center justify-between py-4 shadow-s">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        {logo && <img src={logo} alt="Logo" className="h-12 w-auto" />}
        <span className="text-primary font-mostrate text-2xl">{siteName}</span>
      </Link>

      {/* Cart Icon */}
      <Link to="/cart" className="relative">
        <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
        {/* Badge */}
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
}
