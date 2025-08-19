import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

export default function OrderComplete({ total }) {
  if (total === 0) return null; // hide strip when no items selected

  return (
    <div className="fixed bottom-5 left-0 text-white px-3 w-full">
      <div className="bg-primary w-full p-2 flex items-center justify-between rounded-xl">
        <span className="flex items-center gap-1">
          <IndianRupee size={20} strokeWidth={2.5} />
          {total.toFixed(2)}
        </span>
        <Button className="bg-white text-primary hover:bg-white">Order Now</Button>
      </div>
    </div>
  );
}
