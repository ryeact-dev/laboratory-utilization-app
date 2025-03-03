const express = require('express');

const {
  getLaboratorySoftware,
  addLaboratorySoftware,
  updateLaboratorySoftware,
  deleteLaboratorySoftware,
} = require('../controllers/software.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/software', verifyToken, getLaboratorySoftware);
router.post('/api/add-software', verifyToken, addLaboratorySoftware);
router.patch('/api/update-software', verifyToken, updateLaboratorySoftware);
router.delete(
  '/api/software/:softwareId',
  verifyToken,
  deleteLaboratorySoftware
);

module.exports = router;
