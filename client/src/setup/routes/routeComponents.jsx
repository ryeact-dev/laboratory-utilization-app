import { lazy } from "react";

export const Dashboard = lazy(() => import("@/pages/protected/Dashboard.jsx"));

// LABORATORY ROUTES
export const LabScheduler = lazy(
  () => import("@/pages/protected/LabScheduler"),
);
export const LabUtilization = lazy(
  () => import("@/pages/protected/LabUtilization"),
);

export const SubjectUtilizations = lazy(
  () => import("@/pages/protected/SubjectUtilizations"),
);

export const LabReservations = lazy(
  () => import("@/pages/protected/LabReservations"),
);

// REPORTS ROUTES
export const UtilizationsWeekly = lazy(
  () => import("@/pages/protected/UtilizationsWeekly"),
);
export const UtilizationsTerm = lazy(
  () => import("@/pages/protected/UtilizationsTerm"),
);
export const UtilizationsLabMonitoring = lazy(
  () => import("@/pages/protected/UtilizationsLabMonitoring"),
);
export const WeeklyReportByInstructor = lazy(
  () => import("@/pages/protected/UtilizationsWeeklyByInstructor"),
);
export const WeeklyReportByLaboratory = lazy(
  () => import("@/pages/protected/UtilizationsWeeklyByLaboratory"),
);
export const LaboratoryOrientation = lazy(
  () => import("@/pages/protected/LabOrientation"),
);

// MASTERLIST ROUTES
export const ListOfStudents = lazy(
  () => import("@/pages/protected/ListOfStudents"),
);
export const ListOfSubjects = lazy(
  () => import("@/pages/protected/ListOfSubjects"),
);
export const AddStudentsToSubject = lazy(
  () => import("@/pages/protected/Classlist"),
);
export const AcademicDuration = lazy(
  () => import("@/pages/protected/AcademicDuration"),
);

// INVENTORY ROUTES
export const Hardware = lazy(
  () => import("@/pages/protected/InventoryHardware"),
);
export const Software = lazy(
  () => import("@/pages/protected/InventorySoftware"),
);
export const BorrwerSlip = lazy(() => import("@/pages/protected/BorrowerSlip"));
export const StockCard = lazy(() => import("@/pages/protected/StockCard"));
export const SingleStockCard = lazy(
  () => import("@/pages/protected/SingleStockCard"),
);
export const SingleBorrowerSlip = lazy(
  () => import("@/pages/protected/SingleBorrowerSlip"),
);

// SETTINGS ROUTES
export const SettingsUsers = lazy(
  () => import("@/pages/protected/SettingsUsers"),
);
export const Page404 = lazy(() => import("@/pages/protected/404"));
// const Team = lazy(() => import("../../pages/protected/Team"));
