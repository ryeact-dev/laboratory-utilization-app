import {
  endOfWeek,
  eachWeekOfInterval,
  parseISO,
  isWithinInterval,
  startOfWeek,
  differenceInCalendarWeeks,
} from "date-fns";
import { calculateUsageTime, getUsageTime } from "./dateTime";

export const lineChartData = (
  data,
  subjectId,
  startDateString,
  endDateString,
  listOfNoClassDays,
) => {
  const filteredData = data.filter(
    (subject) => subject.subject_id === subjectId,
  );

  const regularClassInfo = filteredData.filter(
    (subject) => subject.is_regular_class,
  );

  const labHours = calculateLabHours(
    startDateString,
    endDateString,
    listOfNoClassDays,
    regularClassInfo[0],
  );

  const startDate = parseISO(startDateString);
  const endDate = parseISO(endDateString);
  const weeks = eachWeekOfInterval({ start: startDate, end: endDate });
  // IF NEED WEEK 0 IS NEEDED
  // let weeklyUsage = [{ week: "Week 0", "Usage Hr": 0, "Accu Lab Hr": 0 }];
  let weeklyUsage = [];
  let totalUsage = 0;

  weeks.forEach((weekStart, index) => {
    // Prevent weeks with no lab hours
    if (index >= labHours.length) return;

    let regularClassUsage = 0;
    let reservationClassUsage = 0;

    const weekEnd = endOfWeek(weekStart);

    filteredData.forEach((item) => {
      const usageDate = parseISO(item.usage_date);
      if (isWithinInterval(usageDate, { start: weekStart, end: weekEnd })) {
        if (item.is_regular_class) {
          regularClassUsage += item.usage_hours;
        } else {
          reservationClassUsage += item.usage_hours;
        }
      }
    });

    totalUsage += regularClassUsage + reservationClassUsage;

    weeklyUsage.push({
      week: `Week ${index + 1}`,
      regularClassUsage: calculateUsageTime(regularClassUsage, true),
      reservationClassUsage: calculateUsageTime(reservationClassUsage, true),
      weeklyUsage: calculateUsageTime(
        regularClassUsage + reservationClassUsage,
        true,
      ),
      "Usage Hr": parseFloat(calculateUsageTime(totalUsage, true)),
      "Accu Lab Hr": labHours[index],
    });
  });

  return {
    weekly_usage: weeklyUsage,
  };
};

export function calculateLabHours(
  startDateStr,
  endDateStr,
  dateArrayStr = [],
  subjectData,
) {
  // Get how many usage hours the subject is base on its scheduled time
  const labHour =
    Math.floor(
      getUsageTime(subjectData?.sched_start_time, subjectData?.sched_end_time),
    ) / 60;

  // Get how many days the subject is scheduled to be used
  const daysScheduled = subjectData?.recurrence_rule?.split(",").length;

  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);

  const weeks = differenceInCalendarWeeks(endDate, startDate);

  const dateArray = dateArrayStr?.map((dateStr) =>
    parseISO(dateStr?.no_class_date),
  );

  let totalHours = 0;
  let result = Array.from({ length: weeks }, (_, i) => {
    let weekStart = startOfWeek(startDate);
    let weekEnd = endOfWeek(startDate);
    let hours = labHour * daysScheduled; // Get total hours of the subject

    dateArray.forEach((date) => {
      if (isWithinInterval(date, { start: weekStart, end: weekEnd })) {
        hours -= labHour;
      }
    });

    hours = Math.max(0, hours); // Ensure hours is not negative
    totalHours += hours;

    // Offset the calculation by 7 days to start next week.
    startDate.setDate(startDate.getDate() + 7);

    // return { weekNumber: i + 1, hours: totalHours };
    return totalHours;
  });

  return result;
}
