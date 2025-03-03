import axios from "axios";

// GET ALL SUBMITTED REPORTS BY USERID
export async function getSubmittedReports({ forQueryData }) {
  const {
    selectedTermAndSem,
    page,
    reportCount,
    userRoleStep,
    wasAcknowledged,
    laboratory,
  } = forQueryData;

  return await axios.get(
    `/api/submitted-reports?termsem=${selectedTermAndSem}&page=${page}&perpage=${reportCount}&userRoleStep=${userRoleStep}&wasAcknowledged=${wasAcknowledged}&laboratory=${laboratory}`,
  );
}

// GET ALL SUBMITTED REPORTS BY WEEKDATES
export async function getSubmittedWeeklyReports({ forQueryData }) {
  return await axios.post(`/api/submitted-weekly-reports`, forQueryData);
}

// ADD NEW OR UPDATE REPORT
export async function submitReport({ forAddingData, isNew }) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds

  if (isNew) {
    return await axios.post("/api/submit-reports", forAddingData);
  } else {
    return await axios.patch("/api/update-step-status", forAddingData);
  }
}

// ADD MANY NEW REPORTS
export async function submitManyReports({ forAddingData }) {
  return await axios.post("/api/submit-many-reports", { forAddingData });
}

// UPDATE REPORT STEP STATUS
export async function getReportStepStatus({ forQueryData }) {
  return await axios.post("/api/report-step-status", forQueryData);
}

// UPDATE MANY REPORTS STEP STATUS
export async function updateManyReportsStepStatus(forUpdatingData) {
  return await axios.patch("/api/update-reports-status", forUpdatingData);
}

// UPDATE MANY REPORTS STEP STATUS
export async function deleteSubmittedReport(forUpdatingData) {
  return await axios.delete(`/api/delete-submitted-report/${forUpdatingData}`);
}
