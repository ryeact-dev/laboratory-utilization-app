import { useEffect } from "react";
import { headerStore } from "@/store";
import ListOfUsers from "@/features/settings/listOfUsers/ListOfUsers";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser } = useGetCurrentUserData();

  const pageContent =
    currentUser.role === "Admin" ? (
      <ListOfUsers />
    ) : (
      <Navigate to="/lumens/app/lab-scheduler" replace={true} />
    );

  useEffect(() => {
    setPageTitle({ title: "Settings - Users" });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Masterlist - Users</title>
        <meta name="description" content="Masterlist of all users" />
      </Helmet>
      {pageContent}
    </>
  );
}

export default InternalPage;
