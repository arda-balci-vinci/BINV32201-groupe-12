import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import type { Db } from "../src/db/database.ts";
import { APPLICATION, OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";
import { createTestDatabase } from "./helpers/testDatabase.ts";

let db: Db;
let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  db = createTestDatabase();
  app = createTestApp(db);
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
    db.prepare(
      "INSERT INTO applications (offer_id, student_id, message, status, applied_at) VALUES (?, ?, ?, ?, ?)",
    ).run(OFFER.FLEET_APP, STUDENT.MATEUSZ_KOWALSKI, null, "IN_PROGRESS", "2026-11-01 10:00:00");
    db.prepare(
      "INSERT INTO applications (offer_id, student_id, message, status, applied_at) VALUES (?, ?, ?, ?, ?)",
    ).run(OFFER.BILLING_API, STUDENT.MATEUSZ_KOWALSKI, null, "REJECTED", "2026-11-02 10:00:00");
    db.prepare(
      "INSERT INTO applications (offer_id, student_id, message, status, applied_at) VALUES (?, ?, ?, ?, ?)",
    ).run(OFFER.E2E_TESTS, STUDENT.MATEUSZ_KOWALSKI, null, "WITHDRAWN", "2026-11-03 10:00:00");

    const response = await request(app)
      .get("/applications/me")
      .set("Authorization", tokenFor("STUDENT", STUDENT.MATEUSZ_KOWALSKI));

    expect(response.status).toBe(200);
    const statuses = response.body.map((application: { status: string }) => application.status);
    expect(statuses).toHaveLength(4);
    expect(statuses).toEqual(
      expect.arrayContaining(["IN_PROGRESS", "SELECTED", "REJECTED", "WITHDRAWN"]),
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
