import { revalidatePath } from "next/cache";
import { assertModuleAccess } from "@/lib/rbac";
import { createProject, listProjects } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

async function createProjectAction(formData: FormData) {
  "use server";

  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "projects");

  createProject(
    tenant.organizationId,
    {
      name: formData.get("name"),
      status: formData.get("status"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    },
    tenant.userName,
  );

  revalidatePath("/projetos");
}

export default async function ProjectsPage() {
  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "projects");

  const records = listProjects(tenant.organizationId);

  return (
    <section className="space-y-6">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Novo projeto social</h3>
        <form action={createProjectAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <input name="name" required placeholder="Nome do projeto" className="rounded-md border border-slate-300 px-3 py-2" />
          <select name="status" defaultValue="planejado" className="rounded-md border border-slate-300 px-3 py-2">
            <option value="planejado">Planejado</option>
            <option value="andamento">Em andamento</option>
            <option value="concluido">Concluído</option>
          </select>
          <input name="startDate" required type="date" className="rounded-md border border-slate-300 px-3 py-2" />
          <input name="endDate" required type="date" className="rounded-md border border-slate-300 px-3 py-2" />
          <button className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 md:col-span-4">
            Salvar projeto
          </button>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Projetos cadastrados</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="p-2">Projeto</th>
                <th className="p-2">Status</th>
                <th className="p-2">Início</th>
                <th className="p-2">Fim</th>
                <th className="p-2">Atualizado por</th>
              </tr>
            </thead>
            <tbody>
              {records.map((project) => (
                <tr key={project.id} className="border-b border-slate-100">
                  <td className="p-2">{project.name}</td>
                  <td className="p-2 capitalize">{project.status}</td>
                  <td className="p-2">{project.startDate}</td>
                  <td className="p-2">{project.endDate}</td>
                  <td className="p-2">{project.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
