import { useCallback, useEffect, useState } from "react";
import type { Application } from "../models/application.ts";
import { getMyApplications, withdrawApplication } from "../services/applications.service.ts";
import { isUnauthorized } from "../utils/api.ts";

export const useApplications = (token: string, onUnauthorized: () => void) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getMyApplications(token, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setApplications(data);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        if (isUnauthorized(reason)) onUnauthorized();
        else setError(reason instanceof Error ? reason.message : "Erreur inconnue");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [token, onUnauthorized]);

  const withdraw = useCallback(async (applicationId: number) => {
    setWithdrawingId(applicationId);
    setError(null);
    try {
      const updated = await withdrawApplication(token, applicationId);
      setApplications((current) => current.map((application) =>
        application.id === updated.id ? updated : application,
      ));
    } catch (reason: unknown) {
      if (isUnauthorized(reason)) onUnauthorized();
      else setError(reason instanceof Error ? reason.message : "Retrait impossible");
    } finally {
      setWithdrawingId(null);
    }
  }, [token, onUnauthorized]);

  return { applications, isLoading, error, withdraw, withdrawingId };
};
