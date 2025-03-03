import { format, isSameDay } from "date-fns";

/**
 * @typedef {Object} TimeSlot
 * @property {Date} start
 * @property {Date} end
 * @property {string} startStr
 * @property {string} endStr
 */

/**
 * Creates a normalized time slot for comparison
 * @param {string} startTime - ISO datetime string
 * @param {string} endTime - ISO datetime string
 * @returns {TimeSlot}
 */
function createTimeSlot(startTime, endTime) {
  const [, startTimeStr] = startTime.split("T");
  const [, endTimeStr] = endTime.split("T");
  const baseDate = "2023-10-10T";

  return {
    start: new Date(`${baseDate}${startTimeStr}`),
    end: new Date(`${baseDate}${endTimeStr}`),
    startStr: startTimeStr,
    endStr: endTimeStr,
    formatted: `${format(new Date(startTime), "HH:mm")} - ${format(new Date(endTime), "HH:mm")}`,
  };
}

/**
 * Checks for duplicate schedule entries
 */
function checkDuplicateSchedule(
  dataSource,
  timeSlot,
  fetchedSubject,
  isReservation,
) {
  if (!fetchedSubject) return { isDuplicate: false };

  const isDuplicate = dataSource.some((schedule) => {
    const scheduleTimeSlot = createTimeSlot(
      schedule.StartTime,
      schedule.EndTime,
    );
    return (
      schedule.SubjectId === fetchedSubject.id &&
      schedule.RegularClass &&
      !isReservation &&
      scheduleTimeSlot.formatted === timeSlot.formatted
    );
  });

  return {
    isDuplicate,
    message: isDuplicate
      ? "Subject selected for this time is already in the schedule"
      : "",
  };
}

/**
 * Normalizes schedule data for processing
 */
function normalizeSchedules(dataSource, selectedDays) {
  return dataSource
    .filter((schedule) => {
      const rules = schedule.ScheduleData.recurrence_rule?.split(",") || [""];
      return rules.some((rule) => selectedDays.includes(rule) || rule === "");
    })
    .map((schedule) => {
      const timeSlot = createTimeSlot(schedule.StartTime, schedule.EndTime);
      const [startDate] = schedule.StartTime.split("T");
      const [endDate] = schedule.EndTime.split("T");

      return {
        ...schedule,
        startDate,
        endDate,
        timeSlot,
        recurrenceRules: schedule.ScheduleData.recurrence_rule?.split(",") || [
          "",
        ],
      };
    });
}

/**
 * Checks for time conflicts between schedules
 */
function checkTimeConflicts(
  schedules,
  requestedTimeSlot,
  selectedDate,
  selectedDays,
  options,
) {
  const { fetchedSubject, subjectName, isSameLaboratory, is_regular_class } =
    options;

  const conflictingSchedule = schedules.find((schedule) => {
    // Skip self-comparison for transfers
    if (schedule.ScheduleId === fetchedSubject?.id) return false;

    // Check time overlap first - this is the most efficient filter
    const hasTimeOverlap =
      schedule.timeSlot.start < requestedTimeSlot.end &&
      schedule.timeSlot.end > requestedTimeSlot.start;

    // Special handling for midnight schedules
    if (
      requestedTimeSlot.startStr === "23:00:00.000Z" ||
      schedule.timeSlot.startStr === "23:00:00.000Z"
    ) {
      const hasMidnightOverlap =
        schedule.timeSlot.startStr === requestedTimeSlot.startStr ||
        schedule.timeSlot.endStr === requestedTimeSlot.endStr;

      if (!hasMidnightOverlap) return false;
    } else if (!hasTimeOverlap) {
      return false;
    }

    // Only proceed with more expensive checks if there's a time overlap
    // Check day conflicts
    if (!schedule.recurrenceRules.some((rule) => selectedDays.includes(rule))) {
      return false;
    }

    // Check if the schedule is not a regular class and the selected date is the same
    if (
      !schedule.RegularClass &&
      !isSameDay(new Date(schedule.startDate), new Date(selectedDate))
    ) {
      return false;
    }

    // If we've made it here, we have a conflict
    return true;
  });

  // console.log(conflictingSchedule);

  if (!conflictingSchedule) {
    return { hasConflict: false };
  }

  const conflictMessage = formatConflictMessage(conflictingSchedule);

  // Handle non-regular classes
  if (!is_regular_class) {
    const isSameDate =
      isSameDay(
        new Date(conflictingSchedule.startDate),
        new Date(selectedDate),
      ) ||
      isSameDay(new Date(conflictingSchedule.endDate), new Date(selectedDate));

    // console.log(conflictingSchedule);

    // console.log(
    //   "conflictingSchedule.RegularClass",
    //   conflictingSchedule.RegularClass,
    // );
    // console.log("isSameDate", isSameDate);

    return {
      hasConflict: isSameDate,
      message: conflictMessage,
    };
  }

  // Handle transfer schedules
  if (options.isTransferSchedule) {
    const isAllowed =
      conflictingSchedule.Subject === subjectName && isSameLaboratory;
    return {
      hasConflict: !isAllowed,
      message: conflictMessage,
    };
  }

  return {
    hasConflict: true,
    message: conflictMessage,
  };
}

/**
 * Formats conflict message
 */
function formatConflictMessage(schedule) {
  return `Conflict schedule with ${schedule.Subject} at ${format(
    schedule.timeSlot.start,
    "hh:mm a",
  )} - ${format(schedule.timeSlot.end, "hh:mm a")}`;
}

/**
 * Main schedule availability checker
 */
export function getScheduleAvailability(
  scheduleData,
  startTime,
  endTime,
  selectedDate,
  is_regular_class,
  selectedDays,
  subjectName,
  isTransferSchedule,
  isSameLaboratory,
  fetchedSubject,
  isReservation,
) {
  const dataSource = scheduleData.props.eventSettings.dataSource;
  const requestedTimeSlot = createTimeSlot(startTime, endTime);

  // Check for duplicate schedules
  const duplicateCheck = checkDuplicateSchedule(
    dataSource,
    requestedTimeSlot,
    fetchedSubject,
    isReservation,
  );

  if (duplicateCheck.isDuplicate && !isTransferSchedule) {
    return {
      isScheduleAvailable: false,
      conflictMessage: duplicateCheck.message,
    };
  }

  // Process and normalize schedules
  const normalizedSchedules = normalizeSchedules(dataSource, selectedDays);

  // Check for time conflicts
  const conflictCheck = checkTimeConflicts(
    normalizedSchedules,
    requestedTimeSlot,
    selectedDate,
    selectedDays,
    {
      fetchedSubject,
      subjectName,
      isSameLaboratory,
      is_regular_class,
      isTransferSchedule,
    },
  );

  return {
    isScheduleAvailable: !conflictCheck.hasConflict,
    conflictMessage: conflictCheck.message || "",
  };
}

// // OLD METHOD
// import { format, isSameDay } from "date-fns";

// /**
//  * @typedef {Object} Schedule
//  * @property {string} StartTime - ISO datetime string
//  * @property {string} EndTime - ISO datetime string
//  * @property {Object} ScheduleData
//  * @property {string} Subject
//  * @property {boolean} RegularClass
//  * @property {number} SubjectId
//  */

// export function getScheduleAvailability(
//   scheduleData,
//   startTime,
//   endTime,
//   selectedDate,
//   is_regular_class,
//   selectedDays,
//   subjectName,
//   isTransferSchedule,
//   isSameLaboratory,
//   fetchedSubject,
//   isReservation,
// ) {
//   const dataSource = scheduleData.props.eventSettings.dataSource;

//   // Check if the Subject to be schedules is already in the schedule and same time slot
//   if (fetchedSubject !== null) {
//     const hasExistingSchedule = dataSource.some((schedule) => {
//       const forScheduleTime = `${format(new Date(startTime), "HH:mm")} - ${format(new Date(endTime), "HH:mm")}`;
//       const scheduledTime = `${format(new Date(schedule.StartTime), "HH:mm")} - ${format(new Date(schedule.EndTime), "HH:mm")}`;

//       const isSameTime = forScheduleTime === scheduledTime;

//       if (
//         schedule.SubjectId === fetchedSubject.id &&
//         schedule.RegularClass &&
//         !isReservation &&
//         isSameTime
//       ) {
//         return true;
//       } else return false;
//     });

//     // console.log(startTime, endTime, fetchedSubject);

//     if (hasExistingSchedule && !isTransferSchedule) {
//       return {
//         isScheduleAvailable: false,
//         conflictMessage:
//           "Subject selected for this time is already in the schedule",
//       };
//     }
//   }

//   // Pre-process schedule data once instead of multiple times
//   const processedSchedules = dataSource
//     .filter((schedule) => {
//       const recurrenceRules = schedule.ScheduleData.recurrence_rule?.split(
//         ",",
//       ) || [""];

//       return recurrenceRules.some(
//         (rule) => selectedDays.includes(rule) || rule === "",
//       );
//     })
//     .map((schedule) => {
//       const [startDate, startTimeStr] = schedule.StartTime.split("T");
//       const [endDate, endTimeStr] = schedule.EndTime.split("T");

//       // Pre-calculate Date objects for comparison
//       const startDateTime = new Date(`2023-10-10T${startTimeStr}`);
//       const endDateTime = new Date(`2023-10-10T${endTimeStr}`);

//       return {
//         ClassSchedule: schedule.ClassSchedule,
//         StartDate: startDate,
//         StartTime: startTimeStr,
//         EndDate: endDate,
//         EndTime: endTimeStr,
//         StartDateTime: startDateTime,
//         EndDateTime: endDateTime,
//         RecurrenceRule: schedule.ScheduleData.recurrence_rule?.split(",") || [
//           "",
//         ],
//         RegularClass: schedule.RegularClass,
//         Subject: schedule.Subject,
//         ScheduledId: schedule.ScheduleId,
//       };
//     });

//   const checkTimeAvailability = (
//     foundClassSchedule,
//     scheduleTime,
//     isStartTime,
//   ) => {
//     const [reservationDate, reservationTime] = scheduleTime.split("T");

//     const time = scheduleTime.split("T")[1];
//     const timeType = isStartTime ? "StartTime" : "EndTime";
//     const dateType = time === "23:00:00.000Z" ? "StartDate" : "EndDate";

//     let isDateAvailable = true;
//     let isRegularClass = true;

//     // CHECK IF THERE ARE CONFLICTS IN RESERVE TIME
//     const foundTime = foundClassSchedule.filter(
//       (time) => time[timeType] === reservationTime,
//     );

//     if (foundTime.length > 0) {
//       // CHECK IF THE DATE IS THE SAME
//       if (foundTime[0][dateType] === reservationDate) {
//         // IF THE SUBJECT NAME IS NOT THE SAME THEN IT IS NOT AVAILABLE
//         if (foundTime[0].Subject !== subjectName) {
//           isDateAvailable = false;
//         }
//       }
//       // CHECK IF THE CLASS IS REGULAR
//       if (foundTime[0].RecurrenceRule === null) {
//         isRegularClass = false;
//       }
//     }

//     // CHECK THIS LOGIC FOR OVERLAPPING TIMES
//     const foundOverlapTime = foundClassSchedule.filter((time) => {
//       const startTime = new Date(`2023-10-10T${time.StartTime}`);
//       const endTime = new Date(`2023-10-10T${time.EndTime}`);
//       const selectedTime = new Date(`2023-10-10T${reservationTime}`);

//       return startTime < selectedTime && endTime > selectedTime;
//     });

//     if (foundOverlapTime.length > 0) {
//       // CHECK IF THE DATE IS THE SAME
//       if (foundOverlapTime[0][dateType] === reservationDate) {
//         isDateAvailable = false;
//       }

//       // CHECK IF THE CLASS IS REGULAR
//       if (foundOverlapTime[0].RecurrenceRule === null) {
//         isRegularClass = false;
//       }
//     }

//     return Boolean(isDateAvailable && isRegularClass);
//   };

//   const checkInsideTimeAvailability = (schedules, startTime, endTime) => {
//     const [reservationStartDate, reservationStartTime] = startTime.split("T");
//     const [reservationEndDate, reservationEndTime] = endTime.split("T");
//     const reservationStartDateTime = new Date(
//       `2023-10-10T${reservationStartTime}`,
//     );
//     const reservationEndDateTime = new Date(`2023-10-10T${reservationEndTime}`);

//     const conflictingSchedule = schedules.find((schedule) => {
//       // TODO: (NEW) IF STATEMENT TO CHECK IF THE SCHEDULE IS ALREADY IN THE SCHEDULE
//       if (schedule.ScheduledId === fetchedSubject?.id) {
//         return false;
//       }

//       if (
//         schedule.EndDate !== reservationEndDate &&
//         !schedule.RecurrenceRule.some((rule) => selectedDays.includes(rule))
//       ) {
//         return false;
//       }

//       // Simplified time overlap check using pre-calculated Date objects
//       if (
//         reservationStartTime === "23:00:00.000Z" ||
//         schedule.StartTime === "23:00:00.000Z"
//       ) {
//         return (
//           schedule.StartTime === reservationStartTime ||
//           schedule.EndTime === reservationEndTime ||
//           (schedule.StartDateTime > reservationStartDateTime &&
//             schedule.EndDateTime > reservationStartDateTime) ||
//           (schedule.StartDateTime < reservationStartDateTime &&
//             schedule.StartDateTime < reservationEndDateTime)
//         );
//       }

//       return (
//         schedule.StartTime === reservationStartTime ||
//         schedule.EndTime === reservationEndTime ||
//         (schedule.StartDateTime < reservationStartDateTime &&
//           schedule.EndDateTime > reservationStartDateTime) ||
//         (schedule.StartDateTime > reservationStartDateTime &&
//           schedule.StartDateTime < reservationEndDateTime)
//       );
//     });

//     let conflictMessage = "";
//     const isNotConflictSchedule =
//       conflictingSchedule === undefined ? true : false;

//     if (!isNotConflictSchedule)
//       conflictMessage = `Conflict schedule with ${conflictingSchedule?.Subject}
//                          at ${format(new Date("2023-10-10T" + conflictingSchedule?.StartTime), "hh:mm a")} -
//                          ${format(new Date("2023-10-10T" + conflictingSchedule?.EndTime), "hh:mm a")}`;

//     const returnData = { isNotConflictSchedule, conflictMessage };

//     // console.log("isSameLaboratory", isSameLaboratory);
//     // console.log("conflictingSchedule", conflictingSchedule);
//     // console.log("is_regular_class", is_regular_class);
//     // console.log("selectedDate", selectedDate);

//     if (is_regular_class === false) {
//       if (conflictingSchedule) {
//         const isSameScheduleDate =
//           isSameDay(
//             new Date(conflictingSchedule.StartDate),
//             new Date(selectedDate),
//           ) ||
//           isSameDay(
//             new Date(conflictingSchedule.EndDate),
//             new Date(selectedDate),
//           );

//         // Return false if the schedule is a regular class and the selected date is the same
//         if (conflictingSchedule.RegularClass || isSameScheduleDate)
//           return { ...returnData, isNotConflictSchedule: false };

//         return { ...returnData, isNotConflictSchedule: true };
//       } else {
//         return { ...returnData, isNotConflictSchedule: true };
//       }
//     }

//     if (isTransferSchedule) {
//       if (conflictingSchedule) {
//         if (conflictingSchedule.Subject === subjectName) {
//           return isSameLaboratory
//             ? { ...returnData, isNotConflictSchedule: true }
//             : { ...returnData, isNotConflictSchedule: false };
//         }

//         return { ...returnData, isNotConflictSchedule: false };
//       } else {
//         return { ...returnData, isNotConflictSchedule: true };
//       }
//     }

//     return returnData;
//   };

//   // CHECK IF START TIME IS AVAILABLE
//   const isStartTimeAvailable = checkTimeAvailability(
//     processedSchedules,
//     startTime,
//     true,
//   );

//   // CHECK IF THE END TIME IS AVAILABLE
//   const isEndTimeAvaiable = checkTimeAvailability(
//     processedSchedules,
//     endTime,
//     false,
//   );

//   // CHECK IF THERE IS A SCHEDULE INSIDE SCHEDULE TIMES
//   const { isNotConflictSchedule, conflictMessage } =
//     checkInsideTimeAvailability(processedSchedules, startTime, endTime);

//   const isScheduleAvailable =
//     isStartTimeAvailable && isEndTimeAvaiable && isNotConflictSchedule;

//   // console.log(isStartTimeAvailable, isEndTimeAvaiable, isNotConflictSchedule);

//   // CHECK IF WHAT SCHEDULE OF THE WEEK ARE THEY CONFLICTS
//   return { isScheduleAvailable, conflictMessage };
// }
