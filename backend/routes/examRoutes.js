const express = require('express');
const router = express.Router();
const examCtrl = require('../controllers/examController');


// GET by professor full name
router.get('/search', examCtrl.getByProfessorName);

// GET student exams
router.get('/studentexams/:student_id', examCtrl.getStudentExams);

// GET for exams requests
router.get('/requested', examCtrl.requested);

// GET approved exams by prof id
router.get('/approved/:professor_id', examCtrl.getAllApprovedByProfId);

// GET approved exams
router.get('/approved', examCtrl.getAllApproved);

// GET by professor id
router.get('/professor/:professor_id', examCtrl.getByProfessorId);

// GET by name
router.get('/name/:name', examCtrl.getByName);

// GET all
router.get('/', examCtrl.getAll);

// GET by code
router.get('/:code', examCtrl.getByCode);

//POST to create an exam
router.post('/', examCtrl.create);

// PUT to approve/disapprove an exam
router.put('/approve', examCtrl.approve);

// SET enrolled students number by exam code
router.put('/enrolledstudents', examCtrl.setEnrolledStudentsNumber);

module.exports = router;