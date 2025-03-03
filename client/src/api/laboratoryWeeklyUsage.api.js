import axios from 'axios';

// GET ALL SUBMITTED REPORTS BY USERID
export async function getSubmittedLabReports({ forQueryData }) {
  const { selectedTermAndSem, page, reportCount, wasAcknowledged, laboratory } =
    forQueryData;
  return await axios.get(
    `/api/submitted-lab-weekly-reports?termsem=${selectedTermAndSem}&page=${page}&perpage=${reportCount}&wasAcknowledged=${wasAcknowledged}&laboratory=${laboratory}`
  );
}

// ADD NEW OR UPDATE REPORT
export async function submitLaboratoryWeeklyReport({
  forAddingData,
  forUpdatingData,
  isNew,
}) {
  // await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 500 milliseconds

  if (isNew) {
    return await axios.post('/api/submit-lab-weekly-usage', forAddingData);
  } else {
    return await axios.patch('/api/update-lab-report-status', forUpdatingData);
  }
}

// UPDATE MANY LABORATORY WEEKLY REPORTS
export async function updateManyLabWeeklyReports(forUpdatingData) {
  return await axios.patch(
    '/api/update-many-lab-weekly-reports',
    forUpdatingData
  );
}
