"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { SuperAdminSidebar } from "@/components/superAdmin/sidebar/superAdminSidebar";
import { SiteHeader } from "@/components/superAdmin/sidebar/siteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import { logoutSuperAdmin } from "@/redux/superAdminRedux/superAdminSlice";

export default function SuperAdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    // 🔍 Check if user is authenticated
    if (!user || !token) {
      navigate("/super-login");
      return;
    }

    // 🔒 Ensure only superadmin can access
    if (user.role !== "superadmin") {
      dispatch(logoutSuperAdmin());
      navigate("/super-login");
    }
  }, [user, token, dispatch, navigate]);

  // ⚙️ Show loader while checking auth
  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 [--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <SuperAdminSidebar />
          <SidebarInset>
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
