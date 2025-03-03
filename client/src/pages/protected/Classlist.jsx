import { useEffect } from "react";
import { headerStore } from "@/store";
import Classlist from "@/features/masterlist/classList/Classlist";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Masterlist - Classlist" });
  }, []);

  if (!LIST_OF_ALLOWED_USERS.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Subject Classlist</title>
        <meta
          name="description"
          content="List of all students who enrollend on a subject"
        />
      </Helmet>
      <Classlist
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
        currentUser={currentUser}
      />
    </>
  );
}

export default InternalPage;
