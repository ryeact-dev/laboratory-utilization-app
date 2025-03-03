import { useGetCurrentUserData } from "@/hooks/users.hook";
import { ArchiveX } from "lucide-react";
import { Helmet } from "react-helmet";

import { Navigate, useRouteError } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();

  const { currentUser } = useGetCurrentUserData();

  if (currentUser === null)
    return <Navigate to="/lumens/login" replace={true} />;
  // RENDER SECTION
  return (
    <>
      <Helmet>
        <title>LUMENS | Server 500 Error</title>
        <meta name="description" content="Server 500 Error" />
      </Helmet>
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <ArchiveX size={24} className="text-secondary" />
          <h2 className="text-xl font-medium text-secondary">
            Server 500 Error
          </h2>
        </div>
        {currentUser.role === "Admin" && (
          <p className="my-2 font-medium">{error.message}</p>
        )}
        <p>
          Go back to{" "}
          <a
            href="/lumens/app/lab-scheduler"
            className="text-green font-medium tracking-wide"
          >
            Laboratory Schedule
          </a>
        </p>
      </div>
    </>
  );
}
