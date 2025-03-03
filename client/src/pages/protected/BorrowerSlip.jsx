import { useEffect } from "react";
import { headerStore } from "@/store";
import BorrowerSlip from "@/features/inventory/borrowerSlip/BorrowerSlip";
import { LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP } from "@/globals/initialValues";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const { currentUser, activeSchoolYear, activeTermSem } =
    useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({
      title: "Inventory - Borrower Slip",
    });
  }, []);

  if (!LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Borrower Slip</title>
        <meta
          name="description"
          content="List of all laboratory borrower slips"
        />
      </Helmet>

      <BorrowerSlip
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
        currentUser={currentUser}
      />
    </>
  );
}

export default InternalPage;
