const express = require('express');

const {
  getSchoolYearSubjects,
  getPaginatedSubjects,
  getSingleSubject,
  deleteSubject,
  addSubject,
  updateSubject,
  addClasslistStudent,
  removeClasslitStudent,
  addBulkClasslistStudents,
} = require('../controllers/subjects.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/api/subjects', getSchoolYearSubjects);
router.get('/api/specific-subject', getSingleSubject);
router.post('/api/paginated-subjects', verifyToken, getPaginatedSubjects);

router.post('/api/add-subject', verifyToken, addSubject);
router.patch('/api/update-subject', verifyToken, updateSubject);
router.post('/api/delete-subject', verifyToken, deleteSubject);

router.patch('/api/subjects', verifyToken, addClasslistStudent);
router.patch('/api/remove-students', verifyToken, removeClasslitStudent);
router.patch('/api/batch-students', verifyToken, addBulkClasslistStudents);

module.exports = router;
