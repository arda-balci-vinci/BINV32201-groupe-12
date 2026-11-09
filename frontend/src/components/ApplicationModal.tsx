import { useState } from "react";
import type { Offer } from "../models/offer.ts";

interface ApplicationModalProps {
  offer: Offer;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (message: string | null) => void;
  onClose: () => void;
}

const ApplicationModal = ({
  offer,
  isSubmitting,
  error,
  onSubmit,
  onClose,
}: ApplicationModalProps) => {
  const [message, setMessage] = useState("");

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="application-title">
        <h2 id="application-title">Candidater à « {offer.title} »</h2>
        <label>
          Message (facultatif)
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isSubmitting}
          />
        </label>
        {error && <p className="state state-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button className="button" type="button" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={() => onSubmit(message.trim() === "" ? null : message)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi…" : "Envoyer ma candidature"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ApplicationModal;
