import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      {/* <header className="bg-gray-100 p-4">
        <nav className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/admin">admin</Link>
          <Link to="/super-admin">SuperAdmin</Link>
        </nav>
      </header> */}

      <main className="max-w-[600px] mx-auto bg-gray-100 min-h-screen">
        <Outlet /> {/* <-- Renders child route here */}
      <footer className="bg-gray-100 p-4 text-center">© 2025 Tap N Order</footer>
      </main>

    </div>
  );
}
