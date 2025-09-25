"use client";

import { useEmployees } from "./useEmployees";
import { useActivity } from "./useActivity";
import { useCallback } from "react";
import type { Employee, Rating } from "./useEmployees";

export function useEmployeesWithActivity() {
  const { employees, withAverages, addEmployee, updateEmployee, addRating, byId } = useEmployees();
  const { logActivity } = useActivity();

  const addEmployeeWithLogging = useCallback(
    (emp: Omit<Employee, "id">) => {
      addEmployee(emp);
      
      // Log the activity
      logActivity({
        type: "employee_added",
        user: "Администратор",
        description: "Добавил нового сотрудника",
        targetName: emp.name,
      });
    },
    [addEmployee, logActivity]
  );

  const updateEmployeeWithLogging = useCallback(
    (id: number, patch: Partial<Employee>) => {
      const employee = byId(id);
      updateEmployee(id, patch);

      if (employee) {
        logActivity({
          type: "employee_updated",
          user: "Администратор",
          description: "Обновил информацию о сотруднике",
          targetId: id,
          targetName: employee.name,
        });
      }
    },
    [updateEmployee, byId, logActivity]
  );

  const addRatingWithLogging = useCallback(
    (employeeId: number, data: Omit<Rating, "id">) => {
      const employee = byId(employeeId);
      addRating(employeeId, data);

      if (employee) {
        logActivity({
          type: "employee_rated",
          user: data.author,
          description: "Оценил сотрудника",
          targetId: employeeId,
          targetName: employee.name,
          details: `Рейтинг: ${data.rating} звезд`,
        });
      }
    },
    [addRating, byId, logActivity]
  );

  return {
    employees,
    withAverages,
    addEmployee: addEmployeeWithLogging,
    updateEmployee: updateEmployeeWithLogging,
    addRating: addRatingWithLogging,
    byId,
  };
}
