import { useState } from "react";
import ReportHeader from "../report-header/ReportHeader";
import { DatePicker } from "@/common/date-picker/DatePicker";
import { format } from "date-fns";
import {
  calculateUsageTime,
  getUsageTimeAndDate,
} from "@/lib/helpers/dateTime";
import { Clock } from "lucide-react";
import { Badge } from "@/common/ui/badge";
import StartClassButton from "./components/manual-utilization-buttons/start-class-button/StartClassButton";
import { modalStore } from "@/store";
import { useGetLaboratoryUtilizations } from "@/hooks/utilizations.hook";
import { checkSubjectUsage } from "@/lib/helpers/checkSubjectUsage";
import ManualUtilizationTimestamps from "./components/manual-utilization-timestamps/ManualUtilizationTimestamps";
import LoadingSpinner from "@/common/loadingSpinner/LoadingSpinner";
import ClasslistButton from "./components/manual-utilization-buttons/classlist-button/ClasslistButton";
import AddUsageRemarkButton from "./components/manual-utilization-buttons/add-usage-remark-button/AddUsageRemarkButton";
import { useGetListOfRemarks } from "@/hooks/remarks.hook";
import EndClassButton from "./components/manual-utilization-buttons/end-class-button/EndClassButton";
import CancelClassButton from "./components/manual-utilization-buttons/cancel-class-button/CancelClassButton";

// TODO: FINISH THIS SHEET. IT IS NOT WORKING
// TODO: PERSIST THE DATA  SO WHEN REFRESH IT IS NOT LOST BUT CHECK FIRST IS SAME SCHEDULED ID. IF NOT IT MEANS IT HAS CHANGED

export default function AddManualUtilizationSheetBody({ dataObj }) {
  const openModal = modalStore((state) => state.openModal);

  const {
    schedule,
    selectedTermAndSem,
    weekNumber,
    currentUser,
    activeSchoolYear,
  } = dataObj;

  const minDate = new Date("2021-01-01");
  const currentDate = new Date();

  const [usageDate, setUsageDate] = useState(currentDate);

  // Fetch the list of usages for the selected schedule
  const { isLoading: isLoadingUsage, data: listOfUsage = [] } =
    useGetLaboratoryUtilizations(
      schedule.laboratory,
      activeSchoolYear,
      selectedTermAndSem,
      [schedule.id],
    );

  // Filter-out the list of usages for the selected date and extract the usage details
  const { noUsage, usageId, usageStartTime, usageEndTime } =
    checkSubjectUsage(
      schedule.id,
      schedule.is_regular_class,
      listOfUsage || [],
      "1",
      usageDate,
    ) || {};

  // Fetch the list of remarks for the selected usage
  const { isLoading: isLoadingRemarks, data: listOfRemarks = [] } =
    useGetListOfRemarks(usageId);

  const formatUsageDateAndTime = (time) => {
    const selectedDate = format(usageDate, "yyyy-MM-dd");

    const formattedDateAndTime = new Date(
      `${selectedDate} ${time.hr}:${time.mins} ${time.ampm}`,
    );

    return formattedDateAndTime;
  };

  const formattedDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const onDateChange = (date) => {
    setUsageDate(date);
  };

  const {
    schedEndHour,
    schedStartHour,
    tempTotalUsageTime,
    usageEndAMPM,
    usageEndHour,
    usageEndMinute,
    usageStartAMPM,
    usageStartHour,
    usageStartMinute,
  } =
    getUsageTimeAndDate({
      ...schedule,
      end_time: schedule.sched_end_time,
      start_time: schedule.sched_start_time,
    }) || {};

  const [totalUsageTime, setTotalUsageTime] = useState(tempTotalUsageTime);
  const [startTime, setStartTime] = useState({
    hr: usageStartHour,
    mins: usageStartMinute,
    ampm: usageStartAMPM,
  });

  const [endTime, setEndTime] = useState({
    hr: usageEndHour,
    mins: usageEndMinute,
    ampm: usageEndAMPM,
  });

  return (
    <div>
      <ReportHeader
        schedule={schedule}
        weekNumber={weekNumber}
        isLabOrientation
      />
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h2 className="mb-1 text-secondary">Utilization Date</h2>
          <DatePicker
            date={usageDate}
            setDate={onDateChange}
            formattedDate={formattedDate}
            minDate={minDate}
          />
        </div>
        <div className="flex-1">
          <h2 className="mb-1 text-secondary">Class Utilization </h2>
          <Badge variant={""} className={"px-11 hover:!bg-primary"}>
            <Clock size={16} strokeWidth={3} />
            <p className="py-1 pl-1 text-sm font-medium">
              {calculateUsageTime(totalUsageTime)}
            </p>
          </Badge>
        </div>
      </div>

      {/* Time Stamps */}
      <ManualUtilizationTimestamps
        schedule={schedule}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        startTime={startTime}
        endTime={endTime}
        schedStartHour={schedStartHour}
        schedEndHour={schedEndHour}
        usageDate={usageDate}
        setTotalUsageTime={setTotalUsageTime}
        formatUsageDateAndTime={formatUsageDateAndTime}
      />

      {isLoadingUsage ? (
        <div className="mt-3">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-center gap-3">
            <StartClassButton
              startTime={startTime}
              formatUsageDateAndTime={formatUsageDateAndTime}
              schedule={schedule}
              currentUser={currentUser}
              openModal={openModal}
              noUsage={noUsage}
            />
            <EndClassButton
              endTime={endTime}
              formatUsageDateAndTime={formatUsageDateAndTime}
              currentUser={currentUser}
              usageId={usageId}
              usageStartTime={usageStartTime}
              usageEndTime={usageEndTime}
              listOfRemarks={listOfRemarks}
              openModal={openModal}
              schedule={schedule}
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <ClasslistButton
              openModal={openModal}
              usageId={usageId}
              schedule={schedule}
              usageStartTime={usageStartTime}
              usageEndTime={usageEndTime}
              usageDate={usageDate}
            />
            <AddUsageRemarkButton
              laboratory={schedule.laboratory}
              usageId={usageId}
              usageEndTime={usageEndTime}
              usageStartTime={usageStartTime}
              usageDate={usageDate}
              openModal={openModal}
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-3">
            <CancelClassButton
              currentUser={currentUser}
              laboratory={schedule.laboratory}
              schedule={schedule}
              usageId={usageId}
              usageEndTime={usageEndTime}
              usageStartTime={usageStartTime}
              openModal={openModal}
            />
          </div>
        </>
      )}
    </div>
  );
}
