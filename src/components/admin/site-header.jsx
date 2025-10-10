import { SidebarIcon } from "lucide-react";
import { SearchForm } from "@/components/admin/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background p-1">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        {/* Sidebar Toggle */}
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon />
        </Button>

        <Separator orientation="vertical" className="mr-2 h-4" />

        {/* Optional breadcrumb (currently hidden) */}
        {/* <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        {/* Search */}
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}
