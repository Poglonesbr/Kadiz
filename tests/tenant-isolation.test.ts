import assert from "node:assert/strict";
import test from "node:test";
import { canAccessModule } from "@/lib/rbac";
import { createPerson, listPeople } from "@/lib/store";

test("deve isolar listagem por organizationId", () => {
  const kadizPeople = listPeople("kadiz").map((person) => person.fullName);
  const outroPeople = listPeople("instituto-exemplo").map((person) => person.fullName);

  assert.ok(kadizPeople.includes("Ana Souza"));
  assert.ok(!kadizPeople.includes("Carlos Lima"));
  assert.ok(outroPeople.includes("Carlos Lima"));
});

test("createPerson adiciona registro na organização correta", () => {
  const beforeKadiz = listPeople("kadiz").length;
  const beforeOther = listPeople("instituto-exemplo").length;

  createPerson(
    "kadiz",
    {
      fullName: "Teste Isolamento",
      status: "ativo",
    },
    "tester",
  );

  assert.equal(listPeople("kadiz").length, beforeKadiz + 1);
  assert.equal(listPeople("instituto-exemplo").length, beforeOther);
});

test("RBAC bloqueia módulo não permitido", () => {
  assert.equal(canAccessModule("voluntario", "settings"), false);
  assert.equal(canAccessModule("admin_institucional", "settings"), true);
});
