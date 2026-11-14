import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";

let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  app = createTestApp();
});

const applyAs = (studentId: number, offerId: number, body: object = {}) =>
  request(app)
    .post(`/offers/${offerId}/applications`)
    .set("Authorization", tokenFor("STUDENT", studentId))
    .send(body);

describe("POST /offers/:id/applications", () => {
  it("crée une candidature avec un message facultatif", async () => {
    const response = await applyAs(STUDENT.YOUSSEF_EL_AMRANI, OFFER.FLEET_APP, {
      message: "Mon expérience correspond à cette offre.",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      offerId: OFFER.FLEET_APP,
      studentId: STUDENT.YOUSSEF_EL_AMRANI,
      message: "Mon expérience correspond à cette offre.",
      status: "IN_PROGRESS",
    });
  });

  it("refuse les rôles autres qu'étudiant", async () => {
    const response = await request(app)
      .post(`/offers/${OFFER.FLEET_APP}/applications`)
      .set("Authorization", tokenFor("ADMIN", 1))
      .send({});

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("refuse une candidature sans session", async () => {
    const response = await request(app)
      .post(`/offers/${OFFER.FLEET_APP}/applications`)
      .send({});

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("refuse une candidature active en doublon", async () => {
    const response = await applyAs(STUDENT.LUCAS_DUPONT, OFFER.FLEET_APP);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("APPLICATION_EXISTS");
  });

  it("refuse une offre qui n'est pas publiée", async () => {
    const response = await applyAs(STUDENT.YOUSSEF_EL_AMRANI, OFFER.CLOUD_MIGRATION);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("OFFER_NOT_PUBLISHED");
  });

  it("autorise une nouvelle candidature après un retrait", async () => {
    const response = await applyAs(STUDENT.INES_HADDAD, OFFER.BILLING_API);

    expect(response.status).toBe(201);
    expect(response.body.message).toBeNull();
    expect(response.body.status).toBe("IN_PROGRESS");
  });

  it("valide le corps de la requête", async () => {
    const response = await applyAs(STUDENT.YOUSSEF_EL_AMRANI, OFFER.FLEET_APP, {
      message: 42,
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_BODY");
  });
});
