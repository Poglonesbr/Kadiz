export const roleValues = [
  "super_admin",
  "admin_institucional",
  "gestor",
  "profissional_tecnico",
  "professor_monitor",
  "financeiro",
  "voluntario",
] as const;

export type UserRole = (typeof roleValues)[number];

export const moduleValues = [
  "dashboard",
  "people",
  "projects",
  "activities",
  "reports",
  "settings",
] as const;

export type PlatformModule = (typeof moduleValues)[number];

export type Organization = {
  id: string;
  name: string;
  cnpj: string;
  modulesEnabled: PlatformModule[];
};

export type Person = {
  id: string;
  organizationId: string;
  fullName: string;
  status: "ativo" | "inativo";
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
};

export type Project = {
  id: string;
  organizationId: string;
  name: string;
  status: "planejado" | "andamento" | "concluido";
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
};

export type Activity = {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  projectId?: string;
  startAt: string;
  endAt: string;
  responsible: string;
  local: string;
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
};
