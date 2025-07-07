const e = require('express');
const ExamResults = require('../models/examResults');

class ExamResultsController {

    static async create(req, res, next) {
        try {
            const { student_id, exam_code, grade } = req.body;
            const creatingResult = await ExamResults.createResults(student_id, exam_code, grade);
            res.status(201).json(creatingResult);
        } catch (err) {
            next(err);
        }
    }

    static async getResultsByStudentId(req, res, next) {
        try {
            const { student_id } = req.query;
            const list = await ExamResults.getResultsByStudentId(student_id);
            if (!list) return res.status(404).json({ message: 'Esami non troviati' });
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getResultsGroupedByProfessor(req, res, next) {
        try {
            const { professor_id } = req.query;
            const list = await ExamResults.getResultsGroupedByProfessor(professor_id);
            if (!list) return res.status(404).json({ message: 'Risultati esami del professore non troviati' });
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getExamResults(req, res, next) {
        try {
            const { professor_id, exam_code } = req.query;
            const list = await ExamResults.getExamResults(professor_id, exam_code);
            if (!list) return res.status(404).json({ message: 'Risultati esame non troviati' });
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getExamResultsByCode(req, res, next) {
        try {
            const { exam_code } = req.query;
            const list = await ExamResults.getExamResultsByCode(exam_code);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getExamResultsByCourseId(req, res, next) {
        try {
            const { course_id } = req.query;
            const list = await ExamResults.getExamResultsByCourseId(course_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getExamResultsAndCoursesByProfessorId(req, res, next) {
        try {
            const { professor_id } = req.params;
            const list = await ExamResults.getExamResultsAndCoursesByProfessorId(professor_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async acceptResult(req, res, next) {
        try {
            const { student_id, exam_code } = req.params;
            const { value } = req.body
            await ExamResults.acceptResult(student_id, exam_code, value);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }

    static async search(req, res, next) {
        const { student_id, professor_id, exam_code, course_id } = req.query;

        if (professor_id && exam_code) return ExamResultsController.getExamResults(req, res, next);

        if (exam_code) return ExamResultsController.getExamResultsByCode(req, res, next);

        if (student_id) return ExamResultsController.getResultsByStudentId(req, res, next);

        if (professor_id) return ExamResultsController.getResultsGroupedByProfessor(req, res, next);

        if (course_id) return ExamResultsController.getExamResultsByCourseId(req, res, next);

        // nessun parametro: errore o lista vuota
        return res.status(400).json({ message: 'Devi fornire almeno un parametro di ricerca per ottenere i risultati degli esami' });
    }
}

module.exports = ExamResultsController;