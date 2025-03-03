import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { Button } from "@/common/ui/button";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "@/globals/globalConstantUtil";
import { LABS_NEED_HARDWARE_LIST } from "@/globals/initialValues";
import { getUsageTime } from "@/lib/helpers/dateTime";
import { format, formatISO } from "date-fns";

export default function EndClassButton({
  schedule,
  currentUser,
  openModal,
  usageId,
  usageStartTime,
  usageEndTime,
  usageDate,
  listOfUsage,
  listOfRemarks,
  tab,
}) {
  // ON CLICK 'END CLASS'
  const onEndClassClick = (listOfUsage, currentUser, schedule) => {
    const currentDate = new Date();

    // REMARKS VALIDATION
    const arrayOfRemarks = [];
    listOfRemarks?.map((item) => arrayOfRemarks.push(item.remark));

    const labWithInternetSpeed = [...LABS_NEED_HARDWARE_LIST].slice(0, 7);

    if (
      arrayOfRemarks.length === 0 ||
      (arrayOfRemarks.includes("Internet Speed") && arrayOfRemarks.length === 1)
    ) {
      ToastNotification("error", "Subject Remark/s is required.");
      return;
    }
    if (
      arrayOfRemarks.length === 0 ||
      (arrayOfRemarks.includes("Internet Speed") &&
        arrayOfRemarks.length === 1 &&
        labWithInternetSpeed.includes(schedule.laboratory))
    ) {
      ToastNotification("error", "Subject Remark/s is required.");
      return;
    }

    if (
      !arrayOfRemarks.includes("Internet Speed") &&
      labWithInternetSpeed.includes(schedule.laboratory)
    ) {
      ToastNotification("error", "Internet Speed remark is required.");
      return;
    }

    const {
      // id: scheduleId,
      // is_regular_class: isRegularClass,
      sched_end_time: schedEndTime,
      laboratory,
      code,
      title,
    } = schedule;

    // const { usageId, usageStartTime } = checkSubjectUsage(
    //   scheduleId,
    //   isRegularClass,
    //   listOfUsage,
    //   tab,
    // );

    // SYNC THE DATE OF SCHED END TIME AND CURRENT DATE TIME FOR COMPARISON
    let parsedSchedEndTime = new Date(schedEndTime);
    parsedSchedEndTime.setUTCMonth(currentDate.getUTCMonth());
    parsedSchedEndTime.setUTCDate(currentDate.getUTCDate());

    const scheduleEndDate = format(parsedSchedEndTime, "yyyy-MM-dd");
    const currentScheduleDate = format(currentDate, "yyyy-MM-dd");

    // IF END TIME IS LESS THAN TO CURRENT DATE, ADD 1 DAY
    if (scheduleEndDate !== currentScheduleDate) {
      parsedSchedEndTime.setUTCDate(currentDate.getUTCDate() + 1);
    }

    // CHECKING IF THE USAGE TIME WAS ALREADY PASSED THE SHEDULE END TIME
    // IF CURRENTTIME PASSED THE SCHED END TIME, THEN THE ENDTIME WILL BE THE SCHED END TIME
    // ELSE IT WILL BE THE CURRENT TIME
    const currentTime = format(currentDate, "HH:mm");
    const parsedScheduleEndTime = format(parsedSchedEndTime, "HH:mm");

    const classEndTime =
      currentTime > parsedScheduleEndTime ? parsedSchedEndTime : currentDate;

    // console.log("parsedScheduleEndTime", parsedScheduleEndTime);
    // console.log("currentTime", currentTime);
    // console.log("parsedSchedEndTime", format(parsedSchedEndTime, "hh:mma"));
    // console.log("classEndTime", format(classEndTime, "hh:mma"));

    let classTimeEnd = formatISO(classEndTime);

    // tab 2 - manual ending class time
    if (tab === "2") {
      // Extract time components from parsedSchedEndTime
      const hours = parsedSchedEndTime.getHours();
      const minutes = parsedSchedEndTime.getMinutes();
      const seconds = parsedSchedEndTime.getSeconds();

      // Create a new Date object with the time components
      const settedDate = new Date(usageDate);
      settedDate.setHours(hours);
      settedDate.setMinutes(minutes);
      settedDate.setSeconds(seconds);

      classTimeEnd = new Date(settedDate);
    }

    const usageHour = getUsageTime(
      formatISO(new Date(usageStartTime)),
      classTimeEnd,
    );

    // If exam days
    // const usageHour = getUsageTime(
    //   formatISO(new Date(usageStartTime)),
    //   formatISO(currentDate),
    // );

    let message;
    if (usageHour < 25) {
      message =
        "Class usage is less than 25mins. Are you sure you want to end the class?";
    } else
      message = (
        <h2>
          <p>{`End utilization for class ${code}-${title?.toUpperCase()} now?`}</p>
          {currentTime < parsedScheduleEndTime && tab === "1" && (
            <p>Time : {format(new Date(), "hh:mma")}</p>
          )}
        </h2>
      );

    const forAddingData = {
      code,
      subjectTitle: title,
      usageId,
      usageHour,
      // FORMATISO TO MAKE IT GMT+8 WHEN IT SEND TO BACKEND

      // For not Exam Days
      endTime: classTimeEnd,

      // for Exam Days
      // endTime: formatISO(currentDate),

      endTimeDup: schedEndTime,
      endedBy: currentUser.fullName,
      laboratory,
    };

    const payload = {
      title: "Confirmation",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        message,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.END_CLASS,
        forAddingData,
      },
    };

    openModal(payload);
  };

  const endClassButtonDisabled = usageStartTime && !usageEndTime;

  return (
    <div className="w-full min-w-max">
      <Button
        variant={!endClassButtonDisabled ? "outline" : "secondary"}
        size="sm"
        disabled={!endClassButtonDisabled}
        onClick={() => onEndClassClick(listOfUsage, currentUser, schedule)}
        className="w-full font-bold"
      >
        End Class
      </Button>
    </div>
  );
}
