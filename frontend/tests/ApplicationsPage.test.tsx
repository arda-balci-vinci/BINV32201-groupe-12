import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicationsPage from "../src/pages/ApplicationsPage.tsx";
import { stubFetch } from "./helpers/fetchMock.ts";

describe("ApplicationsPage", () => {
  it("affiche les candidatures et leurs libellés français", async () => {
    stubFetch({
      "/api/applications/me": () => Response.json([
        {
          id: 1,
          offerId: 2,
          studentId: 3,
          offerTitle: "Refonte du portail client",
          companyShortName: "Lumen Digital",
          message: null,
          status: "IN_PROGRESS",
          appliedAt: "2026-11-03 14:00:00",
        },
      ]),
    });

    render(<ApplicationsPage token="jeton" onUnauthorized={vi.fn()} />);

    expect(await screen.findByText("Refonte du portail client")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
  });

  it("affiche l'état vide", async () => {
    stubFetch({ "/api/applications/me": () => Response.json([]) });

    render(<ApplicationsPage token="jeton" onUnauthorized={vi.fn()} />);

    expect(await screen.findByText("Aucune candidature à afficher.")).toBeInTheDocument();
  });

  it("signale une session expirée", async () => {
    stubFetch({ "/api/applications/me": () => new Response(null, { status: 401 }) });
    const onUnauthorized = vi.fn();

    render(<ApplicationsPage token="jeton" onUnauthorized={onUnauthorized} />);

    await waitFor(() => expect(onUnauthorized).toHaveBeenCalled());
  });

  it("retire une candidature en cours", async () => {
    const fetchMock = stubFetch({
      "/api/applications/me": () => Response.json([{
        id: 1, offerId: 2, studentId: 3, offerTitle: "Refonte du portail client",
        companyShortName: "Lumen Digital", message: null, status: "IN_PROGRESS",
        appliedAt: "2026-11-03 14:00:00",
      }]),
      "/api/applications/1/withdraw": () => Response.json({
        id: 1, offerId: 2, studentId: 3, offerTitle: "Refonte du portail client",
        companyShortName: "Lumen Digital", message: null, status: "WITHDRAWN",
        appliedAt: "2026-11-03 14:00:00",
      }),
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<ApplicationsPage token="jeton" onUnauthorized={vi.fn()} />);
    await screen.findByText("En cours");
    fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "/api/applications/1/withdraw",
      expect.objectContaining({ method: "POST", headers: { Authorization: "jeton" } }),
    ));
    expect(await screen.findByText("Retirée")).toBeInTheDocument();
  });
});
