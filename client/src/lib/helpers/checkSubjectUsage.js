import { addHours, format } from "date-fns";

export function checkSubjectUsage(
  scheduleId,
  isRegularClass,
  listOfUsage,
  cardType = "1",
  selectedDate,
) {
  let today = format(
    selectedDate ? new Date(selectedDate) : new Date(),
    "yyyy-MM-dd",
  );

  let noUsage = true;
  let noClassStartTime = true;
  let usageId = null;
  let usageStartTime = null;
  let usageEndTime = null;
  let usageDate = null;
  let foundSchedule = [];

  const parseDate = (usageDate) => {
    let utcDate = new Date(usageDate);

    // Convert to local time (Philippine Standard Time)
    let localDate = addHours(utcDate, 8); // Add 8 hours for Philippine Standard Time

    const formattedUsageDate = format(localDate, "yyyy-MM-dd");

    return formattedUsageDate;
  };

  if (listOfUsage?.length === 0)
    return { noUsage, noClassStartTime, usageStartTime };

  // if (isReservation) {
  //   foundSchedule = [...listOfUsage]?.filter(
  //     (usage) => usage.schedule_id === scheduleId,
  //   );
  // } else {
  //   foundSchedule = [...listOfUsage]?.filter(
  //     (usage) =>
  //       usage.schedule_id === scheduleId &&
  //       parseDate(usage.usage_date) === today,
  //   );
  // }

  if (cardType === "2") {
    foundSchedule = [...listOfUsage]
      ?.filter((usage) => usage.schedule_id === scheduleId)
      .sort((a, b) => {
        // Sort foundSchedule to display entries with null end_time first
        if (a.end_time === null && b.end_time !== null) return -1; // a comes first
        if (a.end_time !== null && b.end_time === null) return 1; // b comes first
        return 0; // keep original order if both are null or both are not null
      });
  } else {
    foundSchedule = [...listOfUsage]?.filter(
      (usage) =>
        usage.schedule_id === scheduleId &&
        parseDate(usage.usage_date) === today,
    );
  }

  // console.log("foundSchedule", foundSchedule);
  // console.log("listOfUsage", listOfUsage);
  // console.log("scheduleId", scheduleId);

  if (foundSchedule?.length > 0) {
    if (isRegularClass) {
      noUsage = false;
    } else {
      noUsage = foundSchedule[0]?.schedule_id === scheduleId ? false : true;
    }

    usageId = foundSchedule[0]?.id;
    usageStartTime = foundSchedule[0]?.start_time;
    usageEndTime = foundSchedule[0]?.end_time;
    usageDate = foundSchedule[0]?.usage_date;
  }

  return {
    noUsage,
    usageId,
    usageDate,
    usageStartTime,
    usageEndTime,
  };
}
