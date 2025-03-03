import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Button } from "@/common/ui/button";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { useGetCurrentUserData } from "@/hooks/users.hook";
import { isWithinStartEndClassDate } from "@/lib/helpers/dateTime";
import { format, formatISO } from "date-fns";

export default function StartClassButton({
  schedule,
  currentUser,
  openModal,
  noUsage,
  startTime: selectedStartTime,
  formatUsageDateAndTime,
}) {
  const { termSemStartingDate, termSemEndingDate } = useGetCurrentUserData();

  // ON CLICK 'START CLASS'
  const onStartClassClick = (schedule) => {
    const currentDate = formatUsageDateAndTime(selectedStartTime);

    const {
      code,
      title: subjectTitle,
      students,
      subject_id: subjectId,
      id: scheduleId,
      laboratory,
      sched_start_time: schedStartTime,
    } = schedule;

    // CHECKING IF THE TIME IS WITHIN THE SCHEDULED
    // START AND END TIME FOR SELECTED SUBJECT
    const startTime = new Date(schedStartTime);

    const currentTime = format(currentDate, "hh:mm a");

    const scheduleStartTime = format(startTime, "hh:mm a");

    // RETURN NULL IF THERE IS NO STUDENT IN THE CLASSLIST FOR
    // SELECT SUBJECT
    if (subjectId && students.length === 0) {
      ToastNotification("error", "No students for this subject");
      return;
    }

    // SYNC THE DATE OF SCHED START TIME AND CURRENT DATE TIME FOR COMPARISON
    let parsedSchedStartTime = new Date(schedStartTime);
    parsedSchedStartTime.setUTCMonth(currentDate.getUTCMonth());
    parsedSchedStartTime.setUTCDate(currentDate.getUTCDate());

    const scheduleStartDate = format(parsedSchedStartTime, "yyyy-MM-dd");
    const currentScheduleDate = format(currentDate, "yyyy-MM-dd");

    // IF START CLASS IS LESS THAN TO CURRENT DATE, ADD 1 DAY
    let usageDate = currentDate;
    if (scheduleStartDate !== currentScheduleDate) {
      parsedSchedStartTime.setUTCDate(currentDate.getUTCDate() + 1);
      // usageDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    // IF THE CLASS START IS BEFORE THE SCHEDULE START TIME,
    // THE CLASS START TIME WILL BE THE SCHEDULE START TIME
    const classStartTime = formatISO(
      currentTime < scheduleStartTime ? parsedSchedStartTime : currentDate,
    );

    const classStartTimeWithZeroSeconds = new Date(classStartTime);
    classStartTimeWithZeroSeconds.setSeconds(0);
    const formattedClassStartTime = formatISO(classStartTimeWithZeroSeconds);

    const forAddingData = {
      scheduleId,
      subjectId,
      subjectTitle,
      code,
      students,
      classStartTime: formattedClassStartTime,
      startedBy: currentUser.fullName,
      laboratory,
      usageDate: formatISO(usageDate),
    };

    const title = (
      <>
        <p className="-mt-4 text-center">
          Start the class of: {subjectTitle} ({code})?
        </p>

        <p className="text-center">Time: {format(currentDate, "hh:mm a")}</p>
      </>
    );

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message: title,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.START_CLASS,
        forAddingData,
      },
      size: "max-w-md",
    };

    openModal(payload);
  };

  const startClassBtnDisabled =
    !noUsage ||
    isWithinStartEndClassDate(termSemStartingDate, termSemEndingDate);

  return (
    <div className="w-full min-w-max">
      <Button
        variant={"secondary"}
        size="sm"
        disabled={startClassBtnDisabled}
        onClick={() => onStartClassClick(schedule)}
        className="w-full font-semibold"
      >
        Start Class
      </Button>
    </div>
  );
}
