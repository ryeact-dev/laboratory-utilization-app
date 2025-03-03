import axios from 'axios';

// FETCH CLASSLIST STUDENTS
export async function getClasslistStudents(classlist) {
  return await axios.post('/api/classlist-students', { classlist });
}

// FETCH STUDENTS (NAMES AND IDS ONLY)
export async function getStudentNameAndId({ studentIdNumber }) {
  return await axios.get(
    `/api/get-student-name-id?student_id_number=${studentIdNumber}`
  );
}

// FETCH PAGINATED CLASSLIST
export async function getPaginatedClasslist(page, classlist, studentsCount) {
  return await axios.post('/api/paginated-classlist', {
    page,
    classlist,
    studentsCount,
  });
}

// FETCH PAGINATED LIST OF STUDENTS
export async function getPaginatedStudents(
  page,
  studentIdNumber,
  studentsCount
) {
  return await axios.get(
    `/api/paginated-students?page=${page}&studentid=${studentIdNumber}&perpage=${studentsCount}`
  );
}

// DELETE STUDENT
export async function deleteStudent(forDeletionData) {
  return await axios.post('/api/delete-student', forDeletionData);
}

// ADD or UPDATE SUBJECT
export async function addEditStudent({ studentData, submissionType }) {
  //   await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  if (submissionType === 'bulk') {
    const headersConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return await axios.post('/api/bulk-students', studentData, headersConfig);
  } else if (submissionType === 'update') {
    return await axios.put('/api/update-student', studentData);
  } else return await axios.post('/api/add-student', studentData);
}
