const express = require('express');
const multer = require('multer');

const {
  getPaginatedStudents,
  addStudent,
  getPaginatedClasslist,
  addBulkStudents,
  updateStudent,
  deleteStudent,
  getSingleSubjectClasslist,
  getAllStudentsNamesAndIds,
} = require('../controllers/students.controller');
const { verifyToken } = require('../middlewares/verifyToken');

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

const multerFields = [
  { name: 'esign', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
];

router.post(
  '/api/bulk-students',
  verifyToken,
  uploadExcel.single('uploadedFile'),
  addBulkStudents
);

router.put(
  '/api/update-student',
  verifyToken,
  multer({ dest: 'uploads/img/dummy' }).fields(multerFields),
  updateStudent
);

router.post(
  '/api/add-student',
  verifyToken,
  multer({ dest: 'uploads/img/dummy' }).fields(multerFields),
  addStudent
);

router.get('/api/paginated-students', verifyToken, getPaginatedStudents);
router.get('/api/get-student-name-id', verifyToken, getAllStudentsNamesAndIds);

router.post('/api/paginated-classlist', verifyToken, getPaginatedClasslist);
router.post('/api/classlist-students', verifyToken, getSingleSubjectClasslist);

router.post('/api/delete-student', verifyToken, deleteStudent);

module.exports = router;
