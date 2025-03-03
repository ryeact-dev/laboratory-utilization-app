const express = require('express');

const {
  getPrevUtilizations,
  getUtilizationWithScheduleId,
  getLaboratoryUtilizations,
  getTermUtilizations,
  getWeeklyUtilizations,
  getUtilizationRemarksWeekdates,
  addUtilization,
  cancelUtilization,
  utilizationAttendance,
  addClassEndTime,
  getLaboratoryWeeklyUtilizations,
  updateUtilizationTimeAndUsage,
} = require('../controllers/utilizations.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/previous-utilizations', getPrevUtilizations);
router.get('/api/utilizations', getUtilizationWithScheduleId);
router.get(
  '/api/utilizations-weekly-laboratory',
  verifyToken,
  getLaboratoryWeeklyUtilizations
);
router.get('/api/utilizations-list', verifyToken, getTermUtilizations);

router.post('/api/utilizations-weekdates', verifyToken, getWeeklyUtilizations);
router.post(
  '/api/utilizations-laboratory',
  verifyToken,
  getLaboratoryUtilizations
);
router.post(
  '/api/utilizations-remarks-weekdates',
  verifyToken,
  getUtilizationRemarksWeekdates
);

router.post('/api/add-utilization', verifyToken, addUtilization);
router.post('/api/cancel-utilization', verifyToken, cancelUtilization);
router.patch(
  '/api/update-utilization-usage',
  verifyToken,
  updateUtilizationTimeAndUsage
);
router.patch('/api/utilization-attendance', verifyToken, utilizationAttendance);
router.patch('/api/end-utilization', verifyToken, addClassEndTime);

module.exports = router;
