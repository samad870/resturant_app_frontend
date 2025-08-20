import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

export default function OrderComplete({ total }) {
  if (total === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full">
      <div className="bg-white w-full p-2 flex items-center justify-between shadow-lg">
        <span className="flex items-center gap-1 text-bse">
          <IndianRupee size={20} strokeWidth={2.5} />
          {total.toFixed(2)}
        </span>
        <Button className="bg-primary text-white">Order Now</Button>
      </div>
    </div>
  );
}
