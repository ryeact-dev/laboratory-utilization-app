const express = require('express');

const { verifyToken } = require('../middlewares/verifyToken');
const {
  createStockCard,
  getPaginatedOfficeStockCards,
  getPaginatedLaboratoryStockCards,
  updateStockCard,
  deleteStockCard,
  getReleasedLaboratoryStockCards,
} = require('../controllers/stock_card.controller');
const {
  getPaginatedStockCardItems,
  addStockCardItems,
  updateStockCardItems,
  deleteLaboratorySingleStockCardItems,
} = require('../controllers/stock_card_item.controller');

const router = express.Router();

// ===== STOCK CARD =====

router.post(
  '/api/get-office-stock-cards',
  verifyToken,
  getPaginatedOfficeStockCards
);

router.post(
  '/api/get-laboratory-stock-cards',
  verifyToken,
  getPaginatedLaboratoryStockCards
);

router.get(
  '/api/released-laboratory-stock-cards',
  verifyToken,
  getReleasedLaboratoryStockCards
);

router.post('/api/create-stock-card', verifyToken, createStockCard);

router.patch('/api/update-stock-card', verifyToken, updateStockCard);

router.delete('/api/delete-stock-card/:id', verifyToken, deleteStockCard);

// ====== STOCK CARD DETAILS ======

router.get(
  '/api/get-stock-card-items',
  verifyToken,
  getPaginatedStockCardItems
);

router.post('/api/add-stock-card-items', verifyToken, addStockCardItems);

router.patch('/api/update-stock-card-items', verifyToken, updateStockCardItems);

router.post(
  '/api/delete-stock-card-items',
  verifyToken,
  deleteLaboratorySingleStockCardItems
);

module.exports = router;
