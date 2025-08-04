import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
// import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
// import Admin from "./pages/Admin";
import "./index.css";
import AddItems from "./components/admin/AddItems";
import Admin from "./pages/Admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="admin" element={<Admin />}>
        </Route>
        <Route path="super-admin" element={<SuperAdmin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
