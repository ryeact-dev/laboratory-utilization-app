import { useEffect } from "react";
import UtilizationsWeekly from "@/features/reports/utilizationsWeekly/UtilizationsWeekly";
import { headerStore } from "@/store";
import { Navigate } from "react-router-dom";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const { currentUser, activeSchoolYear, activeTermSem, termSemStartingDate } =
    useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Reports - Weekly Utilizations" });
  }, []);

  if (!LIST_OF_ALLOWED_USERS.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Weekly Utilizations</title>
        <meta
          name="description"
          content="LUMENS Laboratory Weekly Utilizations"
        />
      </Helmet>
      <UtilizationsWeekly
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
        termSemStartingDate={termSemStartingDate}
        currentUser={currentUser}
      />
    </>
  );
}

export default InternalPage;
