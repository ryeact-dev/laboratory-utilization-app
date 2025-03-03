import { headerStore } from "@/store";
import AvatarProfile from "./components/AvatarProfile";
import MenuBar from "./components/MenuBar";
import UserMenu from "./components/UserMenu";
import DateWithTime from "@/common/digitalClock/DateWithTime";
import Notifications from "./components/notifications/Notifications";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGetSocketData } from "@/lib/helpers/socketIo";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import { Suspense } from "react";

function Header({ currentUserData }) {
  const currentUser = currentUserData?.currentUser;
  const pageTitle = headerStore((state) => state.pageTitle);

  const { data: onlineUsers } = useGetSocketData("online-users");

  const isOnline = (userId) => {
    const userIsOnline = onlineUsers?.some(
      (onlineUser) => onlineUser.userId === userId,
    );
    return userIsOnline;
  };

  const fallback = (
    <div className="flex size-10 items-center rounded-full border">
      <LoadingSpinner />
    </div>
  );

  // RENDER SECTION
  return (
    <article className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-background/80 bg-background/50 py-1 shadow-none backdrop-blur-md">
      {/* Menu toogle for mobile view or small screen */}
      <div className="flex-1">
        <Suspense fallback={fallback}>
          <MenuBar currentUser={currentUser} />
        </Suspense>
      </div>
      <div>
        <h1 className="hidden text-xl font-semibold tracking-wide text-blue-500 sm:flex-1 lg:block lg:text-2xl">
          {pageTitle}
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <DateWithTime
          dateClass="text-xs -mb-1"
          timeClass="text-lg"
          className="hidden w-fit pt-2 tabular-nums sm:block"
        />
        <div className="flex items-center gap-1.5">
          <Suspense fallback={fallback}>
            <Notifications currentUserData={currentUserData} />
          </Suspense>

          <Suspense fallback={fallback}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`bg-base-300 flex items-center justify-center rounded-full ${
                    currentUser?.photoURL ? "mr-2 h-9 w-9" : "mr-1 h-10 w-10"
                  }`}
                >
                  <AvatarProfile
                    isOnline={isOnline(currentUser?.userId)}
                    currentUser={currentUser}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <UserMenu currentUser={currentUser} />
              </DropdownMenuContent>
            </DropdownMenu>
          </Suspense>
        </div>
      </div>
    </article>
  );
}

export default Header;
