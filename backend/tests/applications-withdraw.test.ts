import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { APPLICATION, OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";

let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  app = createTestApp();
});

const withdrawAs = (studentId: number, applicationId: number) =>
  request(app)
    .post(`/applications/${applicationId}/withdraw`)
    .set("Authorization", tokenFor("STUDENT", studentId));

describe("POST /applications/:id/withdraw", () => {
  it("retire une candidature en cours appartenant à l'étudiant", async () => {
    const response = await withdrawAs(STUDENT.LUCAS_DUPONT, APPLICATION.LUCAS_FLEET_APP);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("WITHDRAWN");
  });

  it.each([
    ["retenue", STUDENT.MATEUSZ_KOWALSKI, APPLICATION.MATEUSZ_CLOUD_MIGRATION],
    ["non retenue", STUDENT.LEA_MERTENS, APPLICATION.LEA_CLOUD_MIGRATION],
    ["déjà retirée", STUDENT.INES_HADDAD, APPLICATION.INES_BILLING_API],
  ])("refuse le retrait d'une candidature %s", async (_label, studentId, applicationId) => {
    const response = await withdrawAs(studentId, applicationId);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("APPLICATION_NOT_WITHDRAWABLE");
  });

  it("refuse la candidature d'un autre étudiant sans révéler la ressource", async () => {
    const response = await withdrawAs(STUDENT.INES_HADDAD, APPLICATION.LUCAS_FLEET_APP);

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("permet une nouvelle candidature après retrait", async () => {
    const withdrawn = await withdrawAs(STUDENT.LUCAS_DUPONT, APPLICATION.LUCAS_FLEET_APP);
    expect(withdrawn.status).toBe(200);

    const reapplied = await request(app)
      .post(`/offers/${OFFER.FLEET_APP}/applications`)
      .set("Authorization", tokenFor("STUDENT", STUDENT.LUCAS_DUPONT))
      .send({ message: "Nouveau message" });

    expect(reapplied.status).toBe(201);
    expect(reapplied.body.status).toBe("IN_PROGRESS");
    expect(reapplied.body.id).not.toBe(APPLICATION.LUCAS_FLEET_APP);
  });

  it("refuse les comptes non étudiants", async () => {
    const response = await request(app)
      .post(`/applications/${APPLICATION.LUCAS_FLEET_APP}/withdraw`)
      .set("Authorization", tokenFor("ADMIN", 1));

    expect(response.status).toBe(403);
  });
});
