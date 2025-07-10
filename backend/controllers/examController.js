const Exam = require('../models/exam');

class ExamController {
    static async getAll(req, res, next) {
        try {
            const list = await Exam.getAllExams();
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getStudentExams(req, res, next) {
        try {
            const { student_id } = req.params;
            const list = await Exam.getStudentExams(student_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getAllApproved(req, res, next) {
        try {
            const list = await Exam.getAllApprovedExams();
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getAllApprovedByProfId(req, res, next) {
        try {
            const { professor_id } = req.params;
            const list = await Exam.getAllApprovedExamsByProfId(professor_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async setEnrolledStudentsNumber(req, res, next) {
        try {
            const { code } = req.body;
            await Exam.setEnrolledStudentsNumber(code);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }

    static async getByCode(req, res, next) {
        try {
            const { code } = req.params;
            const examRow = await Exam.getExamByCode(code);
            res.status(200).json(examRow);
        } catch (err) {
            next(err);
        }
    }

    static async getByProfessorId(req, res, next) {
        try {
            const { professor_id } = req.params;
            const examRows = await Exam.getExamsByProfessorId(professor_id);
            res.status(200).json(examRows);
        } catch (err) {
            next(err);
        }
    }

    static async getExamsByCourseId(req, res, next) {
        try {
            const { course_id } = req.query;
            const list = await Exam.getExamsByCourseId(course_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const { course_id, date } = req.body;
            const creatingExam = await Exam.createExam(course_id, date);
            res.status(201).json(creatingExam);
        } catch (err) {
            next(err);
        }
    }

    static async requested(req, res, next) {
        try {
            const list = await Exam.examsRequested();
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async approve(req, res, next) {
        try {
            const { code, approved } = req.body;
            const updatingExam = await Exam.approveExam(code, approved);
            res.status(201).json(updatingExam);
        } catch (err) {
            next(err);
        }
    }

    static async showExamsRequestsByProfId(req, res, next) {
        try {
            const { professor_id } = req.query;
            const list = await Exam.showExamsRequestsByProfId(professor_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async search(req, res, next) {
        const { course_id, first_name, last_name, professor_id } = req.query;

        if (professor_id) return ExamController.showExamsRequestsByProfId(req, res, next);
        
        if (course_id) return ExamController.getExamsByCourseId(req, res, next);

        return res.status(400).json({ message: 'Devi fornire almeno un parametro di ricerca per ottenere gli esami' });
    }
}

module.exports = ExamController;


