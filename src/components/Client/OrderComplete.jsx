import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

export default function OrderComplete({
  // amount,
  buttonText,
  onClick,
  disabled,
}) {
  return (
    <div>
      <div className="w-full p-2">
        <div className="flex items-center justify-between">
      
          <Button
            className="bg-primary text-white runded-full"
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
