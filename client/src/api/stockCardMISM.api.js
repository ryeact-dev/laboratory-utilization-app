import axios from "axios";

// ========== STOCK CARD MISM ==============
export async function getPaginatedMISM({
  laboratory,
  searchTerm,
  category,
  schoolyear,
  page = 0,
  limit = 50,
  submissionDate,
}) {
  return await axios.get(
    `/api/get-stock-card-mism?search_term=${searchTerm}&laboratory=${laboratory}&category=${category}&schoolyear=${schoolyear}&page=${page}&limit=${limit}&date=${submissionDate?.toString()}`,
  );
}

export async function getSubmittedMISMNotifications({ schoolyear }) {
  return await axios.get(
    `/api/for-acknowledgement-notifications-mism?&schoolyear=${schoolyear}`,
  );
}

export async function getForAcknoewledgementMISMCount() {
  return await axios.get("/api/count-acknowledgement-stock-card-mism");
}

export async function addSubmittedMISM({ forAddingData }) {
  return await axios.post("/api/add-stock-card-mism", forAddingData);
}

export async function acknowledgeSubmittedMISM({ forUpdatingData }) {
  return await axios.patch("/api/acknowledge-stock-card-mism", forUpdatingData);
}

export async function deleteMISM(mismId) {
  return await axios.delete(`/api/delete-stock-card-mism/${mismId}`);
}
