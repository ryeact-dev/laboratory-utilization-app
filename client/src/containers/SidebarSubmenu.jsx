import {
  LABS_NEED_HARDWARE_LIST,
  LIST_OF_ALLOWED_USERS,
  USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE,
} from "@/globals/initialValues";
import { NavLink, useLocation } from "react-router-dom";

export default function SidebarSubmenu({
  submenu,
  name,
  userRole,
  userLaboratory,
  closeDrawer,
}) {
  const location = useLocation();

  const path = location.pathname;
  // This is the path that will be used to check if the current path is the same as the submenu path ie. /lumens/app/laboratory/class-utilization
  const currentPath = `/${path.split("/")[1]}/${path.split("/")[2]}/${path.split("/")[3]}`;

  const isThisRoleAllowed =
    USER_ONLY_FOR_VIEWING_AND_ACKNOWLEDGE.includes(userRole);

  let filteredSubMenu = submenu;

  // This functions filters the sublinks to what will be appears in the sidebar depends on user role
  if (name === "Laboratory" && isThisRoleAllowed) {
    if (
      userRole === "Faculty" ||
      userRole === "Program Head" ||
      userRole === "Dean"
    ) {
      filteredSubMenu = submenu?.filter(
        (item) => item.name !== "Class Utilization",
      );
    }
  } else if (name === "Reports" && isThisRoleAllowed) {
    // If Program Head include the laboratory usage page
    if (userRole === "Program Head" || userRole === "Dean") {
      filteredSubMenu = submenu?.filter(
        (item) =>
          item.name === "Acknowledgement" ||
          item.name === "Utilization Summary",
      );
    } else if (userRole === "Faculty") {
      filteredSubMenu = submenu?.filter(
        (item) => item.name === "Acknowledgement",
      );
    } else {
      // filteredSubMenu = submenu?.filter(
      //   (item) =>
      //     item.name !== "Acknowledgement" && item.name !== "Laboratory Usage",
      // );

      filteredSubMenu = submenu?.filter(
        (item) => item.name !== "Laboratory Usage",
      );
    }
  } else {
    filteredSubMenu = submenu?.filter(
      (item) =>
        item.name !== "Acknowledgement" && item.name !== "Laboratory Usage",
    );
  }

  if (name === "Masterlist" && userRole !== "Admin") {
    filteredSubMenu = submenu?.filter(
      (item) => item.name !== "Academic Duration",
    );
  }

  if (name === "Inventory" && userRole !== "Admin") {
    const isLaboratoryNeedHardwaresList = userLaboratory.some((lab) =>
      LABS_NEED_HARDWARE_LIST.includes(lab),
    );

    if (
      !isLaboratoryNeedHardwaresList ||
      !LIST_OF_ALLOWED_USERS.includes(userRole)
    ) {
      filteredSubMenu = submenu?.filter(
        (item) => item.name !== "Hardware" && item.name !== "Software",
      );

      if (userRole === "Faculty" || userRole === "Program Head") {
        filteredSubMenu = filteredSubMenu?.filter(
          (item) => item.name === "Borrower Slip",
        );
      }
    }
  }

  // RENDER SECTION
  return (
    <div
      className={`flex flex-col bg-transparent hover:!cursor-default hover:!bg-transparent`}
    >
      <div className="-ml-2 mb-3.5 mt-5 w-full text-sm font-semibold">
        {name}
      </div>

      <ul className={`menu-compact menu -my-3 w-full px-3 text-sm`}>
        {filteredSubMenu?.map((m, k) => {
          return (
            <li key={k} className={`w-full`}>
              <NavLink
                end
                to={m.path}
                onClick={() => closeDrawer()}
                className={`${
                  currentPath === m.path
                    ? `rounded-md !font-medium text-secondary opacity-100`
                    : "opacity-80 hover:!bg-transparent hover:!text-secondary hover:opacity-100 focus:!text-secondary"
                } -ml-5 flex gap-1 px-2 py-1 text-xs font-thin transition duration-300 ease-in-out`}
              >
                {m.icon} {m.name}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

//   <div
//   className={`collapse collapse-plus bg-transparent hover:!cursor-default hover:!bg-transparent p-1`}
// >
//   <input type='radio' name='accordion-menu' />
//   {/** ROUTE HEADER */}
//   <div className='collapse-title text-xs text-accent font-medium tracking-wider hover:!bg-primary '>
//     {icon} {name}
//   </div>
//   {/** SUBMIT LIST */}
//   <div className='collapse-content -mt-6'>
//     {filteredSubMenu?.map((m, k) => {
//       return (
//         <div
//           key={k}
//           className={`${
//             currentPath === m.path ? '' : 'md:nav-link md:after:-ml-2'
//           } w-24`}
//         >
//           <NavLink
//             end
//             to={m.path}
//             onClick={() => closeDrawer()}
//             className={`${
//               currentPath === m.path
//                 ? `!text-white !font-normal !bg-primary rounded-md hover:!text-white w-48`
//                 : 'hover:!bg-transparent hover:!text-blue-eraser focus:!text-primary'
//             } -ml-2 pl-2 font-thin transition duration-500 ease-in-out py-2 text-white text-xs flex gap-2 w-48 `}
//           >
//             {m.icon} {m.name}
//           </NavLink>
//         </div>
//       );
//     })}
//   </div>
// </div>
