import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchItem() {
  return (
    <>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search"
          className="bg-white rounded-2xl px-4 shadow-sm py-6 text-[16px] font-light pl-12"
        />
        <Search className="absolute left-3 top-2 w-fit h-8 text-gray-300 z-10" />
      </div>
    </>
  );
}
