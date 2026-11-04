import { assertModuleAccess } from "@/lib/rbac";
import { listActivities } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

export async function GET() {
  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "reports");

  const records = listActivities(tenant.organizationId);

  const csv = [
    "atividade,categoria,inicio,fim,responsavel,local,participantes",
    ...records.map(
      (activity) =>
        `"${activity.name}","${activity.category}","${activity.startAt}","${activity.endAt}","${activity.responsible}","${activity.local}","${activity.participants.join(" | ")}"`,
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=atividades.csv",
    },
  });
}
