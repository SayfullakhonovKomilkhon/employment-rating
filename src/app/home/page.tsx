"use client";

import { Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useActivity, formatRelativeTime, getActivityDisplayInfo } from "@/hooks/useActivity";
import { AppLayout } from "@/components/AppLayout";

export default function HomePage() {
  const { recentActivities } = useActivity();

  return (
    <AppLayout pageTitle="Главная" activeSection="home">
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
    </AppLayout>
  );
}
