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
            if (!list || list.length === 0) return res.status(404).json({ message: 'Esami non troviati' });
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getResultsByProfessorId(req, res, next) {
        try {
            const { professor_id } = req.query;
            const list = await ExamResults.getResultsByProfessorId(professor_id);
            if (!list || list.length === 0) return res.status(404).json({ message: 'Risultati esami del professore non troviati' });
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getExamResults(req, res, next) {
        try {
            const { professor_id, exam_code } = req.query;
            const list = await ExamResults.getExamResults(professor_id, exam_code);
            if (!list || list.length === 0) return res.status(404).json({ message: 'Risultati esame non troviati' });
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
            res.status(204).send()
        } catch (err) {
            next(err);
        }
    }

    static async search(req, res, next) {
        const { student_id, professor_id, exam_code } = req.query;
        
        if (student_id) return ExamResultsController.getResultsByStudentId(req, res, next);

        if (professor_id) return ExamResultsController.getResultsByProfessorId(req, res, next);

        if (professor_id && exam_code) return ExamResultsController.getExamResults(req, res, next);

        // nessun parametro: errore o lista vuota
        return res.status(400).json({ message: 'Devi fornire almeno un parametro di ricerca per ottenere i risultati degli esami' });
    }
}

module.exports = ExamResultsController;