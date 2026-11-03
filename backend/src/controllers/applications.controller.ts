import { Router } from "express";
import { toApplicationDto } from "../mappers/application.mapper.ts";
import { getCurrentUser } from "../middlewares/authenticate.ts";
import type { ApplicationsService } from "../services/applications.service.ts";
import { canApplyToOffer } from "../services/permissions.ts";
import { HttpError } from "../utils/httpError.ts";
import { authorize } from "../middlewares/authorize.ts";

interface CreateApplicationBody {
  message: string | null;
}

const parseOfferId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "INVALID_PARAM", "L'identifiant de l'offre est invalide");
  }
  return id;
};

const parseApplicationId = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, "INVALID_PARAM", "L'identifiant de la candidature est invalide");
  }
  return id;
};

const parseBody = (value: unknown): CreateApplicationBody => {
  if (typeof value !== "object" || value === null) {
    throw new HttpError(400, "INVALID_BODY", "Le corps doit contenir un message facultatif");
  }
  const body = value as Record<string, unknown>;
  if (body.message !== undefined && body.message !== null && typeof body.message !== "string") {
    throw new HttpError(400, "INVALID_BODY", "Le message doit être une chaîne de caractères");
  }
  return { message: body.message === undefined ? null : body.message };
};

export const createOfferApplicationsRouter = (service: ApplicationsService) => {
  const router = Router();

  router.post("/:offerId/applications", authorize(canApplyToOffer), (req, res) => {
    const application = service.create(getCurrentUser(req), {
      offerId: parseOfferId(String(req.params.offerId)),
      message: parseBody(req.body).message,
    });
    res.status(201).json(toApplicationDto(application));
  });

  return router;
};

export const createApplicationsRouter = (service: ApplicationsService) => {
  const router = Router();

  router.get("/me", authorize(canApplyToOffer), (req, res) => {
    res.json(service.listMine(getCurrentUser(req)).map(toApplicationDto));
  });

  router.post("/:applicationId/withdraw", authorize(canApplyToOffer), (req, res) => {
    const application = service.withdraw(
      getCurrentUser(req),
      parseApplicationId(String(req.params.applicationId)),
    );
    res.json(toApplicationDto(application));
  });

  return router;
};
