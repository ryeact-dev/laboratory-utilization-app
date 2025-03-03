import { LIST_OF_ALLOWED_USERS } from "@/globals/initialValues";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { Navigate } from "react-router-dom";

export default function AuthorizedPage({ children }) {
  const { currentUser } = useGetCurrentUserData();

  const isUserAllowed = LIST_OF_ALLOWED_USERS.includes(currentUser.role);

  const pageContent = isUserAllowed ? (
    children
  ) : (
    <Navigate to="/lumens/app/lab-scheduler" replace={true} />
  );

  return pageContent;
}
