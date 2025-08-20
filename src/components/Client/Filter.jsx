import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Filter({ filters, onChange }) {
  return (
    <div className="my-4 flex items-center justify-between gap-2">
      <div className="bg-primary text-white p-2 w-fit rounded-3xl px-4 flex items-center gap-2 shadow-md">
        Filter
        <SlidersHorizontal size={20} strokeWidth={3} />
      </div>
      <div className="flex items-center gap-4 font-normal">
        <div className="flex items-center gap-1">
          Veg
          <Checkbox
            checked={filters.veg}
            onCheckedChange={(val) => onChange("veg", val)}
            className="border-green-600 data-[state=checked]:bg-green-600"
          />
        </div>
        <div className="flex items-center gap-1">
          Non Veg
          <Checkbox
            checked={filters.nonVeg}
            onCheckedChange={(val) => onChange("nonVeg", val)}
            className="border-red-600 data-[state=checked]:bg-red-600"
          />
        </div>
      </div>
    </div>
  );
}
