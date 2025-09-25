"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/StarRating";
import { useEmployees } from "@/hooks/useEmployees";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Mock employee data
const employees = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    department: "Engineering",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Product Manager",
    department: "Product",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "UX Designer",
    department: "Design",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Kim",
    title: "DevOps Engineer",
    department: "Engineering",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    title: "Marketing Manager",
    department: "Marketing",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Sales Director",
    department: "Sales",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
  }
];

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { withAverages } = useEmployees();

  // Sort employees by ID descending (newest first), then filter
  const filteredEmployees = withAverages
    .sort((a, b) => b.id - a.id) // Sort by newest first
    .filter((employee) => {
      const q = searchTerm.toLowerCase();
      return (
        employee.name.toLowerCase().includes(q) ||
        employee.title.toLowerCase().includes(q) ||
        employee.department.toLowerCase().includes(q) ||
        employee.skills.some((s) => s.toLowerCase().includes(q))
      );
    });

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2 flex-1">
              <div className="md:hidden w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">ER</span>
              </div>
              <h1 className="text-lg font-semibold md:text-xl">Соискатели</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/40">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Search and Add Employee */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Поиск по имени, должности, отделу или навыкам..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button
                  onClick={() => router.push("/employees/add")}
                  className="flex items-center gap-2 h-12"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Добавить сотрудника</span>
                  <span className="sm:hidden">Добавить</span>
                </Button>
              </div>

              {/* Employee Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group bg-card"
                    onClick={() => router.push(`/employees/${employee.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={employee.image}
                          alt={employee.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                            {employee.name}
                          </h3>
                          <p className="text-muted-foreground">{employee.title}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">
                            {employee.department}
                          </Badge>
                          {/* Skills on main page */}
                          {employee.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {employee.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{employee.skills.length - 3}</Badge>
                          )}
                        </div>

                        <StarRating rating={(employee as any).averageRating || 0} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Сотрудники не найдены по вашему запросу.</p>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}