import type { Application } from "../models/application.ts";
import { API_URL, readJson } from "../utils/api.ts";
import { isApplication, isApplicationList } from "../utils/guards.ts";

export const createApplication = async (
  token: string,
  offerId: number,
  message: string | null,
  signal?: AbortSignal,
): Promise<Application> => {
  const response = await fetch(`${API_URL}/offers/${offerId}/applications`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
    signal,
  });
  return readJson(response, isApplication, "Candidature impossible");
};

export const getMyApplications = async (
  token: string,
  signal?: AbortSignal,
): Promise<Application[]> => {
  const response = await fetch(`${API_URL}/applications/me`, {
    headers: { Authorization: token },
    signal,
  });
  return readJson(response, isApplicationList, "Chargement des candidatures impossible");
};
