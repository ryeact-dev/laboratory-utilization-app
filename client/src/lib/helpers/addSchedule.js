import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { getClassScheduleTruDate, getWeekdayTruDate } from "./classSchedule";
import { getHoursBetween } from "./dateTime";
import { format } from "date-fns";
import { getScheduleAvailability } from "./scheduleAvailability";

// NEWLY UPDATED METHOD 03/01/2025
/**
 * Validates schedule input data
 * @returns {Object|null} Error object or null if valid
 */
function validateScheduleInput(
  subjectData,
  selectedDays,
  fetchedSubject,
  date,
  diffHours,
) {
  const {
    code,
    is_regular_class,
    start_time,
    end_time,
    purpose,
    activity_title,
  } = subjectData;

  // Check for subject selection
  if (code === "") {
    return {
      isScheduleAvailable: false,
      conflictMessage: "Please select a subject",
    };
  }

  // Check for date selection
  if (date === "") {
    return {
      isScheduleAvailable: false,
      conflictMessage: "Please select days",
    };
  }

  // Check for day selection for regular classes
  if (is_regular_class && selectedDays.length === 0) {
    return {
      isScheduleAvailable: false,
      conflictMessage: "Please select days",
    };
  }

  // Validate reservation class time
  if (!is_regular_class) {
    if (start_time === "" || end_time === "") {
      return {
        isScheduleAvailable: false,
        conflictMessage: "Reservation Class must set the Class Time",
      };
    }

    if (diffHours === 0) {
      return {
        isScheduleAvailable: false,
        conflictMessage: "Please check selected class time",
      };
    }
  }

  // Check activity title for "Others" purpose
  if (purpose === "Others" && !activity_title) {
    return ToastNotification("error", "Activity title is required");
  }

  // Validate subject selection for make-up or regular classes
  if (!fetchedSubject && (purpose === "Make-up Class" || is_regular_class)) {
    return {
      isScheduleAvailable: false,
      conflictMessage: "Please select a subject",
    };
  }

  // Check if date falls on Sunday
  const selectedClassSchedTruDate = getClassScheduleTruDate(date);
  if (selectedClassSchedTruDate === 0) {
    return {
      isScheduleAvailable: false,
      conflictMessage: "Selected date falls on Sunday",
    };
  }

  return null;
}

/**
 * Prepares time data for schedule
 */
function prepareTimeData(subjectData, fetchedSubject, date, isManualTime) {
  const { is_regular_class, start_time, end_time } = subjectData;

  // Determine base date
  const selectedDate = is_regular_class ? fetchedSubject.created_at : date;
  const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");

  // Handle special case for 7:00 AM (23:00:00.000Z)
  const previousDay = new Date(selectedDate);
  previousDay.setDate(previousDay.getDate() - 1);
  const previousDayFormatted = format(previousDay, "yyyy-MM-dd");

  // Determine start and end times
  if (is_regular_class && !isManualTime) {
    // Use subject's predefined times for regular classes
    const startDate =
      fetchedSubject.start_time === "23:00:00.000Z"
        ? previousDayFormatted
        : formattedDate;

    return {
      startTime: `${startDate}T${fetchedSubject.start_time}`,
      endTime: `${formattedDate}T${fetchedSubject.end_time}`,
      selectedDate,
    };
  } else {
    // Use manually selected times
    const startDate =
      start_time === "23:00:00.000Z" ? previousDayFormatted : formattedDate;

    return {
      startTime: `${startDate}T${start_time}`,
      endTime: `${formattedDate}T${end_time}`,
      selectedDate,
    };
  }
}

/**
 * Creates a schedule for a subject
 */
export function addSchedule(
  subjectData,
  selectedDays,
  fetchedSubject,
  date,
  scheduleObj,
  selectedTermAndSem,
  activeSchoolYear,
  laboratory,
  currentUser,
  isManualTime = false,
  isReservation = false,
) {
  // Calculate hours between selected times
  const diffHours = getHoursBetween(
    `2023-10-10T${subjectData.start_time}`,
    `2023-10-10T${subjectData.end_time}`,
  );

  // Validate input data
  const validationError = validateScheduleInput(
    subjectData,
    selectedDays,
    fetchedSubject,
    date,
    diffHours,
  );

  if (validationError) return validationError;

  // Prepare time data
  const { startTime, endTime, selectedDate } = prepareTimeData(
    subjectData,
    fetchedSubject,
    date,
    isManualTime,
  );

  // Determine weekdays based on schedule type
  const weekdays = subjectData.is_regular_class
    ? selectedDays
    : getWeekdayTruDate(date);

  // Format subject name for display
  const subjectName = fetchedSubject.id
    ? `${fetchedSubject.code}-${fetchedSubject.title.toUpperCase()}`
    : subjectData.activity_title;

  // Check schedule availability
  const { isScheduleAvailable, conflictMessage } = getScheduleAvailability(
    scheduleObj.current,
    startTime,
    endTime,
    selectedDate,
    subjectData.is_regular_class,
    weekdays,
    subjectName,
    false, // Not using Transfer Schedule
    false, // Not using Transfer Schedule
    fetchedSubject,
    isReservation,
  );

  // Prepare schedule data
  const scheduleData = {
    ...subjectData,
    start_time: startTime,
    end_time: endTime,
    classSchedule: isManualTime ? 1 : 0, // 0 - REGULAR CLASS, 1 - MANUAL TIME SCHEDULE
    activeSchoolYear,
    laboratory,
    subjectId: fetchedSubject.id,
    subjectCode: fetchedSubject.code,
    subjectTitle: fetchedSubject.title,
    term_sem: selectedTermAndSem,
    selected_day: weekdays,
  };

  return {
    isScheduleAvailable,
    conflictMessage,
    scheduleData,
  };
}

// OLD METHOD
// import { ToastNotification } from "@/common/toastNotification/ToastNotification";
// import { getClassScheduleTruDate, getWeekdayTruDate } from "./classSchedule";
// import { getHoursBetween } from "./dateTime";
// import { format } from "date-fns";
// import { getScheduleAvailability } from "./scheduleAvailability";

// export function addSchedule(
//   subjectData,
//   selectedDays,
//   fetchedSubject,
//   date,
//   scheduleObj,
//   activeTermSem,
//   activeSchoolYear,
//   laboratory,
//   currentUser,
//   isManualTime = false,
//   isReservation = false,
// ) {
//   let {
//     start_time,
//     end_time,
//     purpose,
//     activity_title,
//     is_regular_class,
//     selected_day,
//     code,
//   } = subjectData;

//   // GET WHAT DAY DOES THE RESERVATION DATE FALLS
//   const selectedClassSchedTruDate = getClassScheduleTruDate(date);

//   // UTILS TO CHECK THE TOTAL HOURS BETWEEN SELECTED TIMES
//   const diffHours = getHoursBetween(
//     `2023-10-10T${start_time}`,
//     `2023-10-10T${end_time}`,
//   );

//   if (code === "") {
//     return {
//       isScheduleAvailable: false,
//       conflictMessage: "Please select a subject",
//     };
//   }

//   if (date === "") {
//     return {
//       isScheduleAvailable: false,
//       conflictMessage: "Please select days",
//     };
//   }

//   if (is_regular_class === true) {
//     if (selectedDays.length === 0) {
//       return {
//         isScheduleAvailable: false,
//         conflictMessage: "Please select days",
//       };
//     }
//   }

//   if (is_regular_class === false) {
//     if (start_time === "" || end_time === "") {
//       return {
//         isScheduleAvailable: false,
//         conflictMessage: "Reservation Class must set the Class Time",
//       };
//     }

//     if (diffHours === 0) {
//       return {
//         isScheduleAvailable: false,
//         conflictMessage: "Please check selected class time",
//       };
//     }
//   }

//   // CHECK IF ACTIVITY TITLE IS BLANK IF PURPOSE IS OTHERS
//   if (purpose === "Others" && !activity_title) {
//     return ToastNotification("error", "Activity title is required");
//   }

//   if (
//     !fetchedSubject &&
//     (purpose === "Make-up Class" || is_regular_class == true)
//   ) {
//     return {
//       isScheduleAvailable: false,
//       conflictMessage: "Please select a subject",
//     };
//   }

//   if (selectedClassSchedTruDate === 0) {
//     return {
//       isScheduleAvailable: false,
//       conflictMessage: "Selected date falls on Sunday",
//     };
//   }

//   // *Added Functionality, If regular class it will take the subject created date for base date
//   // *Else the base date will be from date picker
//   const selectedDate =
//     is_regular_class === true ? fetchedSubject.created_at : date;

//   const removeOneDay = new Date(selectedDate);
//   removeOneDay.setDate(removeOneDay.getDate() - 1);

//   const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
//   let startDate = formattedDate;

//   // IF 7:00 AM TIME
//   if (start_time === "23:00:00.000Z") {
//     startDate = format(removeOneDay, "yyyy-MM-dd");
//   }

//   let startTime = `${startDate}T${start_time}`;
//   let endTime = `${formattedDate}T${end_time}`;

//   // IF TYPE OF SCHEDULE IS REGULAR CLASS THEN FETCH THE SUBJECT TIME
//   if (is_regular_class === true && !isManualTime) {
//     // IF 7:00 AM TIME
//     if (fetchedSubject.start_time === "23:00:00.000Z") {
//       startDate = format(removeOneDay, "yyyy-MM-dd");
//     }

//     startTime = `${startDate}T${fetchedSubject.start_time}`;
//     endTime = `${formattedDate}T${fetchedSubject.end_time}`;
//   }

//   // IF THE SCHEDULE IS A RESERVATION CLASS IT WILL ALSO CHECK IF THE
//   // RESERVATION DATE FALL ON MSAT1 OR MSAT2
//   let weekdays = selectedDays;
//   if (is_regular_class === false) {
//     weekdays = getWeekdayTruDate(date);
//   }

//   const subjectName = `${
//     fetchedSubject.id
//       ? fetchedSubject.code + "-" + fetchedSubject.title.toUpperCase()
//       : fetchedSubject.activity_title
//   }`;

//   // CHECK SCHEDULE AVAILABILITY
//   const { isScheduleAvailable, conflictMessage } = getScheduleAvailability(
//     scheduleObj.current,
//     startTime,
//     endTime,
//     selectedDate,
//     is_regular_class,
//     weekdays,
//     subjectName,
//     false, // Not using Transfer Schedule
//     false, // Not using Transfer Schedule
//     fetchedSubject,
//     isReservation,
//   );

//   // IF NO ERRORS OCCURED. PROCEED TO ADD THE SCHEDULE
//   const scheduleData = {
//     ...subjectData,
//     start_time: startTime,
//     end_time: endTime,
//     //  0 - REGULAR CLASS, 1 - MANUAL TIME SCHEDULE
//     classSchedule: isManualTime ? 1 : 0,
//     activeSchoolYear,
//     laboratory,
//     subjectId: fetchedSubject.id,
//     subjectCode: fetchedSubject.code,
//     subjectTitle: fetchedSubject.title,
//     term_sem: activeTermSem,
//     // selected_day: getWeekdayTruDate(date),// this for selected by day schedule
//     selected_day: weekdays,
//   };

//   return {
//     isScheduleAvailable,
//     conflictMessage,
//     scheduleData,
//   };
// }
