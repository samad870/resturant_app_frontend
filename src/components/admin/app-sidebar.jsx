import * as React from "react";
import {
  ScrollText,
  SquareMenu,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
} from "lucide-react";
import { NavMain } from "@/components/admin/nav-main";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/tapNOrder.webp";
import { useSidebar } from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Details",
      url: "#",
      icon: ScrollText,
      isActive: true,
      items: [
        { title: "Admin Profile", url: "/admin/restaurant-detail" },
        { title: "Update Profile", url: "/admin/profile-update" },
      ],
    },
    {
      title: "Order Management",
      url: "#",
      icon: ScrollText,
      isActive: true,
      items: [
        { title: "Order List", url: "/admin/pendingorder" },
        { title: "Completed Order", url: "/admin/completedorder" },
        { title: "Cancelled Order", url: "/admin/cancelledorder" },
      ],
    },
    {
      title: "Item Management",
      url: "#",
      icon: SquareMenu,
      isActive: true,
      items: [
        { title: "Add Item", url: "/admin/addItems" },
        { title: "Item List", url: "/admin/listItem" },
      ],
    },
    {
      title: "observability",
      url: "#",
      icon: SquareMenu,
      isActive: true,
      items: [
        { title: "sales", url: "#" },
        { title: "Revenue", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
};

export function AppSidebar({ ...props }) {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  // Auto close sidebar on route change (for mobile or small screens)
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      toggleSidebar(false);
    }
  }, [location.pathname, toggleSidebar]);

  return (
    <Sidebar
      className="overflow-y-auto !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="mt-9">
              <Link
                to="/admin"
                onClick={() => window.innerWidth < 1024 && toggleSidebar(false)}
              >
                <img src={logo} alt="Logo" className="h-12 w-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <NavMain
          items={data.navMain.map((section) => ({
            ...section,
            items: section.items.map((item) => ({
              ...item,
              onClick: () => window.innerWidth < 1024 && toggleSidebar(false),
            })),
          }))}
        />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
