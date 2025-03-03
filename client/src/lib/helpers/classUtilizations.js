import { isSameDay } from "date-fns";

export function getSubjectSchedules(
  recurrenceRule,
  weekDates = [],
  listOfUsage,
  subjectId,
  subjectCode,
) {
  if (!recurrenceRule || weekDates.length === 0)
    return { subjectSchedule: null, firstUsageDate: null };

  const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA"];

  const subjectScheduleToArray = recurrenceRule.split(",");

  const mappedWeekDates = weekDates.map((date, index) => {
    return {
      weekday: WEEKDAYS[index],
      date: date,
    };
  });

  const subjectSchedule = mappedWeekDates.filter((date) => {
    return subjectScheduleToArray.includes(date.weekday);
  });

  // console.log("subjectCode", subjectCode);
  // console.log("subjectSchedule", subjectSchedule);

  const filteredUsage = listOfUsage.filter((usage) => {
    // Sort usage_dates in ascending order
    usage.usage_dates.sort((a, b) => new Date(a) - new Date(b));

    // Pre-convert usage dates to Date objects once
    const usageDates = usage.usage_dates.map((date) => new Date(date));

    // console.log(usageDates);
    // Check if any schedule matches any usage date
    for (const date of weekDates) {
      const weekDate = new Date(date);
      for (const usageDate of usageDates) {
        if (isSameDay(weekDate, usageDate) && usage.subject_id === subjectId) {
          return true;
        }
      }
    }
    return false;
  });

  // .sort((a, b) => new Date(a.usage_dates[0]) - new Date(b.usage_dates[0]));

  // console.log("subjectId", subjectId);
  // console.log("subjectCode", subjectCode);
  // console.log("filteredUsage", filteredUsage);

  return {
    subjectSchedule,
    firstUsageDate: filteredUsage[0]?.usage_dates[0] || null,
  };
}
