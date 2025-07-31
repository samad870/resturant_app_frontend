import AdminLayout from "@/layouts/AdminLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddItems from "@/components/admin/AddItems";

export default function Home() {
  return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="additems" element={<AddItems />} />
        </Route>
      </Routes>
  );
}
