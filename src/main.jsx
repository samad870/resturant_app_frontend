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
// import Listitem from "./components/admin/Listitems";
// import Listitem from "./components/admin/ListItems.jsx";
import AdminLayout from "./layouts/AdminLayout";
import Listitems from "./components/admin/ListItems.jsx";
import { Provider } from "react-redux";
import { store } from "./store";
// import OrderList from "./components/admin/OrdersList";
import OrdersList from "./components/admin/OrdersList";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="listItem" element={<Listitems />} />
          <Route path="addItems" element={<AddItems />} />
          <Route path="orderlist" element={<OrdersList />} />
        </Route>

        <Route path="super-admin" element={<SuperAdmin />} />
      </Routes>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
