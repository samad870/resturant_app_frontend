"use client";

import { useState } from "react";
import { Pizza, Dot } from "lucide-react";
import { Button } from "../ui/button";

const foodItems = [
  {
    id: 1,
    name: "Farm Fresh Pizza",
    description:
      "Savor the taste of summer with our farm-fresh pizza, bursting with juicy tomatoes and crisp vegetables.",
    price: 139.0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzDD6L0Knn_LqF0Z8YyHt5eVbfDVpx993bgQ&s",
  },
  {
    id: 2,
    name: "Spicy Paneer Pizza",
    description: "Loaded with spicy paneer cubes and fresh herbs.",
    price: 159.0,
    image:
      "https://b.zmtcdn.com/data/pictures/chains/3/143/6e96bfb00b9dd20195385f866d3e0e10_featured_v2.jpg",
  },
];

export default function FoodListing() {
  const [quantities, setQuantities] = useState(
    foodItems.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {})
  );

  const increment = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decrement = (id) => {
    if (quantities[id] > 0) {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  return (
    <div className="my-4 flex flex-col pb-20">
      <div className="flex items-center gap-2 font-normal">
        <Pizza className="text-primary" size={24} strokeWidth={2.5} />
        <span className="text-lg">Pizza</span>
      </div>

      {foodItems.map((item) => (
        <div key={item.id} className="py-2 mr-2">
          <div className="border rounded-lg flex gap-1">
            <div className="h-32 w-40 overflow-hidden">
              <img
                className="w-full h-full object-cover object-center rounded-l-lg"
                src={item.image}
                alt={item.name}
              />
            </div>
            <div className="p-2 text-xs font-light flex flex-col justify-between flex-1">
              <div className="flex items-center gap-1">
                <Dot
                  size={18}
                  strokeWidth={12}
                  className="border-2 border-green-800 text-green-800"
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-gray-500">{item.description}</div>
              <div className="flex justify-between gap-1 items-end">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    Starts From Rs {item.price.toFixed(2)}
                  </span>
                  <span className="text-primary">Customization available</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="h-6 w-6"
                    onClick={() => decrement(item.id)}
                    disabled={quantities[item.id] === 0}
                  >
                    -
                  </Button>
                  <div className="border rounded-sm h-6 w-6 flex justify-center items-center">
                    {quantities[item.id]}
                  </div>
                  <Button className="h-6 w-6" onClick={() => increment(item.id)}>
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
