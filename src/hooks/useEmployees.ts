"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

export type Rating = {
  id: number;
  rating: number; // 1-5
  comment: string;
  author: string;
  date: string; // YYYY-MM-DD
};

export type Employee = {
  id: number;
  name: string;
  title: string;
  department: string;
  skills: string[];
  image: string;
  notes?: string;
  ratings: Rating[];
};

const STORAGE_KEY = "employees";

const seedEmployees: Employee[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    department: "Engineering",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=200&h=200&fit=crop&crop=face",
    ratings: [
      { id: 1, rating: 5, comment: "Great collaborator.", author: "Michael Chen", date: "2024-01-15" },
      { id: 2, rating: 4, comment: "Very knowledgeable.", author: "Emily Rodriguez", date: "2024-01-10" },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Product Manager",
    department: "Product",
    skills: ["Roadmapping", "Communication", "Analytics", "Figma"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    ratings: [
      { id: 1, rating: 5, comment: "Clear direction and focus.", author: "Sarah Johnson", date: "2024-01-12" },
    ],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "UX Designer",
    department: "Design",
    skills: ["UX Research", "Wireframing", "Prototyping", "Accessibility"],
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    ratings: [
      { id: 1, rating: 5, comment: "Beautiful designs.", author: "David Kim", date: "2024-01-18" },
    ],
  },
  {
    id: 4,
    name: "David Kim",
    title: "DevOps Engineer",
    department: "Engineering",
    skills: ["Kubernetes", "CI/CD", "Terraform", "AWS"],
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    ratings: [],
  },
  {
    id: 5,
    name: "Lisa Thompson",
    title: "Marketing Manager",
    department: "Marketing",
    skills: ["SEO", "Content", "Email Marketing", "Branding"],
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
    ratings: [],
  },
  {
    id: 6,
    name: "James Wilson",
    title: "Sales Director",
    department: "Sales",
    skills: ["Negotiation", "CRM", "Prospecting", "Leadership"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    ratings: [],
  },
];

function readStorage(): Employee[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Employee[];
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function writeStorage(data: Employee[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useEmployees() {
  // Initialize synchronously to avoid flicker/loading fallback after first render
  const [employees, setEmployees] = useState<Employee[]>(() => {
    // During SSR or very first client tick before localStorage, fall back to seed
    const existing = readStorage();
    if (existing && existing.length) return existing;
    // Seed storage once if empty
    if (typeof window !== "undefined") writeStorage(seedEmployees);
    return seedEmployees;
  });

  // Ensure storage is initialized (no state reset to avoid UI flicker)
  useEffect(() => {
    const existing = readStorage();
    if (!existing || !existing.length) {
      writeStorage(seedEmployees);
    }
  }, []);

  const addEmployee = useCallback((emp: Omit<Employee, "id">) => {
    setEmployees((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
      const newEmp: Employee = { ...emp, id: nextId } as Employee;
      const updated = [...prev, newEmp];
      writeStorage(updated);
      return updated;
    });
  }, []);

  const updateEmployee = useCallback((id: number, patch: Partial<Employee>) => {
    setEmployees((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      writeStorage(updated);
      return updated;
    });
  }, []);

  const addRating = useCallback((employeeId: number, data: Omit<Rating, "id">) => {
    setEmployees((prev) => {
      const updated = prev.map((e) => {
        if (e.id !== employeeId) return e;
        const nextId = e.ratings.length ? Math.max(...e.ratings.map((r) => r.id)) + 1 : 1;
        return { ...e, ratings: [...e.ratings, { ...data, id: nextId }] };
      });
      writeStorage(updated);
      return updated;
    });
  }, []);

  const byId = useCallback((id: number) => employees.find((e) => e.id === id), [employees]);

  const withAverages = useMemo(() => {
    return employees.map((e) => {
      const avg = e.ratings.length ? e.ratings.reduce((s, r) => s + r.rating, 0) / e.ratings.length : 0;
      return { ...e, averageRating: Number(avg.toFixed(1)) } as Employee & { averageRating: number };
    });
  }, [employees]);

  return { employees, withAverages, addEmployee, updateEmployee, addRating, byId };
}