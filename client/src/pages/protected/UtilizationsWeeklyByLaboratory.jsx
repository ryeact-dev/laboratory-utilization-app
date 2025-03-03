import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { headerStore } from "@/store";
import { USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE } from "@/globals/initialValues";
import UtilizationsWeeklyByLaboratory from "@/features/reports/utilizationsWeeklyByLaboratory/UtilizationsWeeklyByLaboratory";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  useEffect(() => {
    setPageTitle({
      title: "Reports - Laboratory Weekly Utilizations",
    });
  }, []);

  const isUserAllowed = !USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE.includes(
    currentUser.role,
  );

  if (isUserAllowed)
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Reports - Laboratory Weekly Utilizations</title>
        <meta name="description" content="Laboratory Weekly Utilizations" />
      </Helmet>
      <UtilizationsWeeklyByLaboratory
        currentUser={currentUser}
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
      />
    </>
  );
}

export default InternalPage;
