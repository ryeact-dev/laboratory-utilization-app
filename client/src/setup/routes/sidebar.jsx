import {
  AppWindow,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CircleCheck,
  ClipboardList,
  ClipboardPen,
  Computer,
  Files,
  FileStack,
  FileText,
  Folders,
  LayoutDashboard,
  Users,
  UsersRound,
} from "lucide-react";

const routes = [
  {
    path: "",
    name: "Laboratory",
    submenu: [
      {
        path: "/lumens/app/lab-scheduler",
        icon: <CalendarClock size={15} />,
        name: "Schedule",
      },
      {
        path: "/lumens/app/subject-utilizations",
        icon: <LayoutDashboard size={15} />,
        name: "Subject Utilizations",
      },
      {
        path: "/lumens/app/lab-utilization",
        icon: <CalendarCheck size={15} />,
        name: "Class Utilization",
      },
      // {
      //   path: "/lumens/app/lab-reservations",
      //   icon: <LuLayoutDashboard size={15} />,
      //   name: "Reservations",
      // },
    ],
  },
  {
    path: "", //no url needed as this has submenu
    name: "Reports", // name that appear in Sidebar
    submenu: [
      {
        path: "/lumens/app/reports-utilizations-weekly",
        icon: <FileText size={15} />,
        name: "Utilization Monitoring",
      },
      {
        path: "/lumens/app/reports-utilizations-term",
        icon: <FileStack size={15} />,
        name: "Utilization Summary",
      },
      {
        path: "/lumens/app/reports-laboratory-orientation",
        icon: <Files size={15} />,
        name: "Laboratory Orientation",
      },

      {
        path: "/lumens/app/reports-utilizations-weekly-instructor",
        icon: <CircleCheck size={15} />,
        name: "Acknowledgement",
      },
      {
        path: "/lumens/app/reports-utilizations-weekly-laboratory",
        icon: <Computer size={15} />,
        name: "Laboratory Usage",
      },
    ],
  },
  {
    path: "",
    name: "Masterlist",
    submenu: [
      {
        path: "/lumens/app/students",
        icon: <Users size={15} />,
        name: "Students",
      },
      {
        path: "/lumens/app/subjects",
        icon: <Folders size={15} />,
        name: "Subjects",
      },
      {
        path: "/lumens/app/academic-duration",
        icon: <CalendarDays size={15} />,
        name: "Academic Duration",
      },
    ],
  },
  {
    path: "",
    name: "Inventory",
    submenu: [
      {
        path: "/lumens/app/inventory-hardware",
        icon: <Computer size={15} />,
        name: "Hardware",
      },
      {
        path: "/lumens/app/inventory-software",
        icon: <AppWindow size={15} />,
        name: "Software",
      },
      {
        path: "/lumens/app/inventory-borrower-slip",
        icon: <ClipboardList size={15} />,
        name: "Borrower Slip",
      },
      {
        path: "/lumens/app/inventory-stock-card",
        icon: <ClipboardPen size={15} />,
        name: "Stock Card",
      },
    ],
  },
  {
    path: "",
    name: "Settings",
    submenu: [
      {
        path: "/lumens/app/settings-users",
        icon: <UsersRound size={15} />,
        name: "Users",
      },
    ],
  },
];

export default routes;
