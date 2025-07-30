import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function filter() {
  return (
    <>
      <div className="my-4 flex items-center justify-between gap-2">
        <div className="bg-primary text-white p-2 w-fit rounded-3xl px-4 flex items-center gap-2 shadow-md">
          Filter
          <SlidersHorizontal size={20} strokeWidth={3} />
        </div>
        <div className="flex items-center gap-4 font-thin">
          <div className="flex items-center gap-1">
            Veg
            <Checkbox className="border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-green-600-foreground" />
          </div>
          <div className="flex items-center gap-1">
            Non Veg
            <Checkbox className="border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-red-600-foreground" />
          </div>
        </div>
      </div>
    </>
  );
}
