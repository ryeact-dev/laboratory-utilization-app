import { useEffect } from "react";
import Hardware from "@/features/inventory/hardware/Hardware";
import { headerStore } from "@/store";
import { Navigate } from "react-router-dom";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const { currentUser, activeSchoolYear, syEndingDate } =
    useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Inventory - Hardware" });
  }, []);

  if (!LIST_OF_ALLOWED_USERS.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Inventory - Hardware</title>
        <meta
          name="description"
          content="Masterlist of all hardware items in a laboratory"
        />
      </Helmet>
      <Hardware
        activeSchoolYear={activeSchoolYear}
        syEndingDate={syEndingDate}
        currentUser={currentUser}
      />
    </>
  );
}

export default InternalPage;
