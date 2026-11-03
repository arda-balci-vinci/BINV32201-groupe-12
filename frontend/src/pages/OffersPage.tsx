import { useState } from "react";
import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import OfferTable from "../components/OfferTable.tsx";
import { useOffers } from "../hooks/useOffers.ts";
import { PERIOD_CODES, type PeriodCode } from "../models/offer.ts";
import type { User } from "../models/user.ts";
import { PERIOD_LABELS } from "../utils/labels.ts";
import ApplicationModal from "../components/ApplicationModal.tsx";
import { createApplication } from "../services/applications.service.ts";
import type { Offer } from "../models/offer.ts";

interface OffersPageProps {
  user: User;
  token: string;
  onUnauthorized: () => void;
}

const DESCRIPTIONS = {
  ADMIN: "Toutes les offres, tous statuts confondus.",
  STUDENT: "Les offres publiées.",
  CONTACT: "Les offres que vous avez déposées.",
} as const;

const OffersPage = ({ user, token, onUnauthorized }: OffersPageProps) => {
  const [period, setPeriod] = useState<PeriodCode | "">("");
  const [applicationOffer, setApplicationOffer] = useState<Offer | null>(null);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { offers, isLoading, error } = useOffers(
    token,
    onUnauthorized,
    period === "" ? undefined : period,
  );

  const submitApplication = async (message: string | null) => {
    if (applicationOffer === null) return;
    setIsSubmitting(true);
    setApplicationError(null);
    try {
      await createApplication(token, applicationOffer.id, message);
      setApplicationOffer(null);
    } catch (reason: unknown) {
      setApplicationError(reason instanceof Error ? reason.message : "Candidature impossible");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (error) return <ErrorState message={error} />;
    if (isLoading) return <LoadingState />;
    if (offers.length === 0) return <EmptyState message="Aucune offre à afficher." />;
    return (
      <>
        <p className="result-count">
          {offers.length} offre{offers.length > 1 ? "s" : ""}
        </p>
        <OfferTable
          offers={offers}
          onApply={user.kind === "STUDENT" ? (offer) => {
            setApplicationError(null);
            setApplicationOffer(offer);
          } : undefined}
        />
      </>
    );
  };

  return (
    <section>
      <h1>Offres de stage</h1>
      <p>{DESCRIPTIONS[user.kind]}</p>
      <label>
        Période
        <select
          aria-label="Période"
          value={period}
          onChange={(event) => setPeriod(event.target.value as PeriodCode | "")}
        >
          <option value="">Toutes les périodes</option>
          {PERIOD_CODES.map((code) => (
            <option key={code} value={code}>
              {PERIOD_LABELS[code]}
            </option>
          ))}
        </select>
      </label>
      {renderContent()}
      {applicationOffer && (
        <ApplicationModal
          offer={applicationOffer}
          isSubmitting={isSubmitting}
          error={applicationError}
          onSubmit={submitApplication}
          onClose={() => {
            if (!isSubmitting) {
              setApplicationOffer(null);
              setApplicationError(null);
            }
          }}
        />
      )}
    </section>
  );
};

export default OffersPage;
