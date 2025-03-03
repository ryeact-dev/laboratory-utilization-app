import { useEffect } from "react";
import { headerStore } from "@/store";
import UtilizationsTerm from "@/features/reports/utilizationsTerm/UtilizationsTerm";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const { currentUser, activeSchoolYear, activeTermSem, termSemStartingDate } =
    useGetCurrentUserData();

  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({
      title: "Reports - Utilizations by Term",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Utilizations by Term</title>
        <meta
          name="description"
          content="LUMENS Laboratory Utilizations by Term"
        />
      </Helmet>
      <UtilizationsTerm
        activeSchoolYear={activeSchoolYear}
        activeTermSem={activeTermSem}
        termSemStartingDate={termSemStartingDate}
        currentUser={currentUser}
      />
    </>
  );
}

export default InternalPage;
