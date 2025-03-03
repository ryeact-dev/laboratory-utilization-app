import UtilizationsWeeklyAttendanceSheetBody from "@/common/sheets/right-side-bar/labratory-reports/weekly-attendance/UtilizationsWeeklyAttendanceSheetBody";
import UtilizationsWeeklyMonitoringSheetBody from "@/common/sheets/right-side-bar/labratory-reports/weekly-monitoring/UtilizationsWeeklyMonitoringSheetBody";
import UtilizationsWeeklyByInstructorSheetlBody from "@/common/sheets/right-side-bar/labratory-reports/weekly-utilizations/UtilizationsWeeklyByInstructorSheetlBody";
import { Button } from "@/common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/ui/dropdown-menu";
import SheetContainer from "@/containers/SheetContainer";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { modalStore } from "@/store";
import {
  ClipboardList,
  Ellipsis,
  FileCheck,
  MonitorCheck,
  Trash,
} from "lucide-react";
import { useState } from "react";

export default function ReportsTableOptions({
  wasAcknowledged,
  weekDates,
  date,
  laboratory,
  schedule,
  selectedTermAndSem,
  currentUser,
  activeSchoolYear,
}) {
  const openModal = modalStore((state) => state.openModal);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dataObj, setDataObj] = useState({});
  const [componentName, setComponentName] = useState("");

  const onCloseModal = () => {
    setIsSheetOpen(false);
  };

  const filteredScheduleData = {
    instructor: schedule.instructor,
    instructor_name: schedule.instructor_name,
    code: schedule.code,
    title: schedule.title,
    sched_end_time: schedule.sched_end_time,
    sched_start_time: schedule.sched_start_time,
    subject_start_time: schedule.subject_start_time,
    subject_end_time: schedule.subject_end_time,
    is_regular_class: schedule.is_regular_class,
  };

  console.log(schedule);

  const onOpenSheetContainer = (componentName, subjectId) => {
    let payload = null;
    let forDeletionData = null;
    switch (componentName) {
      case "lab-utilizations":
        payload = {
          title: `Laboratory Utilizations`,
          subjectId,
          weekDates,
          date,
          laboratory,
          schedule,
          selectedTermAndSem,
          weekNumber: schedule?.week_number,
          isForAcknowledgement: wasAcknowledged ? false : true,
          currentUser,
          activeSchoolYear,
          className: "w-[750px]",
        };

        setComponentName(componentName);
        setDataObj(payload);
        setIsSheetOpen(true);
        break;

      case "lab-attendance":
        payload = {
          title: `Laboratory Attendance`,
          schedule: filteredScheduleData,
          weekDates,
          date,
          subjectId,
          laboratory,
          selectedTermAndSem,
          weekNumber: schedule?.week_number,
          currentUser,
          activeSchoolYear,
          className: "",
        };

        setComponentName(componentName);
        setDataObj(payload);
        setIsSheetOpen(true);
        break;

      case "lab-monitoring":
        payload = {
          title: `Laboratory Monitoring`,
          schedule: filteredScheduleData,
          weekDates,
          date,
          subjectId,
          laboratory,
          selectedTermAndSem,
          weekNumber: schedule?.week_number,
          currentUser,
          activeSchoolYear,
          className: "w-[700px]",
        };

        setComponentName(componentName);
        setDataObj(payload);
        setIsSheetOpen(true);
        break;

      case "delete-report":
        payload = {
          title: "Confirmation",
          bodyType: MODAL_BODY_TYPES.CONFIRMATION,
          extraObject: {
            message: `Delete ${schedule?.code} - ${schedule?.title} week ${schedule?.week_number} submission?`,
            type: CONFIRMATION_MODAL_CLOSE_TYPES.INSTRUCTOR_WEEKLY_USAGE_DELETE,
            forDeletionData: schedule?.id,
          },
        };

        openModal(payload);

        break;

      default:
        null;
    }
  };

  let childrenComponent = <></>;
  switch (componentName) {
    case "lab-utilizations":
      childrenComponent = (
        <UtilizationsWeeklyByInstructorSheetlBody dataObj={dataObj} />
      );
      break;

    case "lab-attendance":
      childrenComponent = (
        <UtilizationsWeeklyAttendanceSheetBody dataObj={dataObj} />
      );
      break;

    case "lab-monitoring":
      childrenComponent = (
        <UtilizationsWeeklyMonitoringSheetBody dataObj={dataObj} />
      );
      break;

    default:
      childrenComponent;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              onOpenSheetContainer("lab-utilizations", schedule.subject_id)
            }
          >
            <ClipboardList />
            Utilizations
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              onOpenSheetContainer("lab-attendance", schedule.subject_id)
            }
          >
            <FileCheck size={16} />
            Attendance
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              onOpenSheetContainer("lab-monitoring", schedule.subject_id)
            }
          >
            <MonitorCheck size={16} />
            Remarks
          </DropdownMenuItem>

          {(currentUser?.role === "Admin" ||
            currentUser?.role === "Custodian") && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onOpenSheetContainer("delete-report")}
              >
                <Trash size={16} />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <SheetContainer
        dataObj={dataObj}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        closeModal={onCloseModal}
      >
        {childrenComponent}
      </SheetContainer>
    </>
  );
}
