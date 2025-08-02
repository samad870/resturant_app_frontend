
import AdminLayout from "@/layouts/AdminLayout";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddItems from "@/components/admin/AddItems";
// import Admin from "./Admin";
import AppSidebar from "../components/admin/app-sidebar"

export default function AdminHome() {
  return (
      
      <>
      <AdminLayout/>
      <AppSidebar/>
      </>
  );
}
