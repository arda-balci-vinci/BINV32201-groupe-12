import { toApplication } from "../mappers/application.mapper.ts";
import type { Application } from "../models/application.ts";
import type { User } from "../models/user.ts";
import type { ApplicationsRepository } from "../repositories/applications.repository.ts";
import { HttpError } from "../utils/httpError.ts";
import { isStudent } from "./permissions.ts";

export interface CreateApplicationInput {
  offerId: number;
  message: string | null;
}

export const createApplicationsService = (repository: ApplicationsRepository) => ({
  create: (viewer: User, input: CreateApplicationInput): Application => {
    if (!isStudent(viewer)) {
      throw new HttpError(403, "FORBIDDEN", "Seul un étudiant peut candidater");
    }

    const offerStatus = repository.findOfferStatus(input.offerId);
    if (offerStatus === null) {
      throw new HttpError(400, "INVALID_OFFER", "Cette offre n'existe pas");
    }
    if (offerStatus !== "PUBLISHED") {
      throw new HttpError(400, "OFFER_NOT_PUBLISHED", "Cette offre n'est pas publiée");
    }
    if (repository.findActive(input.offerId, viewer.id) !== null) {
      throw new HttpError(400, "APPLICATION_EXISTS", "Vous avez déjà une candidature active pour cette offre");
    }

    return toApplication(repository.insert(input.offerId, viewer.id, input.message));
  },
});

export type ApplicationsService = ReturnType<typeof createApplicationsService>;
