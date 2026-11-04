import { revalidatePath } from "next/cache";
import { assertModuleAccess } from "@/lib/rbac";
import { createActivity, listActivities, listProjects } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

async function createActivityAction(formData: FormData) {
  "use server";

  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "activities");

  createActivity(
    tenant.organizationId,
    {
      name: formData.get("name"),
      category: formData.get("category"),
      projectId: formData.get("projectId") || undefined,
      startAt: formData.get("startAt"),
      endAt: formData.get("endAt"),
      responsible: formData.get("responsible"),
      local: formData.get("local"),
      participants: formData.get("participants"),
    },
    tenant.userName,
  );

  revalidatePath("/atividades");
}

export default async function ActivitiesPage() {
  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "activities");

  const activities = listActivities(tenant.organizationId);
  const projects = listProjects(tenant.organizationId);

  return (
    <section className="space-y-6">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Planejamento de atividade</h3>
        <form action={createActivityAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Nome da atividade" className="rounded-md border border-slate-300 px-3 py-2" />
          <input name="category" required placeholder="Categoria" className="rounded-md border border-slate-300 px-3 py-2" />
          <select name="projectId" className="rounded-md border border-slate-300 px-3 py-2">
            <option value="">Projeto (opcional)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <input name="responsible" required placeholder="Responsável" className="rounded-md border border-slate-300 px-3 py-2" />
          <input name="startAt" required type="datetime-local" className="rounded-md border border-slate-300 px-3 py-2" />
          <input name="endAt" required type="datetime-local" className="rounded-md border border-slate-300 px-3 py-2" />
          <input name="local" required placeholder="Local" className="rounded-md border border-slate-300 px-3 py-2" />
          <input
            name="participants"
            placeholder="Participantes separados por vírgula"
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <button className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 md:col-span-2">
            Salvar atividade
          </button>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Calendário em lista</h3>
          <a
            href="/relatorios/presenca/imprimir"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
          >
            Imprimir lista de presença (A4)
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="p-2">Atividade</th>
                <th className="p-2">Categoria</th>
                <th className="p-2">Período</th>
                <th className="p-2">Responsável</th>
                <th className="p-2">Local</th>
                <th className="p-2">Participantes</th>
                <th className="p-2">Registro</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b border-slate-100 align-top">
                  <td className="p-2">{activity.name}</td>
                  <td className="p-2">{activity.category}</td>
                  <td className="p-2">
                    {activity.startAt.replace("T", " ")} - {activity.endAt.replace("T", " ")}
                  </td>
                  <td className="p-2">{activity.responsible}</td>
                  <td className="p-2">{activity.local}</td>
                  <td className="p-2">{activity.participants.length ? activity.participants.join(", ") : "-"}</td>
                  <td className="p-2 text-xs text-slate-600">
                    {activity.updatedBy}
                    <br />
                    {activity.updatedAt.toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
