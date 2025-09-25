"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useActivity, formatRelativeTime, getActivityDisplayInfo } from "@/hooks/useActivity";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function HomePage() {
  const router = useRouter();
  const { recentActivities } = useActivity();

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
              <h1 className="text-lg font-semibold md:text-xl">Главная</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/40">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Page Title */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Последние действия</h2>
                <p className="text-muted-foreground">
                  Отслеживайте активность пользователей в системе управления персоналом
                </p>
              </div>

              {/* Activities List */}
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Нет активности
                      </h3>
                      <p className="text-muted-foreground">
                        Пока нет записей о действиях пользователей в системе.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  recentActivities.map((activity) => {
                    const displayInfo = getActivityDisplayInfo(activity);
                    return (
                      <Card key={activity.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Activity Icon/Avatar */}
                            <div className="flex-shrink-0">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className={displayInfo.colorClass}>
                                  <span className="text-lg">{displayInfo.icon}</span>
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            {/* Activity Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-foreground">
                                      {activity.user}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {activity.description.toLowerCase()}
                                    </span>
                                    {activity.targetName && (
                                      <Badge variant="outline" className="text-xs">
                                        {activity.targetName}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {activity.details && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {activity.details}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{formatRelativeTime(activity.timestamp)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>{activity.createdAt}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Mobile responsive: timestamp on separate line */}
                                <div className="hidden sm:block flex-shrink-0">
                                  <span className="text-xs text-muted-foreground">
                                    {formatRelativeTime(activity.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Load more section (for future implementation) */}
              {recentActivities.length >= 50 && (
                <div className="text-center mt-8">
                  <Button variant="outline" disabled>
                    Загрузить больше активности...
                  </Button>
                </div>
              )}

              {/* Statistics section */}
              {recentActivities.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Статистика активности
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recentActivities.filter(a => a.type.includes('employee')).length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Действия с сотрудниками
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recentActivities.filter(a => a.type.includes('employer')).length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Действия с работодателями
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recentActivities.filter(a => a.type.includes('test')).length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Действия с тестами
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {recentActivities.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Всего действий
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
