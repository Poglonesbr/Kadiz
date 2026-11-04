import { listActivities } from "@/lib/store";
import { getTenantContext } from "@/lib/tenant";

export const instant = false;

export default async function PrintAttendancePage() {
  const tenant = await getTenantContext();
  const activities = listActivities(tenant.organizationId);

  return (
    <main className="mx-auto max-w-[210mm] bg-white p-8 text-black print:p-6">
      <h1 className="text-2xl font-bold">Lista de Presença</h1>
      <p className="text-sm">Instituição: {tenant.organizationId}</p>
      <p className="text-sm">Data de emissão: {new Date().toLocaleDateString("pt-BR")}</p>

      {activities.map((activity) => (
        <section key={activity.id} className="mt-6 break-inside-avoid rounded border border-slate-300 p-4">
          <h2 className="text-lg font-semibold">{activity.name}</h2>
          <p className="text-sm">Categoria: {activity.category}</p>
          <p className="text-sm">
            Horário: {activity.startAt.replace("T", " ")} até {activity.endAt.replace("T", " ")}
          </p>
          <p className="text-sm">Local: {activity.local}</p>
          <p className="text-sm">Responsável: {activity.responsible}</p>

          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-black text-left">
                <th className="p-2">Nome</th>
                <th className="p-2">Presença</th>
                <th className="p-2">Assinatura</th>
              </tr>
            </thead>
            <tbody>
              {activity.participants.map((participant) => (
                <tr key={participant} className="border-b border-slate-300">
                  <td className="p-2">{participant}</td>
                  <td className="p-2">( ) Presente  ( ) Ausente</td>
                  <td className="p-2">________________________________</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
