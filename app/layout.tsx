import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kadiz | Plataforma SaaS de Gestão Institucional",
  description:
    "Plataforma SaaS multi-tenant para gestão institucional, projetos sociais, atividades e relatórios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
