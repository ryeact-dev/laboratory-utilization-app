import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { WEEKLY_USER_ROLE_STEP } from "@/globals/initialValues";
import { useGetPaginatedReports } from "@/hooks/instructorWeeklyUsage.hook";
import { useGetSubmittedMISMNotifications } from "@/hooks/stockCardMISM.hook";
import { aggregatedUsageReports } from "@/lib/helpers/aggregatedUsageReports";
import NotificationListItems from "./components/notificationListItems/NotificationListItems";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover";
import { Button } from "@/common/ui/button";
import { useState } from "react";
import { Bell } from "lucide-react";

export default function Notifications({ currentUserData }) {
  const { currentUser, activeSchoolYear, activeTermSem } = currentUserData;

  const currentUseRoleStep = WEEKLY_USER_ROLE_STEP[currentUser?.role];
  const currentUserRole = currentUser?.role;

  // Weekly Subject Utilizations for Acknowledgement
  const {
    isLoading,
    data: submittedReports,
    error: reportError,
    isError: reprotIsError,
  } = useGetPaginatedReports({
    page: 0,
    reportCount: 200,
    userRole: currentUser?.role,
    selectedTermAndSem: activeTermSem,
    userRoleStep: currentUseRoleStep,
    wasAcknowledged: false,
  });
  reprotIsError && ToastNotification("error", reportError?.response.data);

  // aggregated weekly subject utilization reports
  const aggregatedReports = aggregatedUsageReports(submittedReports?.reports);

  const { data: forAcknowledgement } =
    useGetSubmittedMISMNotifications(activeSchoolYear);

  const reportsCount =
    currentUser?.role === "Admin"
      ? forAcknowledgement?.length
      : aggregatedReports?.length;

  // Add state to control popover
  const [open, setOpen] = useState(false);

  const listItems =
    currentUser?.role === "Admin" ? forAcknowledgement : aggregatedReports;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="size-10 rounded-full">
            <div className="relative">
              <Bell />
              {reportsCount > 0 && (
                <span className="absolute -right-3 top-2 flex size-5 items-center justify-center rounded-full bg-primary">
                  <p className="text-[10px]">{reportsCount}</p>
                </span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 overflow-hidden p-1">
          {listItems?.length > 0 ? (
            <>
              <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                <div className="text-sm font-semibold">Notifications</div>
              </div>
              <div
                role="separator"
                aria-orientation="horizontal"
                className="-mx-1 my-1 h-px bg-border"
              ></div>
              <div
                className="scrollbar mb-2 max-h-80 min-h-16 overflow-x-auto"
                id="scroll-bar-design"
              >
                <NotificationListItems
                  userRole={currentUserRole}
                  isLoading={isLoading}
                  listItems={listItems}
                  onItemClick={() => setOpen(false)}
                />
              </div>
            </>
          ) : (
            <p className="p-2 text-xs">No Notifications</p>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
