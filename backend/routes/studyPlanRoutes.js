const express = require('express');
const router = express.Router();
const studyPlanCtrl = require('../controllers/studyPlanController');

// GET by student id
router.get('/student/:student_id', studyPlanCtrl.getByStudentId);

// GET by student full name
router.get('/search', studyPlanCtrl.getByStudentFullName);

// POST to create a studyplan
router.post('/', studyPlanCtrl.create);

// PUT to update the grade
router.put('/:student_id/:course_id/grade', studyPlanCtrl.updateGrade);

module.exports = router;