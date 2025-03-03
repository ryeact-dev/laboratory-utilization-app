import axios from 'axios';

// GET LIST OF ALL SOFTWARES
export async function getListOfHardwares({ activeSchoolYear, laboratory }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.get(
    `/api/hardware?schoolyear=${activeSchoolYear}&laboratory=${laboratory}`
  );
}

export async function getPaginatedListOfHardwares({
  activeSchoolYear,
  laboratory,
  page,
  perpage,
  propertyno,
}) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.get(
    `/api/hardware?schoolyear=${activeSchoolYear}&laboratory=${laboratory}&page=${page}&perpage=${perpage}&propertyno=${propertyno}`
  );
}

export async function getSystemUnitList({ laboratory }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.get(`/api/system-unit?laboratory=${laboratory}`);
}

// ADD NEW USER
export async function hardwareMutation({
  forAddingData,
  isNew,
  submissionType,
}) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds

  if (submissionType === 'bulk')
    return await axios.post('/api/add-bulk-hardware', forAddingData);

  if (isNew) {
    return await axios.post('/api/add-hardware', forAddingData);
  } else {
    return await axios.patch('/api/update-hardware', forAddingData);
  }
}

// DELETE A USER
export async function deleteHardware(hardwareId) {
  return await axios.delete(`/api/hardware/${hardwareId}`);
}

// =========== HARDWARE UPGRADES =============

export async function getUpgradeList({ hardwareId, laboratory }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  return await axios.get(
    `/api/hardware-upgrades?hardwareId=${hardwareId}&laboratory=${laboratory}`
  );
}

// ADD NEW USER
export async function addHardwareUpgrades({ forAddingData, isNew }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds
  if (isNew) {
    return await axios.post('/api/add-hardware-upgrades', forAddingData);
  }
  return await axios.patch('/api/update-hardware-upgrades', forAddingData);
}

// DELETE A USER
export async function deleteHardwareUpgrade(forDeletingData) {
  return await axios.post(`/api/delete-hardware-upgrades`, forDeletingData);
}
