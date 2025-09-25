"use client";

import { useEmployers } from "./useEmployers";
import { useActivity } from "./useActivity";
import { useCallback } from "react";
import type { Employer } from "./useEmployers";

export function useEmployersWithActivity() {
  const { employers, addEmployer, updateEmployer, deleteEmployer, byId } = useEmployers();
  const { logActivity } = useActivity();

  const addEmployerWithLogging = useCallback(
    (emp: Omit<Employer, "id" | "createdAt">) => {
      addEmployer(emp);
      
      // Log the activity
      logActivity({
        type: "employer_added",
        user: "Менеджер HR",
        description: "Добавил нового работодателя",
        targetName: emp.companyName,
      });
    },
    [addEmployer, logActivity]
  );

  const updateEmployerWithLogging = useCallback(
    (id: number, patch: Partial<Employer>) => {
      const employer = byId(id);
      updateEmployer(id, patch);

      if (employer) {
        logActivity({
          type: "employer_updated",
          user: "Менеджер HR",
          description: "Обновил информацию о работодателе",
          targetId: id,
          targetName: employer.companyName,
        });
      }
    },
    [updateEmployer, byId, logActivity]
  );

  return {
    employers,
    addEmployer: addEmployerWithLogging,
    updateEmployer: updateEmployerWithLogging,
    deleteEmployer, // Keep original without logging for now
    byId,
  };
}
