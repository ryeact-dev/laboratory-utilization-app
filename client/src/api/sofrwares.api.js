import axios from 'axios';

// GET LIST OF ALL SOFTWARES
export async function getListOfSoftwares({ activeSchoolYear, laboratory }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.get(
    `/api/software?schoolyear=${activeSchoolYear}&laboratory=${laboratory}`
  );
}

// ADD NEW USER
export async function softwareMutation({ forAddingData, isNew }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  if (isNew) {
    return await axios.post('/api/add-software', forAddingData);
  } else {
    return await axios.patch('/api/update-software', forAddingData);
  }
}

// DELETE A USER
export async function deleteSoftware(softwareId) {
  return await axios.delete(`/api/software/${softwareId}`);
}
