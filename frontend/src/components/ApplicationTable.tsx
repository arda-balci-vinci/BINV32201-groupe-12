import type { Application } from "../models/application.ts";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONES } from "../utils/labels.ts";
import StatusBadge from "./StatusBadge.tsx";

interface ApplicationTableProps {
  applications: Application[];
  onWithdraw: (applicationId: number) => void;
  withdrawingId: number | null;
}

const ApplicationTable = ({ applications, onWithdraw, withdrawingId }: ApplicationTableProps) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Offre</th>
          <th scope="col">Entreprise</th>
          <th scope="col">Message</th>
          <th scope="col">Statut</th>
          <th scope="col">Date</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application.id}>
            <td>{application.offerTitle ?? `Offre #${application.offerId}`}</td>
            <td>{application.companyShortName ?? "—"}</td>
            <td>{application.message ?? "—"}</td>
            <td>
              <StatusBadge
                label={APPLICATION_STATUS_LABELS[application.status]}
                tone={APPLICATION_STATUS_TONES[application.status]}
              />
            </td>
            <td>{application.appliedAt}</td>
            <td>
              {application.status === "IN_PROGRESS" && (
                <button
                  className="button"
                  type="button"
                  onClick={() => onWithdraw(application.id)}
                  disabled={withdrawingId !== null}
                >
                  {withdrawingId === application.id ? "Retrait…" : "Retirer"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ApplicationTable;
