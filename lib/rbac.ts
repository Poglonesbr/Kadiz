import type { PlatformModule, UserRole } from "@/lib/types";

export const roleModuleAccess: Record<UserRole, PlatformModule[]> = {
  super_admin: ["dashboard", "people", "projects", "activities", "reports", "settings"],
  admin_institucional: ["dashboard", "people", "projects", "activities", "reports", "settings"],
  gestor: ["dashboard", "people", "projects", "activities", "reports"],
  profissional_tecnico: ["dashboard", "people", "projects", "activities", "reports"],
  professor_monitor: ["dashboard", "people", "activities", "reports"],
  financeiro: ["dashboard", "reports"],
  voluntario: ["dashboard", "activities"],
};

export function canAccessModule(role: UserRole, moduleKey: PlatformModule): boolean {
  return roleModuleAccess[role].includes(moduleKey);
}

export function assertModuleAccess(role: UserRole, moduleKey: PlatformModule): void {
  if (!canAccessModule(role, moduleKey)) {
    throw new Error("Acesso negado para o perfil informado.");
  }
}
