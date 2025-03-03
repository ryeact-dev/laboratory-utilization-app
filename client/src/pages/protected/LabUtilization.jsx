import { useEffect } from "react";
import { headerStore } from "@/store";
import Utilization from "@/features/laboratory/utilization/Utilization";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function LabUtilization() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Laboratory - Class Utilization" });
  }, []);

  if (!LIST_OF_ALLOWED_USERS.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Utilization</title>
        <meta
          name="description"
          content="List of all laboratory utilization reports"
        />
      </Helmet>
      <Utilization
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
        currentUser={currentUser}
      />
    </>
  );
}

export default LabUtilization;
