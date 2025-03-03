const express = require('express');
const multer = require('multer');

const {
  addUser,
  userLogin,
  updateUserPassword,
  updateUser,
  deleteUser,
  userLogout,
  googleLogin,
  getPaginatedUsers,
  getListOfFaculty,
  getCurrentUserData,
  updateUserStatus,
  assignUserLaboratories,
  assignUserOffices,
  getListOfProgramHeadAndDean,
  pageReload,
} = require('../controllers/users.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const onlineUsers = require('../middlewares/onlineUsers');

const router = express.Router();

const multerFields = [
  { name: 'photo_url', maxCount: 1 },
  { name: 'esign_url', maxCount: 1 },
];

router.patch(
  '/api/update-user',
  verifyToken,
  multer({ dest: 'uploads/img/dummy' }).fields(multerFields),
  updateUser
);

router.post(
  '/api/register-user',
  verifyToken,
  multer({ dest: 'uploads/img/dummy' }).fields(multerFields),
  addUser
);

router.get(
  '/api/current-user-data',
  verifyToken,
  onlineUsers,
  getCurrentUserData
);
router.get('/api/paginated-users', verifyToken, onlineUsers, getPaginatedUsers);
router.get('/api/faculty', verifyToken, getListOfFaculty);
router.get('/api/program-head-dean', verifyToken, getListOfProgramHeadAndDean);

router.patch('/api/update-user-status', verifyToken, updateUserStatus);
router.patch('/api/update-password', verifyToken, updateUserPassword);
router.patch(
  '/api/assign-user-laboratories',
  verifyToken,
  assignUserLaboratories
);
router.patch('/api/assign-user-offices', verifyToken, assignUserOffices);

router.post('/api/users/login', userLogin);
router.patch('/api/users/google', googleLogin);
router.get('/api/users/logout', verifyToken, userLogout);
router.delete('/api/users/:userId', verifyToken, deleteUser);

router.post('/api/page-reload', verifyToken, pageReload);

module.exports = router;
