import axios from "axios";

// * FETCH ALL SUBJECTS FOR THIS CURRENT SY IN PAGINATION
export async function getPaginatedSubjects(
  page,
  activeSchoolYear,
  selectedTermAndSem,
  subjectCode,
  perpage,
  isSemestral,
) {
  return await axios.post(`/api/paginated-subjects`, {
    page,
    activeSchoolYear,
    selectedTermAndSem,
    subjectCode,
    perpage,
    isSemestral,
  });
}

// * FETCH A SUBJECT
export async function getSingleSubject({
  subjectId,
  subjectCode,
  activeSchoolYear,
}) {
  return await axios.get(
    `/api/specific-subject?id=${subjectId}&&code=${subjectCode}&schoolyear=${activeSchoolYear}`,
  );
}

// * DELETE SUBJECT
export async function deleteSubject(forDeletionData) {
  return await axios.post("/api/delete-subject", forDeletionData);
}

// * ADD or UPDATE SUBJECT
export async function addEditSubject({ subjectData, isSubjectNew }) {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  if (isSubjectNew) {
    return await axios.post("/api/add-subject", subjectData);
  } else {
    return await axios.patch("/api/update-subject", subjectData);
  }
}

// * UPDATE CLASSLIST STUDENTS
export async function addClasslistStudents({
  studentId,
  subjectId,
  activeSchoolYear,
}) {
  const addStudentData = {
    studentId,
    subjectId,
    activeSchoolYear,
  };
  return await axios.patch("/api/subjects", addStudentData);
}

// * REMOVE CLASSLIST STUDENTS
export async function removeClasslistStudents(forDeletionData) {
  return await axios.patch("/api/remove-students", forDeletionData);
}

// * ADD BATCH STUDENTS TO CLASSLIST
export async function uploadBatchStudentsClasslist(forUpdatingData) {
  return await axios.patch("/api/batch-students", forUpdatingData);
}
