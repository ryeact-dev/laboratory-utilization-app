import axios from "axios";

// FETCH THE LIST OF SCHOOL YEARS
export async function getSchoolYear() {
  return await axios.get(`/api/school-year`);
}

// FETCH ACTIVE SCHOOL YEAR
export async function getActiveSchoolYear() {
  return await axios.get(`/api/active-school-year`);
}

// FETCH THE LIST OF TERMS AND SEMS
export async function getActiveSemestralDate() {
  return await axios.get(`/api/semestral-date`);
}

// FETCH THE LIST OF TERMS AND SEMS
export async function getTermSem() {
  return await axios.get(`/api/term-sem`);
}

// FETCH ACTIVE SCHOOL YEAR
export async function getActiveTermSem() {
  return await axios.get(`/api/active-term-sem`);
}
// GET SELECTED TERM SEM DATES
export async function getSelectedTermSemDates(forQueryData) {
  return await axios.post(`/api/term-sem-dates`, forQueryData);
}

// SET DATES
export async function setDates({ forUpdatingData, isSchoolYear }) {
  if (isSchoolYear) {
    return await axios.patch(`/api/set-dates-school-year`, forUpdatingData);
  } else return await axios.patch(`/api/set-dates-term-sem`, forUpdatingData);
}

// SET ACTIVE TERM SEM
export async function setActiveTermSem(forUpdatingData) {
  return await axios.patch(`/api/set-active-term-sem`, forUpdatingData);
}

// SET ACTIVE SCHOOL YEAR
export async function setActiveSchoolYear(forUpdatingData) {
  return await axios.patch(`/api/set-active-school-year`, forUpdatingData);
}

// ADD NEW SCHOOL YEAR
export async function addSchoolYear(forAddingData) {
  return await axios.post("/api/add-school-year", forAddingData);
}

// ADD NEW SCHOOL YEAR
export async function deleteSchoolYear(forDeletionData) {
  return await axios.post("/api/delete-school-year", forDeletionData);
}
