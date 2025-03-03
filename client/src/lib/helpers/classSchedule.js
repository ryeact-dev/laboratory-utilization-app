export function getClassSchedule(schedule) {
  const mapClassSchedule = {
    1: "MSA1",
    2: "MSA2",
    3: "WEEKLY",
  };

  const classSchedule = mapClassSchedule[schedule];
  return classSchedule;
}

export function getClassScheduleSchedInfo(schedule) {
  const mapClassSchedule = {
    0: "Weekdays",
    1: "(MSA1) Mon-Wed",
    2: "(MSA2) Thu-Sat",
    3: "(WEEKLY) Mon-Sat",
    4: "Reservation",
  };

  const classSchedule = mapClassSchedule[schedule];
  return classSchedule;
}

export function getClassScheduleTruDate(date) {
  const scheduleDate = new Date(date);
  const whatDay = scheduleDate.getDay();

  const mapDay = {
    0: 0,
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 2,
    6: 2,
  };

  const scheduleDay = mapDay[whatDay];
  return Number(scheduleDay);
}

export function getWeekdayTruDate(date) {
  const scheduleDate = new Date(date);
  const whatDay = scheduleDate.getDay();

  const mapWeekDay = {
    0: "SU",
    1: "MO",
    2: "TU",
    3: "WE",
    4: "TH",
    5: "FR",
    6: "SA",
  };

  const selectedWeekday = mapWeekDay[whatDay];
  return selectedWeekday;
}

export function isScheduleOnList(recurrenceRule) {
  if (!recurrenceRule) return false;
  const recurrenceRulesArray = recurrenceRule.split(",");
  const today = getWeekdayTruDate(new Date());
  return recurrenceRulesArray.includes(today);
}

export function isMSAT1(classSchedule) {
  const classScheduleTruDate = getClassScheduleTruDate(new Date());
  return Boolean(classSchedule !== classScheduleTruDate && classSchedule !== 3);
}
