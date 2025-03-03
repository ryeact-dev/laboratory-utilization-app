const express = require('express');

const {
  getSubjectRemarks,
  getAllRemarks,
  addUtilizationRemarks,
  deleteUtilizationRemark,
} = require('../controllers/after_usage_remarks.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/remarks', verifyToken, getSubjectRemarks);
router.get('/api/all-remarks', verifyToken, getAllRemarks);
router.post('/api/add-remarks', verifyToken, addUtilizationRemarks);
router.post('/api/delete-remark', verifyToken, deleteUtilizationRemark);

module.exports = router;
