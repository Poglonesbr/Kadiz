import { revalidatePath } from "next/cache";
import { assertModuleAccess } from "@/lib/rbac";
import { createPerson, listPeople } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

async function createPersonAction(formData: FormData) {
  "use server";

  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "people");

  createPerson(
    tenant.organizationId,
    {
      fullName: formData.get("fullName"),
      status: formData.get("status"),
    },
    tenant.userName,
  );

  revalidatePath("/pessoas");
}

export default async function PeoplePage() {
  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "people");

  const records = listPeople(tenant.organizationId);

  return (
    <section className="space-y-6">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Novo cadastro de pessoa atendida</h3>
        <form action={createPersonAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            name="fullName"
            required
            placeholder="Nome completo"
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <select name="status" defaultValue="ativo" className="rounded-md border border-slate-300 px-3 py-2">
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
          <button className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700">
            Salvar
          </button>
        </form>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Pessoas cadastradas</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="p-2">Nome</th>
                <th className="p-2">Status</th>
                <th className="p-2">Última atualização</th>
                <th className="p-2">Atualizado por</th>
              </tr>
            </thead>
            <tbody>
              {records.map((person) => (
                <tr key={person.id} className="border-b border-slate-100">
                  <td className="p-2">{person.fullName}</td>
                  <td className="p-2 capitalize">{person.status}</td>
                  <td className="p-2">{person.updatedAt.toLocaleString("pt-BR")}</td>
                  <td className="p-2">{person.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
