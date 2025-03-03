const express = require('express');

const {
  getLaboratoryWifiVouchers,
  addLaboratoryWifiVoucher,
  getSingleLabWifiVoucher,
} = require('../controllers/wifi_vouchers.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/lab-wifi-voucher', verifyToken, getSingleLabWifiVoucher);
router.post('/api/wifi-vouchers', verifyToken, getLaboratoryWifiVouchers);
router.patch(
  '/api/update-wifi-vouchers',
  verifyToken,
  addLaboratoryWifiVoucher
);

module.exports = router;
