import axios from "axios";

// GET UTILIZATIONS WITH SCHEDULE ID
export async function getPreviousUtilizations({
  subjectCode,
  subjectTitle,
  activeSchoolYear,
  baseDate,
}) {
  return await axios.get(
    `/api/previous-utilizations?subjectcode=${subjectCode}&subjecttitle=${subjectTitle}&schoolyear=${activeSchoolYear}&basedate=${baseDate}`,
  );
}

// GET UTILIZATIONS BY SUBJECT ID
export async function getUtilizationBySubjectId({
  subjectId,
  activeSchoolYear,
  weekDates,
}) {
  const forWeeklyUsageObj = {
    subjectId,
    activeSchoolYear,
    weekDates,
  };

  return await axios.post(`/api/utilizations-subjectid`, forWeeklyUsageObj);
}

// GET ALL UTILIZATIONS BY TERM
export async function getUtilizationsByTerm({
  laboratory,
  activeSchoolYear,
  selectedTermAndSem,
  selectedDate,
}) {
  return await axios.get(
    `/api/utilizations-list?laboratory=${laboratory}&schoolyear=${activeSchoolYear}&termsem=${selectedTermAndSem}&subjectid=undefined&class_schedule=${0}&selected_date=${selectedDate}`,
  );
}

// GET UTILIZATIONS WITH SCHEDULE ID
export async function getUtilizationScheduledClasslist({
  usageId,
  activeSchoolYear,
}) {
  return await axios.get(
    `/api/utilizations?usage_id=${usageId}&schoolyear=${activeSchoolYear}`,
  );
}

// GET UTILIZATION WITH WITH SCHEDULE DATES
export async function getUtilizationsWithDates({
  subjectId,
  laboratory,
  activeSchoolYear,
  weekDates,
  activeTermSem,
  forAcknowledgement,
}) {
  const forWeeklyUsageObj = {
    subjectId,
    laboratory,
    activeSchoolYear,
    weekDates,
    activeTermSem,
    forAcknowledgement,
  };

  return await axios.post(`/api/utilizations-weekdates`, forWeeklyUsageObj);
}

// GET UTILIZATION WITH WITH SCHEDULE DATES
export async function getUtilizationsRemarksWithDates({
  subjectId,
  laboratory,
  activeSchoolYear,
  weekDates,
}) {
  const forWeeklyRemarksObj = {
    subjectId,
    laboratory,
    activeSchoolYear,
    weekDates,
  };

  return await axios.post(
    `/api/utilizations-remarks-weekdates`,
    forWeeklyRemarksObj,
  );
}

// GET UTILIZATION BY TERM
export async function getUtilizationsList({
  laboratory,
  activeSchoolYear,
  activeTermSem,
  subjectId,
  seletedClassSchedule,
  selectedDate,
}) {
  return await axios.get(
    `/api/utilizations-list?laboratory=${laboratory}&schoolyear=${activeSchoolYear}&termsem=${activeTermSem}&subjectid=${subjectId}&class_schedule=${seletedClassSchedule}&selected_date=${selectedDate}`,
  );
}

// GET UTILIZATIONS FOR LABORATORY WEEKLY USAGE
export async function getLaboratoryWeeklyUtilizations({
  laboratory,
  activeSchoolYear,
  activeTermSem,
  subjectId,
  seletedClassSchedule,
  selectedDate,
}) {
  return await axios.get(
    `/api/utilizations-weekly-laboratory?laboratory=${laboratory}&schoolyear=${activeSchoolYear}&termsem=${activeTermSem}&subjectid=${subjectId}&class_schedule=${seletedClassSchedule}&selected_date=${selectedDate}`,
  );
}

// GET UTILIZATIONS FOR DASHBOARD DATA
export async function getLaboratoryUtilizations({
  laboratory,
  seletedClassSchedule,
  scheduledIds,
}) {
  return await axios.post(`/api/utilizations-laboratory`, {
    laboratory,
    seletedClassSchedule,
    scheduledIds,
  });
}

// ADD UTILIZATION
export async function addUtilization(forAddingData) {
  return await axios.post("/api/add-utilization", forAddingData);
}

// DELETE OR CANCEL A UTILIZATION
export async function cancelUtilization(forDeletionData) {
  return await axios.post("/api/cancel-utilization", forDeletionData);
}

// UPDATE UTILIZATION ATTENDANCE
export async function updateStudentAttendance(updatedAttendance) {
  return await axios.patch("/api/utilization-attendance", updatedAttendance);
}

// UPDATE UTILIZATION USAGE AND TIME
export async function updateUtilizationTimeAndUsage(forUpdatingData) {
  return await axios.patch("/api/update-utilization-usage", forUpdatingData);
}

// ADD CLASS END TIME
export async function endUtilization(forAddingData) {
  return await axios.patch("/api/end-utilization", forAddingData);
}

// ============= UTILIZATION REMARKS ================== //
export async function getAfterUsageRemarks(usageId) {
  return await axios.get(`/api/utilization-remarks?usageid=${usageId}`);
}
