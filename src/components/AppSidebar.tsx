"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Users, Building2, FileText, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    id: "home",
    title: "Главная",
    icon: Home,
    href: "/home",
  },
  {
    id: "candidates",
    title: "Соискатели",
    icon: Users,
    href: "/dashboard",
  },
  {
    id: "employers", 
    title: "Работодатели",
    icon: Building2,
    href: "/employers",
  },
  {
    id: "tests",
    title: "Тесты",
    icon: FileText,
    href: "/tests", 
  },
];

interface AppSidebarProps {
  activeSection?: string;
}

export function AppSidebar({ activeSection }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active section based on current path if not explicitly provided
  const getCurrentSection = () => {
    if (activeSection) return activeSection;
    
    if (pathname.startsWith("/home")) return "home";
    if (pathname.startsWith("/employers")) return "employers";
    if (pathname.startsWith("/tests")) return "tests";
    if (pathname.startsWith("/dashboard")) return "candidates";
    return "home"; // default for root and other paths
  };

  const currentSection = getCurrentSection();

  const handleItemClick = (item: typeof navigationItems[0]) => {
    router.push(item.href);
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">ER</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">Employee Ratings</span>
            <span className="text-xs text-muted-foreground">Управление персоналом</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="p-2">
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={currentSection === item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full justify-start gap-3 h-10 px-3",
                    currentSection === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {currentSection === item.id && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
