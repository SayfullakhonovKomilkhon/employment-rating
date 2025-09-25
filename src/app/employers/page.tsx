"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, LogOut, Building2, Phone, Mail, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEmployers } from "@/hooks/useEmployers";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function EmployersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { employers } = useEmployers();

  // Sort employers by ID descending (newest first), then filter
  const filteredEmployers = employers
    .filter((employer) => {
      const q = searchTerm.toLowerCase();
      return (
        employer.companyName.toLowerCase().includes(q) ||
        employer.contactPerson.toLowerCase().includes(q) ||
        employer.industry.toLowerCase().includes(q) ||
        employer.email.toLowerCase().includes(q)
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
              <h1 className="text-lg font-semibold md:text-xl">Работодатели</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/40">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Search and Add Employer */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Поиск по названию компании, контактному лицу или отрасли..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button
                  onClick={() => router.push("/employers/add")}
                  className="flex items-center gap-2 h-12"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Добавить работодателя</span>
                  <span className="sm:hidden">Добавить</span>
                </Button>
              </div>

              {/* Employers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployers.map((employer) => (
                  <Card
                    key={employer.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer group bg-card"
                    onClick={() => router.push(`/employers/${employer.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        {employer.logo ? (
                          <img
                            src={employer.logo}
                            alt={employer.companyName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                            {employer.companyName}
                          </h3>
                          <p className="text-muted-foreground">{employer.contactPerson}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {employer.industry}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{employer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{employer.phone}</span>
                          </div>
                          {employer.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              <span className="truncate">{employer.website}</span>
                            </div>
                          )}
                          {employer.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span className="text-xs truncate">{employer.address}</span>
                            </div>
                          )}
                        </div>

                        {employer.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {employer.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEmployers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Работодатели не найдены по вашему запросу.</p>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
