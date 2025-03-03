import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { headerStore } from "@/store";
import { USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE } from "@/globals/initialValues";
import ListOfReservations from "@/features/reports/listOfReservations/ListOfReservations";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser } = useGetCurrentUserData();

  useEffect(() => {
    setPageTitle({
      title: "Laboratory - Reservation Schedules",
    });
  }, []);

  const isUserAllowed = ![
    ...USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE,
    "Admin",
  ].includes(currentUser.role);

  if (isUserAllowed)
    return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Reservations</title>
        <meta
          name="description"
          content="Masterlist of all laboratory reservations"
        />
      </Helmet>
      <ListOfReservations />
    </>
  );
}

export default InternalPage;
