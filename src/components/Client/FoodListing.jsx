"use client";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../features/cartSlice";
import { Dot } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";

// Group items by category
const groupByCategory = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
};

export default function FoodListing({ menu, onQuantityChange }) {
  const groupedMenu = groupByCategory(menu);
  const dispatch = useDispatch();

  // Get cart from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // Run callback whenever cart changes
  useEffect(() => {
    if (onQuantityChange) {
      const total = Object.values(cartItems).reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      onQuantityChange(total);
    }
  }, [cartItems, onQuantityChange]);

  const increment = (item) => {
    dispatch(addToCart({ id: item._id, item }));
  };

  const decrement = (item) => {
    dispatch(removeFromCart(item._id));
  };

  return (
    <div className="my-4 flex flex-col pb-20">
      {Object.keys(groupedMenu).map((category) => (
        <div key={category} id={`category-${category}`} className="mb-6">
          <div className="flex items-center gap-2 font-normal mb-2">
            <Dot className="text-primary" size={12} strokeWidth={24} />
            <span className="text-lg font-bold">{category}</span>
          </div>

          {groupedMenu[category].map((item) => {
            const quantity = cartItems[item._id]?.quantity || 0; // ✅ derive directly from Redux
            return (
              <div key={item._id} className="py-2 mr-2">
                <div className="border rounded-lg flex gap-1 shadow-md">
                  <div className="h-32 w-40 overflow-hidden">
                    <img
                      className="w-full h-full object-cover object-center rounded-l-lg"
                      src={item.image.url}
                      alt={item.name}
                    />
                  </div>
                  <div className="p-2 text-xs font-light flex flex-col justify-between flex-1">
                    <div className="flex items-center gap-1">
                      {item.type === "veg" ? (
                        <Dot
                          size={18}
                          strokeWidth={12}
                          className="border-2 border-green-800 text-green-800"
                        />
                      ) : (
                        <Dot
                          size={18}
                          strokeWidth={12}
                          className="border-2 border-red-600 text-red-600"
                        />
                      )}
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-gray-500">{item.description}</div>
                    <div className="flex justify-between gap-1 items-end">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          Starts From Rs {item.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="h-6 w-6"
                          onClick={() => decrement(item)}
                          disabled={quantity === 0}
                        >
                          -
                        </Button>
                        <div className="border rounded-sm h-6 w-6 flex justify-center items-center">
                          {quantity}
                        </div>
                        <Button
                          className="h-6 w-6"
                          onClick={() => increment(item)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
