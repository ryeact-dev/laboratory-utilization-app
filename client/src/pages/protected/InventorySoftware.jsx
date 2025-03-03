import { useEffect } from "react";
import Software from "@/features/inventory/software/Software";
import { headerStore } from "@/store";
import { Navigate } from "react-router-dom";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser } = useGetCurrentUserData();

  const isUserAllowed = LIST_OF_ALLOWED_USERS.includes(currentUser.role);

  const pageContent = isUserAllowed ? (
    <Software />
  ) : (
    <Navigate to="/lumens/app/lab-scheduler" replace={true} />
  );

  useEffect(() => {
    setPageTitle({ title: "Inventory - Software" });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Inventory - Software</title>
        <meta
          name="description"
          content="Masterlist of all software items in a laboratory"
        />
      </Helmet>
      {pageContent}
    </>
  );
}

export default InternalPage;
