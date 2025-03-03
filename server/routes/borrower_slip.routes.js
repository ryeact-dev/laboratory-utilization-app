const express = require('express');

const {
  getPaginatedLabBorrowerSlips,
  addBorrowerSlipItems,
  getBorrowerSlipItems,
  updateLabBorrowerSlip,
  deleteLabBorrowerSlip,
  deleteBorrowerSlipItems,
  createLabBorrowerSlip,
  releaseLabBorrowerSlip,
  updateLabBorrowerSlipItem,
  returnLabBorrowerSlip,
  getBorrowerSlipUsers,
  getSingleLabBorrowerSlip,
} = require('../controllers/borrower_slip.controller');

const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

// ===== BORROWER SLIPS =====

router.get(
  '/api/get-lab-borrower-slips',
  verifyToken,
  getPaginatedLabBorrowerSlips
);
router.get(
  '/api/get-single-lab-borrower-slip/:id',
  verifyToken,
  getSingleLabBorrowerSlip
);

router.post('/api/create-borrower-slip', verifyToken, createLabBorrowerSlip);
router.patch('/api/update-borrower-slip', verifyToken, updateLabBorrowerSlip);
router.patch('/api/release-borrower-slip', verifyToken, releaseLabBorrowerSlip);
router.patch('/api/return-borrower-slip', verifyToken, returnLabBorrowerSlip);

// ====== BORROWER SLIP ITEMS ======

router.get(
  '/api/get-borrower-slip-items/:id',
  verifyToken,
  getBorrowerSlipItems
);
router.post('/api/add-borrower-slip-items', verifyToken, addBorrowerSlipItems);
router.patch(
  '/api/update-borrower-slip-items',
  verifyToken,
  updateLabBorrowerSlipItem
);
router.post(
  '/api/delete-borrower-slip-item',
  verifyToken,
  deleteBorrowerSlipItems
);

// ========== BORROWER SLIP USERS ===========

router.get(
  '/api/get-borrower-slip-users/:id',
  verifyToken,
  getBorrowerSlipUsers
);
router.delete(
  '/api/delete-borrower-slip/:id',
  verifyToken,
  deleteLabBorrowerSlip
);

module.exports = router;
