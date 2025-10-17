import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

export default function Filter({ filters, onChange }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin");
  };

  // ✅ Handle toggling logic
  const handleFilterChange = (key) => {
    if (key === "veg") {
      onChange("veg", !filters.veg); // toggle veg
      if (!filters.veg) onChange("nonVeg", false); // if enabling veg, disable non-vegggg
    } else if (key === "nonVeg") {
      onChange("nonVeg", !filters.nonVeg); // toggle non-veg
      if (!filters.nonVeg) onChange("veg", false); // if enabling non-veg, disable veg
    }
  };

  return (
    <div className="my-4 flex items-center justify-between gap-2 px-2">
      <div
        onClick={handleClick}
        className="bg-primary text-white p-2 w-fit rounded-3xl px-4 flex items-center gap-2 shadow-md cursor-pointer hover:bg-orange-600 transition"
      >
        Filter
        <SlidersHorizontal size={20} strokeWidth={3} />
      </div>

      <div className="flex items-center gap-4 font-normal">
        {/* ✅ Veg */}
        <div className="flex items-center gap-1">
          Veg
          <Checkbox
            checked={filters.veg}
            onCheckedChange={() => handleFilterChange("veg")}
            className="border-green-600 data-[state=checked]:bg-green-600"
          />
        </div>

        {/* ✅ Non-Veg */}
        <div className="flex items-center gap-1">
          Non Veg
          <Checkbox
            checked={filters.nonVeg}
            onCheckedChange={() => handleFilterChange("nonVeg")}
            className="border-red-600 data-[state=checked]:bg-red-600"
          />
        </div>
      </div>
    </div>
  );
}
