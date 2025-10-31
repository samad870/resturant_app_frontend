import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="max-w-[500px] mx-auto bg-gray-50 min-h-screen font-mostrate font-semibold">
      <main>
        <Outlet /> {/* Renders child route here */}
      </main>
    </div>
  );
}
