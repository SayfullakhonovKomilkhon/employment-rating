"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Users, Building2, FileText, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  activeSection?: string;
}

export function AppLayout({ children, pageTitle, activeSection }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine active section based on current path if not explicitly provided
  const getCurrentSection = () => {
    if (activeSection) return activeSection;
    
    if (pathname.startsWith("/home")) return "home";
    if (pathname.startsWith("/employers")) return "employers";
    if (pathname.startsWith("/tests")) return "tests";
    if (pathname.startsWith("/dashboard")) return "candidates";
    return "home"; // default
  };

  const currentSection = getCurrentSection();

  const handleItemClick = (item: typeof navigationItems[0]) => {
    router.push(item.href);
    setSidebarOpen(false); // Close mobile sidebar after navigation
  };

  const handleLogout = () => {
    router.push("/login");
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [sidebarOpen]);

  // Prevent scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Desktop Sidebar - Fixed Width */}
        <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border">
          <div className="flex flex-col h-full overflow-y-auto sidebar-scroll">
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-sidebar-border bg-sidebar">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-foreground">ER</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-sidebar-foreground truncate">Employee Ratings</span>
                <span className="text-xs text-sidebar-foreground/70 truncate">Управление персоналом</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-sidebar-ring",
                        currentSection === item.id 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                          : "text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.title}</span>
                      {currentSection === item.id && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Desktop Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="flex-shrink-0 bg-background border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center gap-4">
                {/* Page Title */}
                <h1 className="text-lg font-semibold text-foreground md:text-xl">
                  {pageTitle}
                </h1>
              </div>

              {/* Logout Button */}
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/40">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full flex flex-col">
        {/* Mobile Header */}
        <header className="flex-shrink-0 bg-background border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Menu className="w-4 h-4" />
                <span className="sr-only">Открыть меню</span>
              </Button>
              
              {/* Mobile Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">ER</span>
                </div>
              </div>
              
              {/* Page Title */}
              <h1 className="text-lg font-semibold text-foreground">
                {pageTitle}
              </h1>
            </div>

            {/* Logout Button */}
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-auto bg-muted/40">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        >
          <aside 
            className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out z-50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full overflow-y-auto sidebar-scroll">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border bg-sidebar">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">ER</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-sidebar-foreground">Employee Ratings</span>
                    <span className="text-xs text-sidebar-foreground/70">Управление персоналом</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-3 py-4">
                <ul className="space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-sidebar-ring",
                          currentSection === item.id 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                            : "text-sidebar-foreground"
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-left">{item.title}</span>
                        {currentSection === item.id && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
