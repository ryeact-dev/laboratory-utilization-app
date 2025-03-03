import axios from 'axios';

// GET UTILIZATION REMARKS
export async function getUtilizationRemarks({ usageId }) {
  return await axios.get(`/api/remarks?usageid=${usageId}`);
}

// GET UTILIZATION REMARKS
export async function getAllUtilizationRemarks({ activeSchoolYear }) {
  return await axios.get(`/api/all-remarks?schoolyear=${activeSchoolYear}`);
}

// ADD NEW REMARKS
export async function addRemarks(forAdding) {
  return await axios.post('/api/add-remarks', forAdding);
}

// DELETE SCHEDULE
export async function deleteRemark(forDeletionData) {
  return await axios.post('/api/delete-remark', forDeletionData);
}
