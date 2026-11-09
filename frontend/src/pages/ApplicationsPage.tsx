import ApplicationTable from "../components/ApplicationTable.tsx";
import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import { useApplications } from "../hooks/useApplications.ts";

interface ApplicationsPageProps {
  token: string;
  onUnauthorized: () => void;
}

const ApplicationsPage = ({ token, onUnauthorized }: ApplicationsPageProps) => {
  const { applications, isLoading, error, withdraw, withdrawingId } =
    useApplications(token, onUnauthorized);

  const handleWithdraw = (applicationId: number) => {
    if (window.confirm("Voulez-vous retirer cette candidature ?")) {
      void withdraw(applicationId);
    }
  };

  return (
    <section>
      <h1>Mes candidatures</h1>
      <p>Consultez vos candidatures et leur statut.</p>
      {error ? <ErrorState message={error} /> :
        isLoading ? <LoadingState /> :
          applications.length === 0 ? <EmptyState message="Aucune candidature à afficher." /> :
            <ApplicationTable
              applications={applications}
              onWithdraw={handleWithdraw}
              withdrawingId={withdrawingId}
            />}
    </section>
  );
};

export default ApplicationsPage;
