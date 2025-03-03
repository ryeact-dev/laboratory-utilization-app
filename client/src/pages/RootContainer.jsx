import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { Navigate } from "react-router-dom";

export default function RootContainer() {
  const { currentUser } = useGetCurrentUserData();

  if (currentUser === null) {
    return <Navigate to="/lumens/login" replace={true} />;
  } else return <Navigate to="/lumens/app/lab-scheduler" replace={true} />;
}
