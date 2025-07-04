const express = require('express');
const router = express.Router();
const enrolledStudentsCtrl = require('../controllers/enrolledStudentsController');

// DELETE to unenroll a student
router.delete('/unenroll', enrolledStudentsCtrl.unenrollStudent);

// GET exams by enrolled student id
router.get('/student/:student_id', enrolledStudentsCtrl.getExamsByEnrolledStudentId);

// GET students by exam code
router.get('/exam/:exam_code', enrolledStudentsCtrl.getEnrolledStudentsByExam);

// GET all
router.get('/', enrolledStudentsCtrl.getAll);

// POST to enroll a student
router.post('/enroll', enrolledStudentsCtrl.enrollStudent);

module.exports = router;