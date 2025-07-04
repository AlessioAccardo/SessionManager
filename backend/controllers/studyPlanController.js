const StudyPlan = require('../models/studyPlan');

class StudyPlanController {
    static async getByStudentId(req, res, next) {
        try {
            const { student_id } = req.params;
            const list = await StudyPlan.getStudyPlanByStudentId(student_id);
            if (!list || list.length === 0) return res.status(404).json({ message: 'StudyPlan non trovato'});
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getByStudentFullName(req, res, next) {
        try {
            const { first_name, last_name } = req.query;
            const list = await StudyPlan.getStudyPlanByStudentFullName(first_name, last_name);
            if (!list || list.length === 0) return res.status(404).json({ message: 'StudyPlan non trovato'});
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    /*
    static async getGradesAVGByStudentId(req, res, next) {
        try {
            const { student_id } = req.params;
            const mean = await StudyPlan.getMeanOfGradesByStudentId(student_id);
            if (mean === null) return mean = 0;
            res.status(200).json(mean);
        } catch (err) {
            next(err);
        }
    }
    */

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