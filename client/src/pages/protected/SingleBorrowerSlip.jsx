import { useEffect } from "react";
import { headerStore } from "@/store";
import SingleBorrowerSlip from "@/features/inventory/borrowerSlip/components/singleBorrowerSlip/SingleBorrowerSlip";
import { LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP } from "@/globals/initialValues";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser } = useGetCurrentUserData();

  useEffect(() => {
    setPageTitle({
      title: "Inventory - Single Borrower Slip",
    });
  }, []);

  if (!LIST_OF_ALLOWED_USERS_FOR_BORROWER_SLIP.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Borrower Slip - Single</title>
        <meta name="description" content="Single Borrower Slip" />
      </Helmet>
      <SingleBorrowerSlip />
    </>
  );
}

export default InternalPage;
