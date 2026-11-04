import { assertModuleAccess } from "@/lib/rbac";
import { getOrganizationById } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

export default async function SettingsPage() {
  const tenant = await getTenantContext();
  assertModuleAccess(tenant.role, "settings");

  const organization = getOrganizationById(tenant.organizationId);
  if (!organization) {
    throw new Error("Organização não encontrada.");
  }

  return (
    <section className="space-y-6">
      <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Dados institucionais</h3>
        <dl className="mt-4 grid gap-2 text-sm">
          <div>
            <dt className="font-medium">Nome</dt>
            <dd>{organization.name}</dd>
          </div>
          <div>
            <dt className="font-medium">CNPJ</dt>
            <dd>{organization.cnpj}</dd>
          </div>
          <div>
            <dt className="font-medium">Módulos habilitados</dt>
            <dd>{organization.modulesEnabled.join(", ")}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
