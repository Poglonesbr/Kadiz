import { z } from "zod";
import type { Activity, Organization, Person, Project } from "@/lib/types";

const organizations: Organization[] = [
  {
    id: "kadiz",
    name: "Associação Kadiz",
    cnpj: "12.345.678/0001-99",
    modulesEnabled: ["dashboard", "people", "projects", "activities", "reports", "settings"],
  },
  {
    id: "instituto-exemplo",
    name: "Instituto Exemplo",
    cnpj: "98.765.432/0001-55",
    modulesEnabled: ["dashboard", "people", "activities", "reports"],
  },
];

const people: Person[] = [
  {
    id: crypto.randomUUID(),
    organizationId: "kadiz",
    fullName: "Ana Souza",
    status: "ativo",
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: "seed",
  },
  {
    id: crypto.randomUUID(),
    organizationId: "instituto-exemplo",
    fullName: "Carlos Lima",
    status: "ativo",
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: "seed",
  },
];

const projects: Project[] = [
  {
    id: crypto.randomUUID(),
    organizationId: "kadiz",
    name: "Futuro em Campo",
    status: "andamento",
    startDate: "2026-01-15",
    endDate: "2026-12-20",
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: "seed",
  },
];

const activities: Activity[] = [
  {
    id: crypto.randomUUID(),
    organizationId: "kadiz",
    name: "Treino de Base Sub-13",
    category: "Esportiva",
    startAt: "2026-11-06T14:00",
    endAt: "2026-11-06T16:00",
    responsible: "Equipe Técnica",
    local: "Quadra A",
    participants: ["Ana Souza"],
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: "seed",
  },
];

const personSchema = z.object({
  fullName: z.string().trim().min(3, "Nome deve ter ao menos 3 caracteres."),
  status: z.enum(["ativo", "inativo"]),
});

const projectSchema = z.object({
  name: z.string().trim().min(3, "Nome do projeto deve ter ao menos 3 caracteres."),
  status: z.enum(["planejado", "andamento", "concluido"]),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
});

const activitySchema = z.object({
  name: z.string().trim().min(3),
  category: z.string().trim().min(2),
  projectId: z.string().optional(),
  startAt: z.string().min(10),
  endAt: z.string().min(10),
  responsible: z.string().trim().min(2),
  local: z.string().trim().min(2),
  participants: z.string().trim().optional(),
});

export function listOrganizations() {
  return organizations;
}

export function getOrganizationById(organizationId: string) {
  return organizations.find((org) => org.id === organizationId);
}

export function listPeople(organizationId: string) {
  return people.filter((person) => person.organizationId === organizationId);
}

export function createPerson(organizationId: string, input: unknown, actor: string) {
  const parsed = personSchema.parse(input);
  const record: Person = {
    id: crypto.randomUUID(),
    organizationId,
    fullName: parsed.fullName,
    status: parsed.status,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: actor,
  };
  people.push(record);
  return record;
}

export function listProjects(organizationId: string) {
  return projects.filter((project) => project.organizationId === organizationId);
}

export function createProject(organizationId: string, input: unknown, actor: string) {
  const parsed = projectSchema.parse(input);
  const record: Project = {
    id: crypto.randomUUID(),
    organizationId,
    name: parsed.name,
    status: parsed.status,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: actor,
  };
  projects.push(record);
  return record;
}

export function listActivities(organizationId: string) {
  return activities
    .filter((activity) => activity.organizationId === organizationId)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function createActivity(organizationId: string, input: unknown, actor: string) {
  const parsed = activitySchema.parse(input);
  const record: Activity = {
    id: crypto.randomUUID(),
    organizationId,
    name: parsed.name,
    category: parsed.category,
    projectId: parsed.projectId,
    startAt: parsed.startAt,
    endAt: parsed.endAt,
    responsible: parsed.responsible,
    local: parsed.local,
    participants: parsed.participants
      ? parsed.participants
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [],
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: actor,
  };
  activities.push(record);
  return record;
}

export function getDashboardMetrics(organizationId: string) {
  const orgPeople = listPeople(organizationId);
  const orgProjects = listProjects(organizationId);
  const orgActivities = listActivities(organizationId);

  const activePeople = orgPeople.filter((person) => person.status === "ativo").length;
  const projectsInProgress = orgProjects.filter((project) => project.status === "andamento").length;
  const plannedActivities = orgActivities.length;

  return {
    activePeople,
    projectsInProgress,
    plannedActivities,
    completedActivities: orgActivities.filter(
      (activity) => new Date(activity.endAt).getTime() < Date.now(),
    ).length,
    nextActivities: orgActivities.slice(0, 5),
  };
}
