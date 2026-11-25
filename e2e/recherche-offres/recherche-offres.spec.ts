import { expect, test, type Page } from "@playwright/test";

const matchingOfferTitle = "API REST de facturation";
const otherPublishedOfferTitle = "Application React de gestion de flotte";
const unpublishedOfferTitle = "Refonte du portail client";

const openOffersAsStudent = async (page: Page) => {
  await page.goto("/offres");
  await page.getByRole("button", { name: "Mateusz Kowalski" }).click();
  await expect(page.getByRole("heading", { name: "Offres de stage" })).toBeVisible();
  await expect(page.getByRole("cell", { name: matchingOfferTitle })).toBeVisible();
  await expect(page.getByRole("cell", { name: otherPublishedOfferTitle })).toBeVisible();
  await expect(page.getByRole("cell", { name: unpublishedOfferTitle })).toHaveCount(0);
};

test("Scénario 1 : la recherche api affiche uniquement l'offre publiée correspondante", async ({ page }) => {
  await openOffersAsStudent(page);

  await page.getByRole("searchbox", { name: "Titre" }).fill("api");

  await expect(page.getByRole("cell", { name: matchingOfferTitle })).toBeVisible();
  await expect(page.getByRole("cell", { name: otherPublishedOfferTitle })).toHaveCount(0);
  await expect(page.getByRole("cell", { name: unpublishedOfferTitle })).toHaveCount(0);
  await expect(page.getByText("1 offre", { exact: true })).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(2);
});

test("Scénario 2 : une recherche sans résultat affiche le message dédié", async ({ page }) => {
  await openOffersAsStudent(page);

  await page.getByRole("searchbox", { name: "Titre" }).fill("IntrouvableXYZ");

  await expect(
    page.getByText("Aucune offre ne correspond à votre recherche.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("row")).toHaveCount(0);
});
