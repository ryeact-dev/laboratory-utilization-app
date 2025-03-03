const express = require('express');

const {
  getListOfHolidays,
  addNoClassDay,
  deleteNoClassDay,
} = require('../controllers/no_class_day.controller');

const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/no-class-days', getListOfHolidays);
router.post('/api/add-no-class-days', verifyToken, addNoClassDay);
router.delete(
  '/api/delete-no-class-days/:listId',
  verifyToken,
  deleteNoClassDay
);

module.exports = router;
