import { useEffect } from "react";
import { headerStore } from "@/store";
import ListOfStudents from "@/features/masterlist/listOfStudents/ListOfStudents";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const { currentUser, activeSchoolYear } = useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Masterlist - Students" });
  }, []);

  if (!LIST_OF_ALLOWED_USERS.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Masterlist - Students</title>
        <meta name="description" content="Masterlist of all students" />
      </Helmet>
      <ListOfStudents
        activeSchoolYear={activeSchoolYear}
        currentUser={currentUser}
      />
    </>
  );
}

export default InternalPage;
