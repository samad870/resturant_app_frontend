import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import SuperAdmin from "./pages/SuperAdmin";
import "./index.css";
// import AddItems from "./components/admin/Menu/AddItems.jsx";
import Admin from "./pages/Admin";
import AdminLayout from "./layouts/AdminLayout";
import Menu from "./components/admin/Menu/Menu.jsx";
import { Provider } from "react-redux";
import { store } from "./store";
import OrdersList from "./components/admin/order/OrdersList.jsx";
import Filter from "./components/Client/Filter";
import LoginPage from "./components/admin/LoginPage";
import PrivateRoute from "./components/admin/PrivateRoute";
import Orders from "./components/admin/order/Orders";
import CompletedOrders from "./components/admin/order/CompletedOrders";
import CancelledOrders from "./components/admin/order/CancelledOrders";
// import Profile from "./components/admin/Profile/Profile";
// import RestaurantForm from "./components/admin/Profile/RestaurantForm";
// import UpdateProfile from "./components/admin/Profile/UpdateProfile";
import Adminprofile from "./components/admin/Profile/Profile";
import Revenue from "./components/admin/observability/Revenue";
import ComingSoon from "./components/admin/common/ComingSoon";
import ErrorPage from "./components/admin/common/ErrorPage";
import AppTitle from "../AppTitle";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
     <AppTitle />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="filter" element={<Filter />} />
        </Route>

        <Route
          path="admin"
          element={
            <PrivateRoute>
              {" "}
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="menu" element={<Menu />} />
          {/* <Route path="addItems" element={<AddItems />} /> */}
          {/* <Route path="orderlist" element={<OrdersList />} /> */}
          <Route path="completedorder" element={<CompletedOrders />} />
          <Route path="orders" element={<Orders />} />
          <Route path="cancelledorder" element={<CancelledOrders />} />
          {/* <Route path="restaurant-detail" element={<RestaurantForm />} /> */}
          {/* <Route path="update-profile" element={<UpdateProfile />} /> */}
          <Route path="profile" element={<Adminprofile />} />
          {/* <Route path="revenue" element={<Revenue />} /> */}
          <Route path="sales" element={<ComingSoon />} />
          <Route path="revenue" element={<Revenue />} />

        </Route>

        <Route path="super-admin" element={<SuperAdmin />} />

        {/* Login is public */}
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
