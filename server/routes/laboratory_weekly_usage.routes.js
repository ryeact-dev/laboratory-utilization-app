const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const {
  getPaginatedLaboratoryReports,
  addLaboratoryWeeklyUtilizations,
  updateLabReportStepStatus,
  updateManyLabWeeklyReports,
} = require('../controllers/laboratory_weekly_usage.controller.js');

const router = express.Router();

router.get(
  '/api/submitted-lab-weekly-reports',
  verifyToken,
  getPaginatedLaboratoryReports
);

router.patch(
  '/api/update-lab-report-status',
  verifyToken,
  updateLabReportStepStatus
);
router.patch(
  '/api/update-many-lab-weekly-reports',
  verifyToken,
  updateManyLabWeeklyReports
);

router.post(
  '/api/submit-lab-weekly-usage',
  verifyToken,
  addLaboratoryWeeklyUtilizations
);

module.exports = router;
