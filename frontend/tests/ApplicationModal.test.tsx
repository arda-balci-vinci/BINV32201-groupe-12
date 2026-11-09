import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicationModal from "../src/components/ApplicationModal.tsx";
import type { Offer } from "../src/models/offer.ts";

const offer: Offer = {
  id: 1,
  title: "Application mobile",
  companyShortName: "Lumen Digital",
  academicYear: "2026-2027",
  period: "P1",
  status: "PUBLISHED",
};

describe("ApplicationModal", () => {
  it("envoie le message facultatif", () => {
    const onSubmit = vi.fn();
    render(
      <ApplicationModal
        offer={offer}
        isSubmitting={false}
        error={null}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Message (facultatif)"), {
      target: { value: "Mon message" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer ma candidature" }));

    expect(onSubmit).toHaveBeenCalledWith("Mon message");
  });

  it("transmet null quand le message est vide", () => {
    const onSubmit = vi.fn();
    render(
      <ApplicationModal
        offer={offer}
        isSubmitting={false}
        error={null}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Envoyer ma candidature" }));

    expect(onSubmit).toHaveBeenCalledWith(null);
  });
});
