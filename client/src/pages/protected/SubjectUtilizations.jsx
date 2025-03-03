import { useEffect } from "react";
import { headerStore } from "@/store";
import SubjectUtilizations from "@/features/laboratory/subejctUitilizations/SubjectUtilizations";
import { Helmet } from "react-helmet";
import { useGetCurrentUserData } from "@/hooks/users.hook";

function InternalPage() {
  const setPageTitle = headerStore((state) => state.setPageTitle);

  const { currentUser } = useGetCurrentUserData();

  useEffect(() => {
    setPageTitle({ title: "Laboratory - Subject Utilizations" });
  }, []);

  return (
    <>
      <Helmet>
        <title>LUMENS | Laboratory - Subject Utilizations</title>
        <meta
          name="description"
          content="LUMENS Laboratory subject's utilizations"
        />
      </Helmet>
      <SubjectUtilizations currentUser={currentUser} />
    </>
  );
}

export default InternalPage;
