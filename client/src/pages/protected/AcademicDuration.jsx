import { useEffect } from "react";
import { headerStore } from "@/store";
import AcademicDuration from "@/features/masterlist/academicDuration/AcademicDuration";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser } = useGetCurrentUserData();

  const pageContent =
    currentUser.role === "Admin" ? (
      <AcademicDuration />
    ) : (
      <Navigate to="/lumens/app/lab-scheduler" replace={true} />
    );

  useEffect(() => {
    setPageTitle({ title: "Settings - Academic Duration" });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Academic Duration</title>
        <meta
          name="description"
          content="Masterlist of School Years and Semesters"
        />
      </Helmet>
      {pageContent}
    </>
  );
}

export default InternalPage;
