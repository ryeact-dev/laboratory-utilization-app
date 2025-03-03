import { useEffect } from "react";
import { headerStore } from "@/store";
import LaboratoryScheduler from "@/features/laboratory/scheduler/Scheduler";
import { Helmet } from "react-helmet";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Laboratory - Schedule" });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Schedule</title>
        <meta name="description" content="Laboratory Schedule" />
      </Helmet>
      <LaboratoryScheduler />
    </>
  );
}

export default InternalPage;
