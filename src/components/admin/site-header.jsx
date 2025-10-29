import { PanelRightClose, SidebarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import NotificationBell from "./Filter/NotificationBell";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background p-1">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <PanelRightClose
          size={30}
          onClick={toggleSidebar}
          className="cursor-pointer"
        />
        <Separator orientation="vertical" />
        <div className="w-full flex  justify-end  sm:ml-auto sm:w-auto">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
