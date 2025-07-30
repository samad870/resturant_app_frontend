import { Link, Outlet } from "react-router-dom";
import Header from "@/components/Client/Header";

export default function AdminLayout() {
  return (
    <div className="max-w-[1400px] mx-auto bg-gray-50 min-h-screen font-mostrate font-semibold">
      <Header />
      <main className="px-4">
        <Outlet /> {/* <-- Renders child route here */}
      </main>
    </div>
  );
}
