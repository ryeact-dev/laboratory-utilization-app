import routes from "@/setup/routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";
import DateWithTime from "@/common/digitalClock/DateWithTime";
import Footer from "@/common/footer/Footer";

export default function LeftSidebar({
  currentUser,
  onCloseSideBar,
  isSidebarOpen,
}) {
  const userRole = currentUser.role;
  const userLaboratory = currentUser.laboratory;

  // REMOVE THE USER SETTINGS IF NOT AN ADMIN
  let sidebarMenus = routes;
  if (userRole !== "Admin") {
    sidebarMenus = sidebarMenus.filter((menu) => menu.name !== "Settings");
    if (userRole == "Faculty" || userRole == "Program Head") {
      sidebarMenus = sidebarMenus.filter(
        (menu) => menu.name !== "Masterlist" && menu.name !== "Settings",
      );
    } else if (userRole == "Dean") {
      sidebarMenus = sidebarMenus.filter(
        (menu) => menu.name === "Laboratory" || menu.name === "Reports",
      );

      // if (currentUserData.user_role === 'STA') {
      //   sidebarMenus = sidebarMenus?.filter(
      //     (item) => item.name !== 'Masterlist'
      //   );
      // }
    }
  }

  // RENDER SECTION
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {sidebarMenus.map((route, i) => {
          return (
            <div key={i}>
              <SidebarSubmenu
                {...route}
                userRole={userRole}
                userLaboratory={userLaboratory}
                closeDrawer={onCloseSideBar}
                index={i}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-auto w-full">
        <DateWithTime
          dateClass="text-lg -mb-2"
          timeClass="text-3xl"
          className="mb-4 block sm:hidden"
        />
        <div className="my-2">
          <Footer />
        </div>
      </div>
    </div>
  );
}
