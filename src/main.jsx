import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import "./index.css";
import AddItems from "./components/admin/AddItems";
import Admin from "./pages/Admin";
import AdminLayout from "./layouts/AdminLayout";
import Listitems from "./components/admin/ListItems.jsx";
import { Provider } from "react-redux";
import { store } from "./store";
import OrdersList from "./components/admin/order/OrdersList.jsx";
import Filter from "./components/Client/Filter";
import LoginPage from "./components/admin/LoginPage";
import PrivateRoute from "./components/admin/PrivateRoute";
import PendingOrders from "./components/admin/order/PendingOrders";
import CompletedOrders from "./components/admin/order/CompletedOrders";
import CancelledOrders from "./components/admin/order/CancelledOrders";
import Profile from "./components/admin/Profile/RestaurantForm";
import RestaurantForm from "./components/admin/Profile/RestaurantForm";
import UpdateProfile from "./components/admin/Profile/UpdateProfile";
import Adminprofile from "./components/admin/Profile/Adminprofile";
import Revenue from "./components/admin/observability/Revenue";
import ComingSoon from "./components/admin/common/ComingSoon";
import ErrorPage from "./components/admin/common/ErrorPage";
import AppTitle from "../AppTitle";
import CreateUserPage from "./components/superAdmin/Pages/CreateUserPage";
import SuperLoginPage from "./components/superAdmin/Pages/SuperLoginPage";
import UserListPage from "./components/superAdmin/Pages/UserListPage";
import AdminsList from "./components/superAdmin/details/User_List/AdminsList";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminProfile from "./components/superAdmin/Pages/SuperAdminProfile";

// Remove the duplicate SuperAdminLayout import and SuperAdminPrivateRoute
// Add this simple SuperAdminPrivateRoute component in this file
const SuperAdminPrivateRoute = ({ children }) => {
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppTitle />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="filter" element={<Filter />} />
        </Route>

        {/* Admin Login (Public) */}
        <Route path="login" element={<LoginPage />} />

        {/* Admin Protected Routes */}
        <Route
          path="admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="listItem" element={<Listitems />} />
          <Route path="addItems" element={<AddItems />} />
          <Route path="completedorder" element={<CompletedOrders />} />
          <Route path="pendingorder" element={<PendingOrders />} />
          <Route path="cancelledorder" element={<CancelledOrders />} />
          <Route path="restaurant-detail" element={<RestaurantForm />} />
          <Route path="profile-update" element={<UpdateProfile />} />
          <Route path="profile" element={<Adminprofile />} />
          <Route path="sales" element={<ComingSoon />} />
          <Route path="revenue" element={<Revenue />} />
        </Route>

        {/* Super Admin Login (Public) */}
        <Route path="super-login" element={<SuperLoginPage />} />

        {/* Super Admin Protected Routes */}
        <Route
          path="super-admin"
          element={
            <SuperAdminPrivateRoute>
              <SuperAdminLayout />
            </SuperAdminPrivateRoute>
          }
        >
          <Route index element={<CreateUserPage />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="user-list" element={<UserListPage />} />
          <Route path="admins" element={<AdminsList />} />
          <Route path="profile" element={<SuperAdminProfile />} />

        </Route>

        {/* 404 Error */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);