import { useEffect } from "react";
import { headerStore } from "@/store";
import LaboratoryMonitoringSummary from "@/features/reports/labMonitoringSummary/LaboratoryMonitoringSummary";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Reports - Weekly Monitoring" });
  }, []);

  if (!LIST_OF_ALLOWED_USERS.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Monitoring Summary</title>
        <meta
          name="description"
          content="List of all laboratory monitoring reports"
        />
      </Helmet>
      <LaboratoryMonitoringSummary
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
        currentUser={currentUser}
      />
    </>
  );
}

export default InternalPage;
