import { useEffect } from "react";
import { headerStore } from "@/store";
import { Helmet } from "react-helmet";
import LaboratoryOrientation from "@/features/reports/laboratory-orientation/LaboratoryOrientation";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  useEffect(() => {
    setPageTitle({ title: "Laboratory - Orientation" });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory Schedule</title>
        <meta name="description" content="Laboratory Orientation" />
      </Helmet>
      <LaboratoryOrientation />
    </>
  );
}

export default InternalPage;
