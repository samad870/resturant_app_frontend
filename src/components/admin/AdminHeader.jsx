import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


export default function AdminHeader() {
  return (
    <div>  
    
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col">
              <Outlet /> {/* Your routed content will appear here */}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
