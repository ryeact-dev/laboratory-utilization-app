import axios from 'axios';

// GET LIST OF NO-CLASS DAYS
export async function getNoClassDays({ activeSchoolYear, activeTermSem }) {
  return await axios.get(
    `/api/no-class-days?schoolyear=${activeSchoolYear}&termsem=${activeTermSem}`
  );
}

// ADD NO-CLASS DAYS
export async function addNoClassDays(forAddingData) {
  return await axios.post('/api/add-no-class-days', forAddingData);
}

// DELETE NO-CLASS DAYS
export async function deleteNoClassDate(forDeletionData) {
  return await axios.delete(`/api/delete-no-class-days/${forDeletionData}`);
}
