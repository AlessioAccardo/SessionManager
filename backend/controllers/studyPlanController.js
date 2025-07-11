const StudyPlan = require('../models/studyPlan');

class StudyPlanController {
    static async getByStudentId(req, res, next) {
        try {
            const { student_id } = req.params;
            const list = await StudyPlan.getStudyPlanByStudentId(student_id);
            if (!list) return res.status(404).json({ message: 'StudyPlan non trovato'});
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async updateGrade(req, res, next) {
        try {
            const { student_id, course_id } = req.params;
            const { grade } = req.body;
            await StudyPlan.updateGrade(student_id, course_id, grade);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        } 
    }

    static async create(req, res, next) {
        try {
            const { student_id, course_id } = req.body;
            const studyplan = await StudyPlan.create(student_id, course_id);
            res.status(201).json(studyplan);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = StudyPlanController;