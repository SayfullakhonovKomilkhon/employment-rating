"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

export type Test = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "Легкий" | "Средний" | "Сложный";
  duration: number; // in minutes
  questionsCount: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
};

const STORAGE_KEY = "tests";

const seedTests: Test[] = [
  {
    id: 1,
    title: "JavaScript для начинающих",
    description: "Базовый тест на знание основ JavaScript, включающий вопросы по синтаксису, функциям, объектам и DOM.",
    category: "Программирование",
    difficulty: "Легкий",
    duration: 30,
    questionsCount: 15,
    tags: ["JavaScript", "Frontend", "Базовые навыки"],
    isActive: true,
    createdAt: "2024-01-20",
  },
  {
    id: 2,
    title: "React и современная разработка",
    description: "Углубленный тест на знание React, включая хуки, компоненты, состояние и современные паттерны разработки.",
    category: "Программирование",
    difficulty: "Средний",
    duration: 45,
    questionsCount: 25,
    tags: ["React", "Frontend", "Компоненты", "Хуки"],
    isActive: true,
    createdAt: "2024-01-18",
  },
  {
    id: 3,
    title: "Основы маркетинга",
    description: "Тест на знание основ маркетинга, включая стратегии продвижения, анализ целевой аудитории и планирование кампаний.",
    category: "Маркетинг",
    difficulty: "Легкий",
    duration: 25,
    questionsCount: 12,
    tags: ["Маркетинг", "Стратегия", "Анализ"],
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    title: "UX/UI Дизайн: принципы и практика",
    description: "Комплексный тест на знание принципов пользовательского опыта и интерфейсного дизайна.",
    category: "Дизайн",
    difficulty: "Средний",
    duration: 40,
    questionsCount: 20,
    tags: ["UX", "UI", "Дизайн", "Пользовательский опыт"],
    isActive: true,
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    title: "Продвинутые алгоритмы",
    description: "Сложный тест для опытных разработчиков на знание алгоритмов и структур данных.",
    category: "Программирование",
    difficulty: "Сложный",
    duration: 60,
    questionsCount: 30,
    tags: ["Алгоритмы", "Структуры данных", "Backend", "Оптимизация"],
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: 6,
    title: "Финансовая грамотность",
    description: "Тест на знание основ финансов, бюджетирования и инвестиций для всех сотрудников.",
    category: "Финансы",
    difficulty: "Легкий",
    duration: 20,
    questionsCount: 10,
    tags: ["Финансы", "Бюджет", "Инвестиции"],
    isActive: false,
    createdAt: "2024-01-08",
  },
];

function readStorage(): Test[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Test[];
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeStorage(data: Test[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useTests() {
  // Initialize synchronously to avoid flicker/loading fallback after first render
  const [tests, setTests] = useState<Test[]>(() => {
    // During SSR or very first client tick before localStorage, fall back to seed
    const existing = readStorage();
    if (existing && existing.length) return existing;
    // Seed storage once if empty
    if (typeof window !== "undefined") writeStorage(seedTests);
    return seedTests;
  });

  // Ensure storage is initialized (no state reset to avoid UI flicker)
  useEffect(() => {
    const existing = readStorage();
    if (!existing || !existing.length) {
      writeStorage(seedTests);
    }
  }, []);

  const addTest = useCallback((test: Omit<Test, "id" | "createdAt">) => {
    setTests((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      const newTest: Test = { 
        ...test, 
        id: nextId,
        createdAt: new Date().toISOString().slice(0, 10)
      } as Test;
      const updated = [...prev, newTest];
      writeStorage(updated);
      return updated;
    });
  }, []);

  const updateTest = useCallback((id: number, patch: Partial<Test>) => {
    setTests((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
      writeStorage(updated);
      return updated;
    });
  }, []);

  const deleteTest = useCallback((id: number) => {
    setTests((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      writeStorage(updated);
      return updated;
    });
  }, []);

  const byId = useCallback((id: number) => tests.find((t) => t.id === id), [tests]);

  // Sort by newest first (by ID descending, since higher ID = created later)
  const sortedTests = useMemo(() => {
    return [...tests].sort((a, b) => b.id - a.id);
  }, [tests]);

  // Filter only active tests
  const activeTests = useMemo(() => {
    return sortedTests.filter(test => test.isActive);
  }, [sortedTests]);

  return { 
    tests: sortedTests,
    activeTests, 
    addTest, 
    updateTest, 
    deleteTest, 
    byId 
  };
}
