import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { APPLICATION, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";

let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  app = createTestApp();
});

describe("GET /applications/me", () => {
  it("retourne uniquement les candidatures de l'étudiant connecté", async () => {
    const response = await request(app)
      .get("/applications/me")
      .set("Authorization", tokenFor("STUDENT", STUDENT.INES_HADDAD));

    expect(response.status).toBe(200);
    expect(response.body.map((application: { id: number }) => application.id)).toEqual([
      APPLICATION.INES_FLEET_APP,
      APPLICATION.INES_BILLING_API,
    ]);
    expect(response.body[0]).toMatchObject({
      offerTitle: "Application React de gestion de flotte",
      companyShortName: "Lumen Digital",
      status: "IN_PROGRESS",
    });
  });

  it("expose les quatre statuts dans une liste étudiant", async () => {
    const response = await request(app)
      .get("/applications/me")
      .set("Authorization", tokenFor("STUDENT", STUDENT.MATEUSZ_KOWALSKI));

    expect(response.status).toBe(200);
    expect(response.body.map((application: { status: string }) => application.status)).toContain(
      "SELECTED",
    );
  });

  it("refuse les comptes non étudiants", async () => {
    const response = await request(app)
      .get("/applications/me")
      .set("Authorization", tokenFor("ADMIN", 1));

    expect(response.status).toBe(403);
  });

  it("refuse une session absente", async () => {
    const response = await request(app).get("/applications/me");

    expect(response.status).toBe(401);
  });
});
