import UtilizationsWeeklyAttendanceSheetBody from "@/common/sheets/right-side-bar/labratory-reports/weekly-attendance/UtilizationsWeeklyAttendanceSheetBody";
import UtilizationsWeeklyMonitoringSheetBody from "@/common/sheets/right-side-bar/labratory-reports/weekly-monitoring/UtilizationsWeeklyMonitoringSheetBody";
import UtilizationsWeeklyByInstructorSheetlBody from "@/common/sheets/right-side-bar/labratory-reports/weekly-utilizations/UtilizationsWeeklyByInstructorSheetlBody";

import { Card, CardContent } from "@/common/ui/card";
import { Label } from "@/common/ui/label";
import UtilizationHeader from "@/common/utilizationHeader/UtilizationHeader";
import SheetContainer from "@/containers/SheetContainer";
import { calculateUsageTime } from "@/lib/helpers/dateTime";
import ReportsUtilizationCardOptions from "../reports-utilization-card-options/ReportsUtilizationCardOptions";
import { useState } from "react";
import {
  CalendarCheck,
  CalendarFold,
  CalendarRange,
  UsersRound,
} from "lucide-react";
import AddManualUtilizationSheetBody from "@/common/sheets/right-side-bar/labratory-reports/add-manual-utilization/AddManualUtilizationSheetBody";

export default function ReportsUtilizationCard({
  usage,
  weekDates,
  date,
  laboratory,
  schedule,
  selectedTermAndSem,
  step,
  isSelected,
  setSelectReport,
  weekNumber,
  currentUser,
  activeSchoolYear,
  termSemStartingDate,
  isLoadingTermdates,
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dataObj, setDataObj] = useState({});
  const [componentName, setComponentName] = useState("");

  const onCloseModal = () => {
    setIsSheetOpen(false);
  };

  const { subject_id, program } = schedule;

  const filteredScheduleData = {
    id: schedule.id,
    instructor: schedule.instructor,
    instructor_name: schedule.instructor_name,
    code: schedule.code,
    title: schedule.title,
    sched_end_time: schedule.sched_end_time,
    sched_start_time: schedule.sched_start_time,
    subject_id: schedule.subject_id,
    students: schedule.students,
    subject_start_time: schedule.subject_start_time,
    subject_end_time: schedule.subject_end_time,
    is_regular_class: schedule.is_regular_class,
    recurrence_rule: schedule.recurrence_rule,
    isSemestral: schedule.isSemestral,
  };

  const onOpenSheetContainer = (componentName) => {
    let payload = null;

    switch (componentName) {
      case "lab-utilizations":
        payload = {
          title: `Laboratory Utilizations`,
          schedule,
          weekDates,
          date,
          laboratory,
          selectedTermAndSem,
          step,
          weekNumber: isLoadingTermdates
            ? 0
            : Number(weekNumber(filteredScheduleData.isSemestral)),
          activeSchoolYear,
          termSemStartingDate,
          currentUser,
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
          subjectId: subject_id,
          laboratory,
          selectedTermAndSem,
          weekNumber: isLoadingTermdates
            ? 0
            : Number(weekNumber(filteredScheduleData.isSemestral)),
          activeSchoolYear,
          termSemStartingDate,
          currentUser,
          className: "w-[900px]",
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
          subjectId: subject_id,
          laboratory,
          selectedTermAndSem,
          weekNumber: isLoadingTermdates
            ? 0
            : Number(weekNumber(filteredScheduleData.isSemestral)),
          activeSchoolYear,
          termSemStartingDate,
          currentUser,
          className: "w-[700px]",
        };

        setComponentName(componentName);
        setDataObj(payload);
        setIsSheetOpen(true);

        break;

      case "add-manual-utilization":
        payload = {
          title: "Add Manual Utilization",
          schedule: { ...filteredScheduleData, laboratory },
          selectedTermAndSem,
          weekNumber: isLoadingTermdates
            ? 0
            : Number(weekNumber(filteredScheduleData.isSemestral)),
          activeSchoolYear,
          termSemStartingDate,
          currentUser,
          className: "w-[500px]",
        };

        setComponentName(componentName);
        setDataObj(payload);
        setIsSheetOpen(true);

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

    case "add-manual-utilization":
      childrenComponent = <AddManualUtilizationSheetBody dataObj={dataObj} />;
      break;

    default:
      childrenComponent;
  }

  const onCheckedChange = () => {
    setSelectReport((prev) => {
      if (isSelected) {
        return prev.filter((id) => id !== schedule.subject_id);
      } else {
        return [...prev, schedule.subject_id];
      }
    });
  };

  const termSchedule = schedule?.term_sem.split(" - ")[0];

  // RENDER SECTION
  return (
    <Card className="w-full overflow-hidden border-[1px] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-card to-background/50">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="flex-[2]">
            {step && (
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2 p-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onCheckedChange}
                    className="checkbox-success checkbox checkbox-sm rounded-md"
                  />
                  <span className="label-text">Select</span>
                </label>
              </div>
            )}
            <UtilizationHeader
              headerData={schedule}
              titleClass={"text-lg font-semibold"}
              profClass={"text-lg text-yellow-200 mb-1"}
              timeClass={"text-sm font-normal text-gray-300"}
              titleIconSize={16}
              profIconSize={16}
              timeIconSize={16}
            />

            <div className="my-1.5 flex items-center gap-4">
              <Label className="flex flex-1 items-center gap-2 font-normal text-gray-300">
                <UsersRound size={16} />
                {program}
              </Label>

              <Label className="flex flex-1 items-center gap-2 font-normal text-gray-300">
                <CalendarFold size={16} />
                {schedule?.isSemestral ? "Semestral" : termSchedule}
              </Label>
            </div>

            <div className="flex items-center gap-4">
              <Label className="flex flex-1 items-center gap-2 font-normal text-gray-300">
                <CalendarCheck size={16} />
                {usage
                  ? calculateUsageTime(usage.usage_hours)
                  : "No Utilization"}
              </Label>
              <Label className="flex flex-1 items-center gap-2 font-normal text-gray-300">
                <CalendarRange size={16} />
                {`Week ${isLoadingTermdates ? "loading" : weekNumber(schedule.isSemestral)}`}
              </Label>
            </div>
          </div>

          <div className="flex h-full items-start justify-start">
            <ReportsUtilizationCardOptions
              currentUser={currentUser}
              onOpenSheetContainer={onOpenSheetContainer}
            />
          </div>
        </div>
      </CardContent>

      <SheetContainer
        dataObj={dataObj}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        closeModal={onCloseModal}
      >
        {childrenComponent}
      </SheetContainer>
    </Card>
  );
}
