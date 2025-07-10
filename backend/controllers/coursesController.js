const Courses = require('../models/courses');

class CoursesController {
    static async create(req, res, next) {
        try {
            const { name, professor_id, credits } = req.body;
            const creatingCourse = await Courses.createCourse(name, professor_id, credits);
            res.status(201).json(creatingCourse);
        } catch (err) {
            next(err);
        }
    }

    static async getAll(req, res, next) {
        try {
            const list = await Courses.getAllCourses();
            if (!list) return res.status(404).json({ message: 'Corsi non trovati'});
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getCompStudent(req, res, next) {
        try {
            const { student_id } = req.query;
            const list = await Courses.getCompStudentCourses(student_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getByProfessorId(req, res, next) {
        try {
            const { professor_id } = req.query;
            const list = await Courses.getCoursesByProfessorId(professor_id);
            res.status(200).json(list);
        } catch (err) {
            next(err);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const courseRow = await Courses.getCourseById(id);
            res.status(200).json(courseRow);
        } catch (err) {
            next(err);
        }
    }


    static async deleteCourseById(req, res, next) {
        try {
            const { id } = req.params;
            await Courses.deleteCourseById(id);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }

    static search(req, res, next) {
        const { professor_id, student_id } = req.query;

        if (student_id) return CoursesController.getCompStudent(req, res, next);

        if (professor_id) return CoursesController.getByProfessorId(req, res, next);

        // nessun parametro: errore o lista vuota
        return res.status(400).json({ message: 'Devi fornire almeno un parametro di ricerca per ottenere i corsi' });
    };
 }

 module.exports = CoursesController;