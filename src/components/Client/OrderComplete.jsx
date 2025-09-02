import { Button } from "@/components/ui/button";
import { IndianRupee } from "lucide-react";

export default function OrderComplete({
  amount,
  buttonText,
  onClick,
  disabled,
}) {
  return (
    <div className="fixed bottom-0 left-0 w-full">
      <div className="bg-white w-full p-2 flex items-center justify-between shadow-lg">
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
  );
}
