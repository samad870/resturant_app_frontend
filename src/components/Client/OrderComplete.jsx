import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

export default function OrderComplete({
  amount,
  buttonText,
  onClick,
  disabled,
}) {
  return (
    <div>
      <div className="w-full p-2 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-base">
            <IndianRupee />
            {amount.toLocaleString("en-IN")}
          </span>
          <Button
            className="bg-primary text-white"
            onClick={onClick}
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
