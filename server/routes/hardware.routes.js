const express = require('express');
const multer = require('multer');
const { verifyToken } = require('../middlewares/verifyToken');

const {
  getPaginatedHardwareList,
  addLaboratoryHardware,
  updateLaboratoryHardware,
  deleteLaboratoryHardware,
  getSystemUnitList,
  addBulkHardwares,
} = require('../controllers/hardware.controller');

const {
  getHardwareUpgrades,
  addHardwareUpgrades,
  deleteHardwareUpgrades,
  updateHardwareUpgrades,
} = require('../controllers/hardware_upgrades.controller');

const router = express.Router();

// Upload excel files
const excelFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/files');
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const filename = date.toDateString() + '-' + file.originalname;
    cb(null, filename);
  },
});

const uploadExcel = multer({ storage: excelFileStorage });

router.get('/api/system-unit', verifyToken, getSystemUnitList);
router.get('/api/hardware', verifyToken, getPaginatedHardwareList);

router.post('/api/add-hardware', verifyToken, addLaboratoryHardware);

router.post(
  '/api/add-bulk-hardware',
  verifyToken,
  uploadExcel.single('uploadedFile'),
  addBulkHardwares
);

router.patch('/api/update-hardware', verifyToken, updateLaboratoryHardware);

router.delete(
  '/api/hardware/:hardwareId',
  verifyToken,
  deleteLaboratoryHardware
);

// HARDWARE UPGRADES
router.get('/api/hardware-upgrades', verifyToken, getHardwareUpgrades);

router.post('/api/add-hardware-upgrades', verifyToken, addHardwareUpgrades);
router.patch(
  '/api/update-hardware-upgrades',
  verifyToken,
  updateHardwareUpgrades
);

router.post(
  '/api/delete-hardware-upgrades',
  verifyToken,
  deleteHardwareUpgrades
);

module.exports = router;
