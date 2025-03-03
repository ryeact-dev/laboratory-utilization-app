import axios from "axios";

// GET SCHEDULES FOR SCHEDULER
export async function getSchedulerSchedules({
  laboratory,
  activeSchoolYear,
  activeTermSem,
}) {
  return await axios.get(
    `/api/schedules-scheduler?laboratory=${laboratory}&schoolyear=${activeSchoolYear}&termsem=${activeTermSem}`,
  );
}

// GET RESERVATION SCHEDULES
export async function getReservationSchedules({
  activeSchoolYear,
  activeTermSem,
  currentUser,
}) {
  const { role, fullName, laboratory } = currentUser;

  const requestData = {
    activeSchoolYear,
    activeTermSem,
    userRole: role,
    fullName,
    laboratory,
  };

  return await axios.post("/api/schedules-reservation", requestData);
}

// GET TODAY'S SCHEDULE
export async function getSchedulesForToday({
  laboratory,
  activeSchoolYear,
  activeTermSem,
  seletedClassSchedule,
}) {
  return await axios.get(
    `/api/schedules-today?laboratory=${laboratory}&schoolyear=${activeSchoolYear}&termsem=${activeTermSem}&class_schedule=${seletedClassSchedule}`,
  );
}

// GET UTILIZATION SCHEDULES
export async function getUtilizationSchedules({
  laboratory,
  activeSchoolYear,
  activeTermSem,
  seletedClassSchedule,
  utilizationType,
}) {
  return await axios.get(
    `/api/schedules-utilization?laboratory=${laboratory}&schoolyear=${activeSchoolYear}&termsem=${activeTermSem}&class_schedule=${seletedClassSchedule}&util_type=${utilizationType}`,
  );
}

// ADD NEW SCHEDULE
export async function addSchedule({ scheduleData }) {
  return await axios.post("/api/add-schedule", scheduleData);
}

// TRANSFER SCHEDULE TO ANOTHER LABORATORY
export async function transferSchedule({ forUpdatingData }) {
  return await axios.patch("/api/transfer-schedule", forUpdatingData);
}

// DELETE SCHEDULE
export async function deleteSchedule(forDeletionData) {
  return await axios.post("/api/delete-schedule", forDeletionData);
}
