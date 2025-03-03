import { useEffect } from "react";
import { headerStore } from "@/store";
import Dashboard from "@/features/dashboard/Dashboard";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  useEffect(() => {
    setPageTitle({ title: "Dashboard" });
  }, []);

  if (currentUser.role !== "Admin")
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Dashboard</title>
        <meta name="description" content="LUMENS Dashboard" />
      </Helmet>
      <Dashboard
        currentUser={currentUser}
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
      />
    </>
  );
}

export default InternalPage;
