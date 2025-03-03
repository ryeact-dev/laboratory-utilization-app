import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import initializeApp from "./setup/init";
import { Toaster } from "sonner";
import ErrorBoundary from "./pages/ErrorBoundary";
import LoadingSpinner from "./common/loadingSpinner/LoadingSpinner";

import Login from "./features/login/Login";
import Layout from "./containers/Layout";

import RootContainer from "./pages/RootContainer";
import { getCurrentUserData } from "./api/users.api";

// Initializing different libraries
initializeApp();

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/lumens/",
      loader: () => getCurrentUserData(),
      errorElement: <ErrorBoundary />,
      element: <RootContainer />,
    },
    { path: "/lumens/login", element: <Login /> },
    {
      path: "/lumens/app/*",
      loader: () => getCurrentUserData(),
      errorElement: <ErrorBoundary />,
      element: <Layout />,
    },
  ]);

  return (
    <main className="font-poppins">
      <Toaster richColors position="top-center" visibleToasts={5} />
      <RouterProvider router={router} />
    </main>
  );
}
