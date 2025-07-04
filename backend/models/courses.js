const db = require('../db/database');

class Courses {
    static async createCourse(name, professor_id, credits) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO courses(name, professor_id, credits) VALUES (?,?,?)', [name, professor_id, credits],
                function(err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, name, professor_id, credits });
                }
            );
        });
    }

    static async getAllCourses() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT c.*, u.first_name AS professor_first_name, u.last_name AS professor_last_name
                FROM courses AS c
                JOIN users AS u ON u.id = c.professor_id`,
                [],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve (rows);
            });
        });
    }

    static async getCompStudentCourses(student_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT c.*, u.first_name AS professor_first_name, u.last_name  AS professor_last_name
                FROM courses AS c JOIN users AS u  ON u.id = c.professor_id
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM studyPlan AS s
                    WHERE s.course_id  = c.id AND s.student_id = ?
                )`,
            [student_id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getCoursesByProfessorId(professor_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT c.*, u.first_name AS professor_first_name, u.last_name AS professor_last_name
                FROM courses AS c
                JOIN users AS u ON u.id = c.professor_id
                WHERE professor_id = ?`,
                [professor_id], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
            });
        });
    }

    static async getCourseByProfessorFullName(fname, lname) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT c.*, u.first_name AS professor_first_name, u.last_name AS professor_last_name
                FROM courses AS c
                JOIN users AS u ON u.id = c.professor_id
                WHERE u.first_name = ? AND u.last_name = ?`,
                [fname, lname], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
            });
        });
    }

    static async getCourseById(id) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT c.*, u.first_name AS professor_first_name, u.last_name AS professor_last_name
                FROM courses AS c
                JOIN users AS u ON u.id = c.professor_id
                WHERE c.id = ?`,
                [id], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
            });
        });
    }

    static async getCourseByName(name) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT c.*, u.first_name AS professor_first_name, u.last_name AS professor_last_name
                FROM courses AS c
                JOIN users AS u ON u.id = c.professor_id
                WHERE c.name = ?`,
                [name], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
            });
        });
    }
}

module.exports = Courses;