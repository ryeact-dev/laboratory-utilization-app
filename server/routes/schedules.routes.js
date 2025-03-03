const express = require('express');
const {
  getSchedulerSchedules,
  getUtilizationSchedules,
  getReservationSchedules,
  addClassSchedule,
  deleteSchedule,
  getSchedulesForToday,
  transferSchedule,
} = require('../controllers/schedules.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/schedules-today', verifyToken, getSchedulesForToday);
router.get('/api/schedules-scheduler', verifyToken, getSchedulerSchedules);
router.get('/api/schedules-utilization', verifyToken, getUtilizationSchedules);
router.post('/api/schedules-reservation', verifyToken, getReservationSchedules);
router.patch('/api/transfer-schedule', verifyToken, transferSchedule);
router.post('/api/add-schedule', verifyToken, addClassSchedule);
router.post('/api/delete-schedule', verifyToken, deleteSchedule);

module.exports = router;
