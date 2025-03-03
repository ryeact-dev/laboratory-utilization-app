const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');

const {
  addReportSubmission,
  getPaginatedReports,
  getStepStatus,
  updateStepStatus,
  updateManyReports,
  getSubmittedReportsByWeekdates,
  addManyReportSubmission,
  deleteWeeklyUsageReport,
} = require('../controllers/instructor_weekly_usage.controller');

const router = express.Router();

router.get('/api/submitted-reports', verifyToken, getPaginatedReports);
router.post(
  '/api/submitted-weekly-reports',
  verifyToken,
  getSubmittedReportsByWeekdates
);

router.patch('/api/update-step-status', verifyToken, updateStepStatus);
router.patch('/api/update-reports-status', verifyToken, updateManyReports);

router.post('/api/report-step-status', verifyToken, getStepStatus);
router.post('/api/submit-reports', verifyToken, addReportSubmission);
router.post('/api/submit-many-reports', verifyToken, addManyReportSubmission);

router.delete(
  '/api/delete-submitted-report/:id',
  verifyToken,
  deleteWeeklyUsageReport
);

module.exports = router;
