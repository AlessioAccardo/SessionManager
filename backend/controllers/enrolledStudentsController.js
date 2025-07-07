const EnrolledStudents = require('../models/enrolledStudents');

class EnrolledStudentsController {

    static async getAll(req, res, next) {
        try {
            const list = await EnrolledStudents.getAll();
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getEnrolledStudentsByProfId(req, res, next) {
        try {
            const { professor_id } = req.query;
            const list = await EnrolledStudents.getEnrolledStudentsByProfId(professor_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async updateTaken(req, res, next) {
        try {
            const { student_id, exam_code } = req.params;
            const { taken } = req.body;
            await EnrolledStudents.updateTaken(student_id, exam_code, taken);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }

    static async deleteEnrolledStudent(req, res, next) {
        try {
            const { student_id, exam_code } = req.params;
            await EnrolledStudents.deleteEnrolledStudent(student_id, exam_code);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
     
    static async getExamsByEnrolledStudentId(req, res, next) {
        try {
            const { student_id } = req.query;
            const list = await EnrolledStudents.getExamsByEnrolledStudentId(student_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getEnrolledStudentsByExam(req, res, next){
        try {
            const { exam_code } = req.query;
            const list = await EnrolledStudents.getEnrolledStudentsByExam(exam_code);
            res.status(200).json(list);
        } catch(err) {
            next(err);
        }
    }
    
    static async enrollStudent(req, res, next) {
        try {
            const {student_id, exam_code} = req.body;
            const enrollment = await EnrolledStudents.enrollStudent(student_id, exam_code);
            res.status(201).json(enrollment);
        } catch(err) {
            next(err);
        }
    }

    static async unenrollStudent(req, res, next){
        try {
            const { student_id, exam_code } = req.query;
            if (!student_id || !exam_code) return res.status(400).json({ message: 'Parametri mancanti' });
            await EnrolledStudents.unenrollStudent(student_id, exam_code); 
            res.status(204).send();
        } catch(err) {
            next(err);
        }
    }

    static async search(req, res, next) {
        const { professor_id, student_id, exam_code } = req.query;

        if (professor_id) return EnrolledStudentsController.getEnrolledStudentsByProfId(req, res, next);
        if (student_id) return EnrolledStudentsController.getExamsByEnrolledStudentId(req, res, next);
        if (exam_code) return EnrolledStudentsController.getEnrolledStudentsByExam(req, res, next);

        res.status(400).json({ message: 'Parametri di ricerca non valorizzati'});
    }
}

module.exports = EnrolledStudentsController;