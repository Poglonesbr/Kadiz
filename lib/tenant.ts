import { headers } from "next/headers";
import { connection } from "next/server";
import { z } from "zod";
import { getOrganizationById } from "@/lib/store";
import type { UserRole } from "@/lib/types";

const tenantHeadersSchema = z.object({
  organizationId: z.string().trim().default("kadiz"),
  role: z
    .enum([
      "super_admin",
      "admin_institucional",
      "gestor",
      "profissional_tecnico",
      "professor_monitor",
      "financeiro",
      "voluntario",
    ])
    .default("admin_institucional"),
  userName: z.string().trim().default("Usuário institucional"),
});

export type TenantContext = {
  organizationId: string;
  role: UserRole;
  userName: string;
};

export async function getTenantContext(): Promise<TenantContext> {
  await connection();
  const currentHeaders = await headers();

  const parsed = tenantHeadersSchema.parse({
    organizationId: currentHeaders.get("x-organization-id") ?? "kadiz",
    role: currentHeaders.get("x-user-role") ?? "admin_institucional",
    userName: currentHeaders.get("x-user-name") ?? "Usuário institucional",
  });

  const organization = getOrganizationById(parsed.organizationId);
  if (!organization) {
    throw new Error("Organização inválida no contexto da requisição.");
  }

  return {
    organizationId: parsed.organizationId,
    role: parsed.role,
    userName: parsed.userName,
  };
}
