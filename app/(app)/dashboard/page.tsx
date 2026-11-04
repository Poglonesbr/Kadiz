import { getDashboardMetrics } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}

export default async function DashboardPage() {
  const tenant = await getTenantContext();
  const metrics = getDashboardMetrics(tenant.organizationId);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Pessoas atendidas ativas" value={metrics.activePeople} />
        <MetricCard title="Projetos em andamento" value={metrics.projectsInProgress} />
        <MetricCard title="Atividades planejadas" value={metrics.plannedActivities} />
        <MetricCard title="Atividades realizadas" value={metrics.completedActivities} />
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Próximas atividades</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {metrics.nextActivities.length === 0 ? (
            <li className="text-slate-500">Sem atividades previstas.</li>
          ) : (
            metrics.nextActivities.map((activity) => (
              <li key={activity.id} className="rounded-md border border-slate-100 p-3">
                <p className="font-medium">{activity.name}</p>
                <p className="text-slate-600">
                  {activity.category} • {activity.startAt.replace("T", " ")} • {activity.local}
                </p>
              </li>
            ))
          )}
        </ul>
      </article>
    </section>
  );
}
