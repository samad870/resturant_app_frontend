import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const iframeHeight = "800px";
export const description = "A sidebar with a header and a search form.";

export default function AdminHeader() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Outlet /> {/* Your routed content will appear here */}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
