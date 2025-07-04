const express = require('express');
const router = express.Router();
const studyPlanCtrl = require('../controllers/studyPlanController');

// GET by student id
router.get('/student/:student_id', studyPlanCtrl.getByStudentId);

// GET by student full name
router.get('/search', studyPlanCtrl.getByStudentFullName);

// POST to create a studyplan
router.post('/', studyPlanCtrl.create);

module.exports = router;