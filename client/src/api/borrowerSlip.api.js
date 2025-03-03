import axios from "axios";

export async function getPaginatedLabBorrowerSlips({
  laboratory,
  selectedTermSem,
  wasReturned,
  isCustodian,
  bSlipStatus,
}) {
  return await axios.get(
    `/api/get-lab-borrower-slips?laboratory=${laboratory}&termsem=${selectedTermSem}&was_returned=${wasReturned}&is_custodian=${isCustodian}&bslip_status=${bSlipStatus}`,
  );
}

export async function getSingleLabBorrowerSlip(borrowerSlipId) {
  return await axios.get(`/api/get-single-lab-borrower-slip/${borrowerSlipId}`);
}

export async function createBorrowerSlip({ forAddingData }) {
  return await axios.post("/api/create-borrower-slip", forAddingData);
}

export async function updateBorrowerSlip({ forAddingData }) {
  return await axios.patch("/api/update-borrower-slip", forAddingData);
}

export async function deleteBorrowerSlip(borrowerSlipId) {
  return await axios.delete(`/api/delete-borrower-slip/${borrowerSlipId}`);
}

// ========== BORROWER SLIP ITEMS ==============
export async function getBorrowerSlipItems({ borrowerSlipId }) {
  return await axios.get(`/api/get-borrower-slip-items/${borrowerSlipId}`);
}

export async function addBorrowerSlipItems({ forAddingData, isNew }) {
  if (isNew) {
    return await axios.post("/api/add-borrower-slip-items", forAddingData);
  } else
    return await axios.patch("/api/update-borrower-slip-items", forAddingData);
}

export async function deleteBorrowerSlipItem({ forDeletionData }) {
  return await axios.post(`/api/delete-borrower-slip-item`, forDeletionData);
}

// ========== BORROWER SLIP USERS =========

export async function getBorrowerSlipUsers(borrowerSlipId) {
  return await axios.get(`/api/get-borrower-slip-users/${borrowerSlipId}`);
}

export async function releaseLabBorrowerSlip({ forUpdatingData }) {
  return await axios.patch(`/api/release-borrower-slip/`, forUpdatingData);
}

export async function returnLabBorrowerSlip({ forUpdatingData }) {
  return await axios.patch(`/api/return-borrower-slip`, forUpdatingData);
}
