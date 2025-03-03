import axios from "axios";

// GET CURRENT USER DATA
export async function getCurrentUserData() {
  const clientVersion = import.meta.env.VITE_CLIENT_VERSION;
  const { data } = await axios.get(
    `/api/current-user-data?client_version=${clientVersion}`,
  );
  return data;
}

// GET ALL USERS WITH PARAMS
export async function getPaginatedUsers({ page, count, username = "" }) {
  return await axios.get(
    `/api/paginated-users?page=${page}&perpage=${count}&username=${username}`,
  );
}

// GET LIST OF FACULTY
export async function getListOfFaculty({ facultyName }) {
  return await axios.get(`/api/faculty?faculty_name=${facultyName}`);
}

// GET LIST OF PROGRAM HEAD AND DEAN
export async function getListOfProgramHeadAndDean({ facultyName }) {
  return await axios.get(`/api/program-head-dean?faculty_name=${facultyName}`);
}

// LOGIN USER
export async function loginUser(forLoginData) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.post("/api/users/login", forLoginData);
}

// LOGOUT USER
export async function logoutUser() {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.get("/api/users/logout");
}

// ADD NEW USER
export async function userMutation({ forAddingData, isNew }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  if (isNew) {
    return await axios.post("/api/register-user", forAddingData);
  } else {
    return await axios.patch("/api/update-user", forAddingData);
  }
}

// UPDATE USER PASSWORD
export async function updateUserPassword(updatedData) {
  return await axios.patch("/api/update-password", updatedData);
}

// UPDATE USER STATUS
export async function updateUserStatus(forUpdatingData) {
  return await axios.patch("/api/update-user-status", forUpdatingData);
}

// ASSIGN USER LABORATORIES
export async function assignUserLaboratories(forUpdatingData) {
  return await axios.patch("/api/assign-user-laboratories", forUpdatingData);
}

// ASSIGN USER OFFICES
export async function assignUserOffices(forUpdatingData) {
  return await axios.patch("/api/assign-user-offices", forUpdatingData);
}

// DELETE A USER
export async function deleteUser(userId) {
  return await axios.delete(`/api/users/${userId}`);
}

// GOOGLE LOGIN
export async function googleLogin(googleUserData) {
  return await axios.patch("/api/users/google", googleUserData);
}

// PAGE RELOAD
export async function pageReload() {
  return await axios.post("/api/page-reload");
}
