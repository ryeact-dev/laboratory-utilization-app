const express = require('express');

const { verifyToken } = require('../middlewares/verifyToken');
const {
  addSubmittedMISM,
  getPaginatedListOfMISM,
  deleteMISM,
  acknowledgeMISM,
  getForAcknowledgementNotifications,
} = require('../controllers/stock_card_item_mism.controller');

const router = express.Router();

router.get('/api/get-stock-card-mism', verifyToken, getPaginatedListOfMISM);
router.get(
  '/api/for-acknowledgement-notifications-mism',
  verifyToken,
  getForAcknowledgementNotifications
);

router.post('/api/add-stock-card-mism', verifyToken, addSubmittedMISM);

router.patch('/api/acknowledge-stock-card-mism', verifyToken, acknowledgeMISM);

router.delete('/api/delete-stock-card-mism/:id', verifyToken, deleteMISM);

module.exports = router;
