"use client";

import { useState } from "react";
import { Dot } from "lucide-react";
import { Button } from "../ui/button";

// Group items by category
const groupByCategory = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
};

export default function FoodListing({ menu, onQuantityChange }) {
  // 👈 accept callback
  const groupedMenu = groupByCategory(menu);
  const [quantities, setQuantities] = useState(
    menu.reduce((acc, item) => {
      acc[item._id] = 0;
      return acc;
    }, {})
  );

  const updateQuantity = (id, newQty) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: newQty };

      // ✅ calculate subtotal for all items
      const total = menu.reduce(
        (acc, item) => acc + item.price * (updated[item._id] || 0),
        0
      );

      if (onQuantityChange) {
        onQuantityChange(total); // 👈 send total back to Home
      }

      return updated;
    });
  };

  const increment = (id) => updateQuantity(id, quantities[id] + 1);
  const decrement = (id) => updateQuantity(id, Math.max(quantities[id] - 1, 0));

  return (
    <div className="my-4 flex flex-col pb-20">
      {Object.keys(groupedMenu).map((category) => (
        <div key={category} id={`category-${category}`} className="mb-6">
          {/* Category Heading */}
          <div className="flex items-center gap-2 font-normal mb-2">
            <Dot className="text-primary" size={12} strokeWidth={24} />
            <span className="text-lg font-bold">{category}</span>
          </div>

          {/* Items under this category */}
          {groupedMenu[category].map((item) => (
            <div key={item._id} className="py-2 mr-2">
              <div className="border rounded-lg flex gap-1">
                <div className="h-32 w-40 overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center rounded-l-lg"
                    src={item.image.url}
                    alt={item.name}
                  />
                </div>
                <div className="p-2 text-xs font-light flex flex-col justify-between flex-1">
                  <div className="flex items-center gap-1">
                    {/* ✅ Show green for veg, red for non-veg */}
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
                        onClick={() => decrement(item._id)}
                        disabled={quantities[item._id] === 0}
                      >
                        -
                      </Button>
                      <div className="border rounded-sm h-6 w-6 flex justify-center items-center">
                        {quantities[item._id]}
                      </div>
                      <Button
                        className="h-6 w-6"
                        onClick={() => increment(item._id)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
