import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export default function Filter({ filters, onChange }) {
  const handleFilterChange = (key) => {
    if (key === "veg") {
      onChange("veg", !filters.veg);
      if (!filters.veg) onChange("nonVeg", false);
    } else if (key === "nonVeg") {
      onChange("nonVeg", !filters.nonVeg);
      if (!filters.nonVeg) onChange("veg", false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between bg-gradient-to-r from-white/70 to-white/40 backdrop-blur-xl border-gray-200 px-2 pt-2"
    >
      {/* Filter Title */}
      <div className="flex items-center gap-2">
        <div className="bg-gray-100 p-2 rounded-xl shadow-sm">
          <SlidersHorizontal
            className="text-gray-700"
            size={20}
            strokeWidth={2.2}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
          Filters
        </h2>
      </div>

      {/* Veg / Non-Veg Options */}
      <div className="flex items-center gap-6 text-gray-800 text-sm md:text-base">
        {/* Veg Option */}
        <label className="flex items-center gap-2 cursor-pointer group transition">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500 bg-green-50 group-hover:bg-green-100 shadow-sm transition-all">
            <span className="font-medium text-green-700">Veg</span>
            <Checkbox
              checked={filters.veg}
              onCheckedChange={() => handleFilterChange("veg")}
              className="border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
          </div>
        </label>

        {/* Non-Veg Option */}
        <label className="flex items-center gap-2 cursor-pointer group transition">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500 bg-red-50 group-hover:bg-red-100 shadow-sm transition-all">
            <span className="font-medium text-red-700">Non-Veg</span>
            <Checkbox
              checked={filters.nonVeg}
              onCheckedChange={() => handleFilterChange("nonVeg")}
              className="border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
          </div>
        </label>
      </div>
    </motion.div>
  );
}
