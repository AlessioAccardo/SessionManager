const express = require('express');
const router = express.Router();
const enrolledStudentsCtrl = require('../controllers/enrolledStudentsController');

// GET search
router.get('/search', enrolledStudentsCtrl.search);

// PUT to update taken
router.put('/:student_id/:exam_code/taken', enrolledStudentsCtrl.updateTaken)

// DELETE student
router.delete('/:student_id/:exam_code', enrolledStudentsCtrl.deleteEnrolledStudent);

// GET all
router.get('/', enrolledStudentsCtrl.getAll);

// POST to enroll a student
router.post('/enroll', enrolledStudentsCtrl.enrollStudent);

module.exports = router;