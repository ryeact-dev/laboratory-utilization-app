import axios from "axios";

// GET LIST OF LABORATORY ORIENTATION BASED ON ACKNOWLEDGEDMENT STATUS
export async function getLaboratoryOrientation({ forQueryData }) {
  return await axios.post(`/api/list-of-laboratory-orientation`, forQueryData);
}

// GET LIST OF LABORATORY ORIENTATION BASED ON ACKNOWLEDGEDMENT STATUS
export async function getSingleLaboratoryOrientation({ forQueryData }) {
  return await axios.post(`/api/single-laboratory-orientation`, forQueryData);
}

// UPDATE MULTIPLE LABORATORY ORIENTATIONS
export async function updateMultipleLaboratoryOrientations({
  forUpdatingData,
}) {
  return await axios.patch(
    `/api/update-multiple-laboratory-orientation`,
    forUpdatingData,
  );
}

// UPDATE SINGLE LABORATORY ORIENTATION
export async function updateSingleLaboratoryOrientations({ forUpdatingData }) {
  return await axios.patch(
    `/api/update-single-laboratory-orientation`,
    forUpdatingData,
  );
}

// DELETE LABORATORY ORIENTATION
export async function deleteLaboratoryOrientation(forDeletionData) {
  return await axios.delete(
    `/api/delete-laboratory-orientation/${forDeletionData}`,
  );
}
