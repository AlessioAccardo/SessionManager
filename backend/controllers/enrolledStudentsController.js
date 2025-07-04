const EnrolledStudents = require('../models/enrolledStudents');

class EnrolledStudentsController {

    static async getAll(req, res, next) {
        try {
            const list = await EnrolledStudents.getAll();
            if (!list || list.length === 0) return res.status(404).json({ message: 'Lista non trovata' });
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }
    
    static async getExamsByEnrolledStudentId(req, res, next) {
        try {
            const { student_id } = req.params;
            const list = await EnrolledStudents.getExamsByEnrolledStudentId(student_id);
            if (!list || list.length === 0) return res.status(404).json({ message: 'Esami a cui lo studente è iscritto non trovati' });
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getEnrolledStudentsByExam(req, res, next){
        try {
            const {exam_code} = req.params;
            const list = await EnrolledStudents.getEnrolledStudentsByExam(exam_code);
            if (!list || list.length === 0) return res.status(404).json({ message: `Studenti iscritti all'esame non trovati` });
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
}

module.exports = EnrolledStudentsController;