import axios from "axios";

export async function getPaginatedOfficeStockCards({
  forQueryData,
  search = "",
}) {
  return await axios.post(
    `/api/get-office-stock-cards?search=${search}`,
    forQueryData,
  );
}

export async function getPaginatedLaboratoryStockCards({
  forQueryData,
  search = "",
}) {
  return await axios.post(
    `/api/get-laboratory-stock-cards?search=${search}`,
    forQueryData,
  );
}

export async function getReleasedLaboratoryStockCards({ laboratory }) {
  return await axios.get(
    `/api/released-laboratory-stock-cards?laboratory=${laboratory}`,
  );
}

export async function createEditStockCard({ forAddingData, isNew }) {
  if (isNew) {
    return await axios.post("/api/create-stock-card", forAddingData);
  } else return await axios.patch("/api/update-stock-card", forAddingData);
}

export async function deleteStockCard(stockCardId) {
  return await axios.delete(`/api/delete-stock-card/${stockCardId}`);
}

// ========== STOCK CARD ITEMS ==============
export async function getStockCardItems({
  stockCardId,
  page = 0,
  limit = 50,
  category,
}) {
  return await axios.get(
    `/api/get-stock-card-items?stockcard_id=${stockCardId}&page=${page}&limit=${limit}&category=${category}`,
  );
}

export async function addStockCardItems({ forAddingData, isNew }) {
  if (isNew) {
    return await axios.post("/api/add-stock-card-items", forAddingData);
  } else
    return await axios.patch("/api/update-stock-card-items", forAddingData);
}

export async function deleteLaboratorySingleStockCardItems({
  forDeletionData,
}) {
  return await axios.post(`/api/delete-stock-card-items`, forDeletionData);
}
