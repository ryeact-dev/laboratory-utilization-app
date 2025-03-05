import { DAYS, MONTH_NAMES } from "@/globals/initialValues";

import {
  isSameWeek,
  format,
  parse,
  differenceInCalendarWeeks,
  getDay,
  parseISO,
} from "date-fns";

export function isDateInThisWeek(date) {
  const now = new Date();
  return isSameWeek(date, now);
}

export function isDatePast(date) {
  const today = new Date();
  // SET THE TIME TO 00:00:00.000
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function getDayName(date) {
  const usageDate = new Date(date);
  const dayName = DAYS[usageDate.getDay()];
  return dayName;
}

export function getWeekDatesExcludeSunday(dateString) {
  const date = new Date(dateString);

  // GET THE DAY OF THE WEEK (0-6, SUNDAY is 0)
  const dayOfWeek = date.getDay();

  // CALCULATE THE START AND END DATES OF THE WEEK
  const startDate = new Date(
    date.getTime() -
      (dayOfWeek === 0 ? 6 : dayOfWeek - 1) * 24 * 60 * 60 * 1000,
  );
  const endDate = new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000);

  // FORMAT THE START AND END DATES
  const startString =
    MONTH_NAMES[startDate.getMonth()] + " " + startDate.getDate();
  const endString =
    MONTH_NAMES[endDate.getMonth()] +
    " " +
    endDate.getDate() +
    ", " +
    endDate.getFullYear();

  // CREATE AN ARRAY OF DATES FOR THE WEEK
  let weekDates = [];
  for (let i = 0; i < 6; i++) {
    let tempDate = new Date(startDate);
    tempDate.setDate(tempDate.getDate() + i);
    weekDates.push(format(tempDate, "yyyy-MM-dd"));
  }

  // RETURN THE FORMATTED WEEK DATES AND ARRAY OF DATES
  return { week: startString + " - " + endString, weekDates };
}

export function dateParsing(dateStr) {
  const date = parse(dateStr, "MMMM dd, yyyy 'at' h:mm:ss a", new Date());
  return format(date, "hh:mm a");
}

export const onDateParseISO = (dateStr) => {
  const date = parseISO(dateStr);
  return format(date, "hh:mmaaa");
};

export function getRelativeWeekNumber(baseDateString, givenDate) {
  const baseDate = new Date(baseDateString);
  const selectedDate = new Date(givenDate);

  // TODO: THIS FUNCTION UPDATED DURING AUDIT
  // const week = differenceInCalendarWeeks(selectedDate, baseDate, {
  //   weekStartsOn: 1,
  // });
  const week =
    differenceInCalendarWeeks(selectedDate, baseDate, { weekStartsOn: 1 }) + 1;
  return week;
}

export function isWeekday(date) {
  const day = getDay(date);
  return day !== 0;
}

export function isWithinStartEndClassDate(startDate, endDate) {
  const endingDate = new Date(endDate);
  endingDate.setHours(endingDate.getHours() + 24);

  const today = new Date();
  const isWithin = today >= new Date(startDate) && today <= endingDate;

  return !isWithin;
}

export function getHoursBetween(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  // If date2 is before date1, add 24 hours to date2
  if (date2.getTime() < date1.getTime()) {
    date2.setHours(date2.getHours() + 24);
  }

  const diffInMilliseconds = date2.getTime() - date1.getTime();

  // Convert the difference from milliseconds to hours and floor the minutes accordingly
  const hours = Math.floor(diffInMilliseconds / 1000 / 60 / 60);

  // Calculate the remaining minutes and floor the minutes accordingly
  const minutes = Math.floor((diffInMilliseconds / 1000 / 60) % 60);

  // Check the minutes and round the hours accordingly
  if (minutes < 15) {
    return hours;
  } else if (minutes >= 15 && minutes < 45) {
    return hours + 0.5;
  } else if (minutes >= 45) {
    return hours + 1;
  }
}

export function getUsageTime(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  // If date2 is before date1, add 24 hours to date2
  if (date2.getTime() < date1.getTime()) {
    date2.setHours(date2.getHours() + 24);
  }

  // Set the start time seconds to 0 to prevent time calculation errors
  date1.setSeconds(0);
  date2.setSeconds(0);

  // console.log(date1, date2);

  const diffInMilliseconds = date2.getTime() - date1.getTime();
  const minutes = Math.round(diffInMilliseconds / 1000 / 60);

  return minutes;
}

export const calculateUsageTime = (usageTime, forPrinting) => {
  const getHours = usageTime / 60;
  const hour = Number(getHours.toString().split(".")[0]);
  const minutes = usageTime % 60;

  if (forPrinting) {
    if (hour > 0) {
      return `${hour}${minutes > 0 ? `.${minutes}` : ""}`;
    } else if (minutes > 0) {
      return `.${minutes}`;
    } else return 0;
  } else {
    if (hour > 0) {
      return `${hour > 1 ? `${hour}hrs` : `${hour}hr`} ${
        minutes < 1 ? "" : minutes > 1 ? `${minutes}mins` : `${minutes}min`
      } `;
    } else if (minutes > 0) {
      return minutes === 1 ? `${minutes}min` : `${minutes}mins`;
    } else return 0;
  }
};

export function getUsageTimeAndDate(schedule) {
  const schedStartHour = format(new Date(schedule?.sched_start_time), "hh");
  const schedEndHour = format(new Date(schedule?.sched_end_time), "hh");

  const usageStartHour = format(new Date(schedule?.start_time), "hh");
  const usageEndHour = format(new Date(schedule?.end_time), "hh");

  const usageStartMinute = format(new Date(schedule?.start_time), "mm");
  const usageEndMinute = format(new Date(schedule?.end_time), "mm");

  const usageStartAMPM = format(new Date(schedule?.start_time), "a");
  const usageEndAMPM = format(new Date(schedule?.end_time), "a");

  const tempTotalUsageTime = getUsageTime(
    schedule?.start_time,
    schedule?.end_time,
  );

  return {
    usageStartHour,
    usageEndHour,
    usageStartMinute,
    usageEndMinute,
    usageStartAMPM,
    usageEndAMPM,
    tempTotalUsageTime,
    schedStartHour,
    schedEndHour,
  };
}
