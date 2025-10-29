import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchItem({ search, onSearch }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔍 Floating Search Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-40 right-6 z-20 bg-gradient-to-r from-primary to-primary p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 text-white"
      >
        <Search size={22} />
      </button>

      {/* 🔽 Animated Search Bar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* Search Bar Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 15,
                duration: 0.25,
              }}
              className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-2xl p-4 z-50 rounded-t-xl"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search something..."
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full rounded-3xl pl-11 pr-10 py-4 bg-white border border-gray-300 text-gray-700 placeholder-gray-400 shadow-sm outline-none transition-all duration-200 border-none"
                />
                <X
                  className="absolute right-4 text-gray-500 hover:text-red-500 cursor-pointer transition"
                  size={20}
                  onClick={() => setOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
