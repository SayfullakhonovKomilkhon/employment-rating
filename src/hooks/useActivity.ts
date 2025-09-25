"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

export type ActivityType = 
  | "employee_added" 
  | "employee_updated" 
  | "employee_rated"
  | "employer_added" 
  | "employer_updated"
  | "test_started" 
  | "test_completed"
  | "user_login";

export type ActivityAction = {
  id: number;
  type: ActivityType;
  user: string;
  description: string;
  details?: string;
  targetId?: number;
  targetName?: string;
  timestamp: string;
  createdAt: string;
};

const STORAGE_KEY = "user_activities";

const seedActivities: ActivityAction[] = [
  {
    id: 1,
    type: "employee_added",
    user: "Администратор",
    description: "Добавил нового сотрудника",
    targetId: 1,
    targetName: "Sarah Johnson",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString().slice(0, 10),
  },
  {
    id: 2,
    type: "employer_added", 
    user: "Менеджер HR",
    description: "Добавил нового работодателя",
    targetId: 1,
    targetName: "TechCorp Solutions",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString().slice(0, 10),
  },
  {
    id: 3,
    type: "test_completed",
    user: "Иван Петров",
    description: "Завершил тест",
    targetName: "JavaScript для начинающих",
    details: "Результат: 85%",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString().slice(0, 10),
  },
  {
    id: 4,
    type: "employee_rated",
    user: "Мария Смирнова",
    description: "Оценил сотрудника",
    targetId: 2,
    targetName: "Michael Chen", 
    details: "Рейтинг: 5 звезд",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString().slice(0, 10),
  },
  {
    id: 5,
    type: "test_started",
    user: "Анна Козлова", 
    description: "Начал прохождение теста",
    targetName: "React и современная разработка",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString().slice(0, 10),
  },
  {
    id: 6,
    type: "user_login",
    user: "Системный администратор",
    description: "Вошел в систему",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString().slice(0, 10),
  },
];

// Helper function to get activity display info
export const getActivityDisplayInfo = (activity: ActivityAction) => {
  const icons = {
    employee_added: "👤",
    employee_updated: "✏️",
    employee_rated: "⭐",
    employer_added: "🏢",
    employer_updated: "🏢",
    test_started: "📝",
    test_completed: "✅",
    user_login: "🔐",
  };

  const colors = {
    employee_added: "bg-blue-50 text-blue-700 border-blue-200",
    employee_updated: "bg-yellow-50 text-yellow-700 border-yellow-200",
    employee_rated: "bg-orange-50 text-orange-700 border-orange-200",
    employer_added: "bg-purple-50 text-purple-700 border-purple-200",
    employer_updated: "bg-purple-50 text-purple-700 border-purple-200",
    test_started: "bg-indigo-50 text-indigo-700 border-indigo-200",
    test_completed: "bg-green-50 text-green-700 border-green-200",
    user_login: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return {
    icon: icons[activity.type],
    colorClass: colors[activity.type],
  };
};

// Helper function to format relative time
export const formatRelativeTime = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "только что";
  if (diffInMinutes < 60) return `${diffInMinutes} мин. назад`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ч. назад`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} дн. назад`;
  
  return time.toLocaleDateString('ru-RU');
};

function readStorage(): ActivityAction[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActivityAction[];
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeStorage(data: ActivityAction[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useActivity() {
  // Initialize synchronously to avoid flicker/loading fallback after first render
  const [activities, setActivities] = useState<ActivityAction[]>(() => {
    // During SSR or very first client tick before localStorage, fall back to seed
    const existing = readStorage();
    if (existing && existing.length) return existing;
    // Seed storage once if empty
    if (typeof window !== "undefined") writeStorage(seedActivities);
    return seedActivities;
  });

  // Ensure storage is initialized (no state reset to avoid UI flicker)
  useEffect(() => {
    const existing = readStorage();
    if (!existing || !existing.length) {
      writeStorage(seedActivities);
    }
  }, []);

  const logActivity = useCallback((activity: Omit<ActivityAction, "id" | "timestamp" | "createdAt">) => {
    setActivities((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((a) => a.id)) + 1 : 1;
      const now = new Date();
      const newActivity: ActivityAction = { 
        ...activity, 
        id: nextId,
        timestamp: now.toISOString(),
        createdAt: now.toISOString().slice(0, 10)
      };
      const updated = [newActivity, ...prev]; // Add to beginning for newest first
      writeStorage(updated);
      return updated;
    });
  }, []);

  const clearOldActivities = useCallback((daysOld: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    setActivities((prev) => {
      const filtered = prev.filter(activity => 
        new Date(activity.timestamp) > cutoffDate
      );
      writeStorage(filtered);
      return filtered;
    });
  }, []);

  // Sort by newest first (by timestamp descending)
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [activities]);

  // Get recent activities (last 50)
  const recentActivities = useMemo(() => {
    return sortedActivities.slice(0, 50);
  }, [sortedActivities]);

  return { 
    activities: sortedActivities,
    recentActivities,
    logActivity, 
    clearOldActivities 
  };
}
