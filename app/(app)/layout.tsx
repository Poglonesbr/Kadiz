import type { ReactNode } from "react";
import Link from "next/link";
import { canAccessModule } from "@/lib/rbac";
import { getOrganizationById } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";
import type { PlatformModule } from "@/lib/types";

type NavItem = {
  label: string;
  href: string;
  module: PlatformModule;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", module: "dashboard" },
  { label: "Pessoas atendidas", href: "/pessoas", module: "people" },
  { label: "Projetos", href: "/projetos", module: "projects" },
  { label: "Atividades", href: "/atividades", module: "activities" },
  { label: "Relatórios", href: "/relatorios", module: "reports" },
  { label: "Configurações", href: "/configuracoes", module: "settings" },
];

export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }) {
  const tenant = await getTenantContext();
  const organization = getOrganizationById(tenant.organizationId);

  if (!organization) {
    throw new Error("Organização não encontrada.");
  }

  const allowedItems = navItems.filter(
    (item) =>
      organization.modulesEnabled.includes(item.module) &&
      canAccessModule(tenant.role, item.module),
  );

  return (
    <div className="flex min-h-screen">
      <aside className="w-72 border-r border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Instituição</p>
        <h1 className="mt-2 text-lg font-bold">{organization.name}</h1>
        <p className="text-sm text-slate-600">CNPJ: {organization.cnpj}</p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <p>
            <strong>Perfil:</strong> {tenant.role}
          </p>
          <p>
            <strong>Usuário:</strong> {tenant.userName}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Dica: envie os headers <code>x-organization-id</code> e <code>x-user-role</code> para simular
            contextos.
          </p>
        </div>
        <nav className="mt-6 space-y-2">
          {allowedItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold">Gestão institucional</h2>
          <p className="text-sm text-slate-600">
            Ambiente multi-tenant com isolamento por organização e permissões por perfil.
          </p>
        </header>
        {children}
      </main>
    </div>
  );
}
