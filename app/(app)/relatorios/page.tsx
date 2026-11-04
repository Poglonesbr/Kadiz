import Link from "next/link";
import { assertModuleAccess } from "@/lib/rbac";
import { getDashboardMetrics } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

export default async function ReportsPage() {
  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "reports");

  const metrics = getDashboardMetrics(tenant.organizationId);

  return (
    <section className="space-y-6">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Central de relatórios institucionais</h3>
        <p className="mt-2 text-sm text-slate-600">
          Exportações respeitam o contexto da organização em sessão e não incluem dados de outras instituições.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/api/reports/people.csv"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Exportar pessoas (CSV)
          </Link>
          <Link
            href="/api/reports/activities.csv"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Exportar atividades (CSV)
          </Link>
          <Link
            href="/relatorios/presenca/imprimir"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Lista de presença (A4 para impressão/PDF)
          </Link>
        </div>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Resumo rápido</h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-slate-700">
          <li>Pessoas ativas: {metrics.activePeople}</li>
          <li>Projetos em andamento: {metrics.projectsInProgress}</li>
          <li>Atividades planejadas: {metrics.plannedActivities}</li>
        </ul>
      </article>
    </section>
  );
}
