import { useEffect } from "react";
import { headerStore } from "@/store";
import ListOfLabMonitoringSummaryPage from "@/features/reports/labMonitoringSummary/LaboratoryMonitoringSummaryPage";
import { Helmet } from "react-helmet";

function UtilizationsLabMonitoring() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({
      title: "Reports - Laboratory Monitoring",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Utilization Monitoring</title>
        <meta
          name="description"
          content="LUMENS Laboratory Utilization Monitoring"
        />
      </Helmet>
      <ListOfLabMonitoringSummaryPage />
    </>
  );
}

export default UtilizationsLabMonitoring;
