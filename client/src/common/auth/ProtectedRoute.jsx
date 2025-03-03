import { Navigate } from "react-router-dom";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

export default function ProtectedRoute({ children, isLoading, currentUser }) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return currentUser ? children : <Navigate to="/lumens/login" />;
}
