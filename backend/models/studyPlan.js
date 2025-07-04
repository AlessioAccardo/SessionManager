const db = require('../db/database');
const Courses = require('./courses')

class StudyPlan {
    static async getStudyPlanByStudentId(student_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT s.*, c.name AS course_name , c.credits, stud.first_name AS student_first_name,
                    stud.last_name AS student_last_name, prof.id AS professor_id ,prof.first_name AS professor_first_name, prof.last_name AS professor_last_name
                FROM studyPlan AS s
                JOIN courses AS c ON c.id = s.course_id
                JOIN users AS stud ON stud.id = s.student_id
                JOIN users AS prof ON prof.id = c.professor_id
                WHERE student_id = ?`,
                [student_id], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
            });
        });
    }

    static async getStudyPlanByStudentFullName(fname, lname) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT s.*, c.name AS course_name , c.credits, stud.first_name AS student_first_name,
                    stud.last_name AS student_last_name, prof.id AS professor_id ,prof.first_name AS professor_first_name, prof.last_name AS professor_last_name
                FROM studyPlan AS s
                JOIN courses AS c ON c.id = s.course_id
                JOIN users AS stud ON stud.id = s.student_id
                JOIN users AS prof ON prof.id = c.professor_id
                WHERE stud.first_name = ? AND stud.last_name = ?`,
                [fname, lname], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
            });
        });
    }

    /*
    static async getMeanOfGradesByStudentId(id) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT AVG(grade) AS mean
                FROM studyPlan
                WHERE student_id = ?
            `, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
    */
    
    static async create(student_id, course_id) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO studyPlan(student_id, course_id) VALUES (?,?)', [student_id, course_id], function(err) {
                if (err) return reject(err);
                resolve({ student_id, course_id });
            });
        });
    }
}

module.exports = StudyPlan;