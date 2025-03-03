import { modalStore } from "@/store";
import { MODAL_BODY_TYPES } from "@/globals/globalConstantUtil";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import {
  ArrowLeftRight,
  CalendarPlus,
  CalendarSearch,
  Menu,
} from "lucide-react";

export default function SchedulerMenuOptions({
  scheduleObj,
  laboratory,
  termSemStartingDate,
  termSemEndingDate,
  currentUser,
  usersAllowedToViewSchedule,
  selectedTermAndSem,
  activeSchoolYear,
}) {
  const openModal = modalStore((state) => state.openModal);

  const userCanSheduleRegularClass =
    currentUser.role === "Admin" ||
    currentUser.role === "Custodian" ||
    currentUser.role === "STA";

  const openAddNewScheduleModal = () => {
    // const title = userCanSheduleRegularClass
    //   ? 'Add New Schedule'
    //   : 'Add New Reservation';

    if (!termSemStartingDate || !termSemEndingDate) {
      ToastNotification(
        "error",
        "Please set Starting and Ending Dates for this term",
      );
      return;
    } else if (!laboratory) {
      ToastNotification("error", "Please select a laboratory first");
      return;
    } else {
      const payload = {
        title: "Add Schedule",
        bodyType: MODAL_BODY_TYPES.SCHEDULE_ADD_NEW,
        extraObject: {
          scheduleObj,
          laboratory,
          currentUser,
          isUpdateSchedule: false,
          scheduleData: null,
        },
        size: "max-w-lg",
      };

      openModal(payload);
    }
  };

  const openTransferScheduleModal = () => {
    // const title = userCanSheduleRegularClass
    //   ? 'Add New Schedule'
    //   : 'Add New Reservation';

    if (!termSemStartingDate || !termSemEndingDate) {
      ToastNotification(
        "error",
        "Please set Starting and Ending Dates for this term",
      );
      return;
    } else if (!laboratory) {
      ToastNotification("error", "Please select a laboratory first");
      return;
    } else {
      const payload = {
        title: "Transfer Schedule",
        bodyType: MODAL_BODY_TYPES.SCHEDULE_TRANSFER,
        extraObject: {
          scheduleObj,
          laboratory,
          currentUser,
          selectedTermAndSem,
          activeSchoolYear,
        },
        size: "max-w-lg",
      };

      openModal(payload);
    }
  };

  const openReserveScheduleModal = () => {
    const payload = {
      title: "Reservation Details",
      bodyType: MODAL_BODY_TYPES.SCHEDULE_RESERVATION,
      extraObject: {
        scheduleObj,
        laboratory,
        currentUser,
        selectedTermAndSem,
        activeSchoolYear,
      },
      size: "max-w-lg",
    };

    openModal(payload);
  };

  const isAllowedToReserve = [...usersAllowedToViewSchedule]
    .slice(0, 2)
    .includes(currentUser.role);

  const isAllowedToTransferSchedule = usersAllowedToViewSchedule.includes(
    currentUser.role,
  );

  // console.log(usersAllowedToViewSchedule);
  // console.log(usersAllowedToViewSchedule?.splice(0, 2));
  // console.log(isAllowedToReserve);

  // RENDER SECTION
  return (
    <div className="mt-4 flex flex-col justify-center gap-2 md:mt-0 md:flex-row md:justify-end">
      {/* {userCanSheduleRegularClass && ( */}

      <DropdownMenu className="">
        <DropdownMenuTrigger asChild>
          <Button
            aria-haspopup="true"
            variant="secondary"
            className="px-6 font-semibold"
            disabled={laboratory === ""}
          >
            <Menu className="h-4 w-4" /> Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 px-3 py-2">
          <DropdownMenuItem
            disabled={isAllowedToReserve}
            className="text-base hover:!bg-primary/50"
            onClick={() =>
              openAddNewScheduleModal(termSemStartingDate, termSemEndingDate)
            }
          >
            <CalendarPlus size={20} strokeWidth={2.5} />
            Add Schedule
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isAllowedToReserve}
            className="text-base hover:!bg-primary/50"
            onClick={() => openReserveScheduleModal()}
          >
            <CalendarSearch size={20} strokeWidth={2.5} />
            Reserve Schedule
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-base hover:!bg-primary/50"
            disabled={isAllowedToTransferSchedule}
            onClick={() =>
              openTransferScheduleModal(termSemStartingDate, termSemEndingDate)
            }
          >
            <ArrowLeftRight size={20} strokeWidth={2.5} /> Transfer/Update
            Schedule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <>
        {!isAllowedToTransferSchedule && (
          <Button
            variant="secondary"
            className="px-6"
            onClick={() =>
              openTransferScheduleModal(termSemStartingDate, termSemEndingDate)
            }
          >
            <LuArrowLeftRight size={20} strokeWidth={2.5} /> Transfer Schedule
          </Button>
        )}
        {currentUser.role !== "Dean" && (
          <Button
            variant="secondary"
            className="px-6"
            onClick={() => onAddScheduleBtnClick()}
          >
            <LuCalendarPlus size={20} strokeWidth={2.5} />
            {isAllowedToReserve ? "Add Reservation" : "Add Schedule"}
          </Button>
        )}
      </> */}
    </div>
  );
}
