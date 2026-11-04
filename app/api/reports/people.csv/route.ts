import { assertModuleAccess } from "@/lib/rbac";
import { listPeople } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

export async function GET() {
  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "reports");

  const records = listPeople(tenant.organizationId);

  const csv = [
    "nome,status,atualizado_em,atualizado_por",
    ...records.map(
      (person) =>
        `"${person.fullName}","${person.status}","${person.updatedAt.toISOString()}","${person.updatedBy}"`,
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=pessoas.csv",
    },
  });
}
