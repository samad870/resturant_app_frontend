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

export function AppSidebar({ ...props }) {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  // Get user data from localStorage
  const userData = {
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "",
    avatar: localStorage.getItem("userAvatar") || ""
  };

  const data = {
    user: userData,
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
        title: "Observability",
        url: "#",
        icon: SquareMenu,
        isActive: true,
        items: [
          { title: "Sales", url: "#" },
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
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="h-12 w-auto" />
                  <div className="flex flex-col">
                    {/* <span className="font-bold text-lg text-gray-900">TapNOrder</span> */}
                    {/* <span className="text-xs text-gray-500">Admin Panel</span> */}
                  </div>
                </div>
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
        
        {/* Secondary Navigation */}
        {/* <SidebarMenu className="mt-8">
          <SidebarMenuItem>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
              Support
            </div>
            {data.navSecondary.map((item) => (
              <SidebarMenuButton key={item.title} asChild>
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenuItem>
        </SidebarMenu> */}

        {/* Projects Section */}
        {/* <SidebarMenu className="mt-8">
          <SidebarMenuItem>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
              Projects
            </div>
            {data.projects.map((project) => (
              <SidebarMenuButton key={project.name} asChild>
                <Link to={project.url}>
                  <project.icon className="h-4 w-4" />
                  <span>{project.name}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}