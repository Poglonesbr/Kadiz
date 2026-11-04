# Kadiz

Plataforma SaaS de gestão institucional (multi-tenant) para OSCs, associações, ONGs e projetos sociais.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Contexto multi-tenant (simulação local)

O contexto da organização e do perfil é validado no servidor por headers:

- `x-organization-id` (ex.: `kadiz`, `instituto-exemplo`)
- `x-user-role` (ex.: `admin_institucional`, `voluntario`)
- `x-user-name`

Exemplo:

```bash
curl -H 'x-organization-id: kadiz' -H 'x-user-role: admin_institucional' http://localhost:3000/api/reports/people.csv
```

## Módulos implementados nesta entrega

- Dashboard institucional dinâmico
- Pessoas atendidas (cadastro e listagem)
- Projetos sociais (cadastro e listagem)
- Atividades (planejamento e calendário em lista)
- Relatórios (exportação CSV e versão A4 para impressão de presença)
- Configurações institucionais
- RBAC inicial por perfil e módulos
- Isolamento multi-tenant em todas as consultas/ações de servidor

## Testes

```bash
npm run test
npm run lint
```

> Observação: os dados persistem em memória no processo da aplicação para facilitar validação da arquitetura e dos fluxos. Em produção, substitua por PostgreSQL + RLS.
