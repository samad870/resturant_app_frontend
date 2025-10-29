"use client";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../features/cartSlice";
import { Dot } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const groupByCategory = (items) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
};

export default function FoodListing({ menu, onQuantityChange }) {
  const groupedMenu = groupByCategory(menu || []);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || {});
  const [expandedItems, setExpandedItems] = useState({}); // ✅ Track expanded descriptions

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

  // ✅ Toggle "Read More"
  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-gray-50 flex flex-col pb-20 px-3 pt-6">
      {Object.keys(groupedMenu).map((category) => (
        <div key={category} id={`category-${category}`} className="mb-10">
          {/* ✅ Category Header */}
          <div className="flex items-center gap-2 mb-4">
            <Dot className="text-primary" size={14} strokeWidth={24} />
            <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
              {category}
            </h2>
          </div>

          {/* ✅ Food Cards */}
          <div className="flex flex-col gap-5">
            {groupedMenu[category].map((item) => {
              const quantity = cartItems[item._id]?.quantity || 0;
              const isUnavailable = !item.available;
              const descriptionWords = item.description?.split(" ") || [];
              const showReadMore = descriptionWords.length > 70;
              const shortDesc = descriptionWords.slice(0, 70).join(" ") + "…";
              const isExpanded = expandedItems[item._id];

              return (
                <div
                  key={item._id}
                  className={`flex items-start border border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 overflow-hidden ${
                    isUnavailable ? "opacity-60 grayscale" : "opacity-100"
                  }`}
                >
                  {/* ✅ Image Section */}
                  <div className="relative w-40 h-36 flex-shrink-0 overflow-hidden rounded-l-2xl">
                    <img
                      src={item.image?.url}
                      alt={item.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {isUnavailable && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-semibold">
                        Not Available
                      </div>
                    )}
                  </div>

                  {/* ✅ Details Section */}
                  <div className="flex flex-col justify-between p-3 flex-1 h-36">
                    {/* Top Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {item.type === "veg" ? (
                          <Dot
                            size={18}
                            strokeWidth={12}
                            className="border-2 border-green-700 text-green-700"
                          />
                        ) : (
                          <Dot
                            size={18}
                            strokeWidth={12}
                            className="border-2 border-red-600 text-red-600"
                          />
                        )}
                        <h3 className="text-base font-semibold text-gray-900 leading-snug">
                          {item.name}
                        </h3>
                      </div>

                      {/* ✅ Description with Read More */}
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {isExpanded ? item.description : shortDesc}
                        {showReadMore && (
                          <button
                            onClick={() => toggleExpand(item._id)}
                            className="ml-1 text-primary font-medium hover:underline"
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </button>
                        )}
                      </p>
                    </div>

                    {/* Bottom Info */}
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-gray-900 font-semibold text-[15px]">
                        ₹{item.price.toFixed(2)}
                      </span>

                      {!isUnavailable && (
                        <div className="flex items-center gap-2">
                          {quantity > 0 ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => decrement(item)}
                                className="rounded-full h-8 w-8 p-0 text-lg font-bold border-gray-300"
                              >
                                -
                              </Button>
                              <span className="text-sm font-medium min-w-[24px] text-center">
                                {quantity}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => increment(item)}
                                className="rounded-full h-8 w-8 p-0 text-lg font-bold bg-primary text-white hover:bg-primary/90"
                              >
                                +
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => increment(item)}
                              className="rounded-full px-4 text-sm font-semibold bg-primary hover:bg-primary/90 text-white"
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
