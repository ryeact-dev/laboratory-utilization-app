const express = require('express');

const {
  getSchoolYearList,
  getActiveSchoolYear,
  getTermSemList,
  getActiveTermSem,
  setActiveTermSem,
  setTermSemDates,
  setActiveSchoolYear,
  removeSchoolYear,
  addSchoolYear,
  getActiveSemestralDate,
  getSelectedTermSemDates,
  setSemDates,
} = require('../controllers/sy_term_sem.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/school-year', getSchoolYearList);
router.get('/api/active-school-year', getActiveSchoolYear);

router.get('/api/term-sem', getTermSemList);
router.get('/api/active-term-sem', getActiveTermSem);
router.get('/api/semestral-date', getActiveSemestralDate);

router.patch('/api/set-dates-term-sem', verifyToken, setTermSemDates);
router.patch('/api/set-dates-school-year', verifyToken, setSemDates);
router.patch('/api/set-active-term-sem', verifyToken, setActiveTermSem);
router.patch('/api/set-active-school-year', verifyToken, setActiveSchoolYear);

router.post('/api/term-sem-dates', verifyToken, getSelectedTermSemDates);
router.post('/api/add-school-year', verifyToken, addSchoolYear);
router.post('/api/delete-school-year', verifyToken, removeSchoolYear);

module.exports = router;
