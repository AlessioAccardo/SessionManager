const express = require('express');
const router = express.Router();
const examResultsCtrl = require('../controllers/examResultsController');
const { acceptResult } = require('../models/examResults');

// GET results by professor id OR by exam code
router.get('/search', examResultsCtrl.search);

// GET grouped by professor
router.get('/grouped', examResultsCtrl.getResultsGroupedByProfessor)

// GET exam results and courses for admin stats
router.get('/stats/:professor_id', examResultsCtrl.getExamResultsAndCoursesByProfessorId);

// PUT accept/reject result
router.put('/:student_id/:exam_code/accept', examResultsCtrl.acceptResult);

// POST to create the result
router.post('/', examResultsCtrl.create);

module.exports = router;