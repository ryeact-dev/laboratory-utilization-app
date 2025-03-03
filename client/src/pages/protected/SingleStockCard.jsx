import { useEffect } from "react";
import { headerStore } from "@/store";
import SingleStockCard from "@/features/inventory/stockCard/components/singleStockCard/SingleStockCard";
import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser } = useGetCurrentUserData();

  useEffect(() => {
    setPageTitle({
      title: "Inventory - Single Stock Card",
    });
  }, []);

  if (!LIST_OF_ALLOWED_USERS.includes(currentUser.role))
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Stock Card - Single</title>
        <meta name="description" content="LUMENS Single stock card" />
      </Helmet>
      <SingleStockCard />
    </>
  );
}

export default InternalPage;
