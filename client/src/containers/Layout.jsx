import { lazy, Suspense, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import Header from "@/common/header/Header";
import PrivacyActAgreementModal from "@/common/privacy-act-agreement-modal/PrivacyActAgreementModal";
import { Navigate, useRevalidator } from "react-router-dom";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { socket } from "@/lib/helpers/socketIo";

const PageContent = lazy(() => import("./PageContent"));

export default function Layout() {
  const processedUserData = useGetCurrentUserData();
  const revalidator = useRevalidator();

  // Revalidate the route when the user is updated
  useEffect(() => {
    const handleUserUpdate = () => {
      revalidator.revalidate();
    };
    socket.on("user:updated", handleUserUpdate);
    return () => socket.off("user:updated", handleUserUpdate);
  }, [revalidator]);

  // Reload the page when socket emits a page:reload event
  useEffect(() => {
    const handlePageReload = () => {
      if (document.forms.length > 0) {
        // Check for unsaved forms
        if (confirm("You have unsaved changes. Reload anyway?")) {
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
    };
    socket.on("page:reload", handlePageReload);
    return () => socket.off("page:reload", handlePageReload);
  }, []);

  // Handle unauthenticated users
  if (processedUserData?.currentUser === null) {
    return <Navigate to="/lumens/login" />;
  }

  const isAdmin = processedUserData?.currentUser?.role === "Admin";

  const isSta = processedUserData?.currentUser?.role === "STA";

  // RENDER SECTION
  return (
    <>
      <article
        className={`max-h-[calc(100vh)] overflow-x-auto overflow-y-hidden`}
      >
        <div className="overflow-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-neutral-800 to-background">
          <Header currentUserData={processedUserData} />
          <Suspense fallback={<LoadingSpinner />}>
            <PageContent />
          </Suspense>

          {isAdmin && isSta && <PrivacyActAgreementModal />}
        </div>
      </article>
      <ModalLayout />
    </>
  );
}
