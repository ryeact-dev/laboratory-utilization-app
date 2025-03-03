const express = require('express');

const { verifyToken } = require('../middlewares/verifyToken');

const {
  getLaboratoryOrientation,
  getsSingleLaboratoryOrientation,
  updateMultipleLaboratoryOrientation,
  deleteLaboratoryOrientation,
  updateSingleLaboratoryOrientation,
} = require('../controllers/laboratory_orientation.controller');

const router = express.Router();

router.post(
  '/api/single-laboratory-orientation',
  verifyToken,
  getsSingleLaboratoryOrientation
);

router.post(
  '/api/list-of-laboratory-orientation',
  verifyToken,
  getLaboratoryOrientation
);

router.patch(
  '/api/update-multiple-laboratory-orientation',
  verifyToken,
  updateMultipleLaboratoryOrientation
);

router.patch(
  '/api/update-single-laboratory-orientation',
  verifyToken,
  updateSingleLaboratoryOrientation
);

router.delete(
  '/api/delete-laboratory-orientation/:id',
  verifyToken,
  deleteLaboratoryOrientation
);

module.exports = router;
