"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

export type Employer = {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  website?: string;
  address?: string;
  description?: string;
  logo?: string;
  createdAt: string;
};

const STORAGE_KEY = "employers";

const seedEmployers: Employer[] = [
  {
    id: 1,
    companyName: "TechCorp Solutions",
    contactPerson: "Анна Петрова",
    email: "anna.petrova@techcorp.ru",
    phone: "+7 (495) 123-45-67",
    industry: "Информационные технологии",
    website: "https://techcorp.ru",
    address: "г. Москва, ул. Тверская, 15",
    description: "Ведущая IT-компания, специализирующаяся на разработке корпоративных решений и веб-приложений.",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&fit=crop",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    companyName: "Digital Marketing Pro",
    contactPerson: "Сергей Иванов",
    email: "sergey@digitalmarketing.pro",
    phone: "+7 (812) 987-65-43",
    industry: "Маркетинг и реклама",
    website: "https://digitalmarketing.pro",
    address: "г. Санкт-Петербург, Невский пр., 28",
    description: "Агентство цифрового маркетинга с 10-летним опытом работы на рынке.",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&h=200&fit=crop",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    companyName: "FinanceHub",
    contactPerson: "Мария Смирнова",
    email: "maria@financehub.ru",
    phone: "+7 (495) 555-12-34",
    industry: "Финансовые услуги",
    website: "https://financehub.ru",
    address: "г. Москва, Кутузовский пр., 36",
    description: "Консалтинговая компания в области финансов и инвестиций.",
    logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop",
    createdAt: "2024-01-10",
  },
];

function readStorage(): Employer[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Employer[];
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeStorage(data: Employer[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useEmployers() {
  // Initialize synchronously to avoid flicker/loading fallback after first render
  const [employers, setEmployers] = useState<Employer[]>(() => {
    // During SSR or very first client tick before localStorage, fall back to seed
    const existing = readStorage();
    if (existing && existing.length) return existing;
    // Seed storage once if empty
    if (typeof window !== "undefined") writeStorage(seedEmployers);
    return seedEmployers;
  });

  // Ensure storage is initialized (no state reset to avoid UI flicker)
  useEffect(() => {
    const existing = readStorage();
    if (!existing || !existing.length) {
      writeStorage(seedEmployers);
    }
  }, []);

  const addEmployer = useCallback((emp: Omit<Employer, "id" | "createdAt">) => {
    setEmployers((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
      const newEmp: Employer = { 
        ...emp, 
        id: nextId,
        createdAt: new Date().toISOString().slice(0, 10)
      } as Employer;
      const updated = [...prev, newEmp];
      writeStorage(updated);
      return updated;
    });
  }, []);

  const updateEmployer = useCallback((id: number, patch: Partial<Employer>) => {
    setEmployers((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      writeStorage(updated);
      return updated;
    });
  }, []);

  const deleteEmployer = useCallback((id: number) => {
    setEmployers((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      writeStorage(updated);
      return updated;
    });
  }, []);

  const byId = useCallback((id: number) => employers.find((e) => e.id === id), [employers]);

  // Sort by newest first (by ID descending, since higher ID = created later)
  const sortedEmployers = useMemo(() => {
    return [...employers].sort((a, b) => b.id - a.id);
  }, [employers]);

  return { 
    employers: sortedEmployers, 
    addEmployer, 
    updateEmployer, 
    deleteEmployer, 
    byId 
  };
}
