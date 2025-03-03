// All components mapping with path for internal routes

import {
  AcademicDuration,
  AddStudentsToSubject,
  Dashboard,
  Hardware,
  LabScheduler,
  LabUtilization,
  ListOfStudents,
  ListOfSubjects,
  Page404,
  SettingsUsers,
  Software,
  UtilizationsTerm,
  UtilizationsWeekly,
  UtilizationsLabMonitoring,
  WeeklyReportByInstructor,
  WeeklyReportByLaboratory,
  SubjectUtilizations,
  BorrwerSlip,
  StockCard,
  SingleStockCard,
  SingleBorrowerSlip,
  LabReservations,
  LaboratoryOrientation,
} from "./routeComponents";

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },

  // LABORATORY

  {
    path: "/lab-scheduler",
    component: LabScheduler,
  },

  {
    path: "/lab-utilization",
    component: LabUtilization,
  },

  {
    path: "/subject-utilizations",
    component: SubjectUtilizations,
  },

  {
    path: "/lab-reservations",
    component: LabReservations,
  },

  {
    path: "/subject-utilizations",
    component: SubjectUtilizations,
  },

  // REPORTS
  {
    path: "/reports-utilizations-weekly",
    component: UtilizationsWeekly,
  },
  {
    path: "/reports-utilizations-term",
    component: UtilizationsTerm,
  },
  {
    path: "/reports-utilizations-weekly/monitoring/:subjectId",
    component: UtilizationsLabMonitoring,
  },
  {
    path: "/reports-utilizations-weekly-instructor",
    component: WeeklyReportByInstructor,
  },
  {
    path: "reports-utilizations-weekly-laboratory",
    component: WeeklyReportByLaboratory,
  },
  {
    path: "reports-laboratory-orientation",
    component: LaboratoryOrientation,
  },

  // MASTERLIST
  {
    path: "/students",
    component: ListOfStudents,
  },
  {
    path: "/subjects",
    component: ListOfSubjects,
  },
  {
    path: "/subjects/:subjectId",
    component: AddStudentsToSubject,
  },
  {
    path: "/academic-duration",
    component: AcademicDuration,
  },

  // INVENTORY
  {
    path: "/inventory-hardware",
    component: Hardware,
  },
  {
    path: "/inventory-software",
    component: Software,
  },
  {
    path: "/inventory-borrower-slip",
    component: BorrwerSlip,
  },
  {
    path: "/inventory-single-borrower-slip/:id",
    component: SingleBorrowerSlip,
  },
  {
    path: "/inventory-stock-card",
    component: StockCard,
  },
  {
    path: "/inventory-stock-card/:id",
    component: SingleStockCard,
  },

  // SETTINGS
  {
    path: "/settings-users",
    component: SettingsUsers,
  },

  {
    path: "/404",
    component: Page404,
  },
];

export default routes;
