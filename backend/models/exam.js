const db = require('../db/database');
const Courses = require('../models/courses');

class Exam {

    static async getAllExams() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT e.*, stud.first_name AS student_first_name, stud.last_name AS student_last_name,
                prof.first_name AS professor_first_name, prof.last_name AS professor_last_name
                FROM exams AS e
                JOIN studyPlan as s ON s.course_id = e.course_id
                JOIN users AS stud ON stud.id = s.student_id
                JOIN users as prof ON prof.id = e.professor_id
                WHERE e.approved = ?
                GROUP BY prof.id
                ORDER BY prof.id ASC`,
                [1],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });
    }

    static async getStudentExams(student_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT e.*, stud.first_name AS student_first_name, stud.last_name AS student_last_name,
                prof.first_name AS professor_first_name, prof.last_name AS professor_last_name
                FROM exams AS e
                JOIN studyPlan AS s ON s.course_id = e.course_id
                JOIN users AS stud ON stud.id = s.student_id
                JOIN users as prof ON prof.id = e.professor_id
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM enrolledStudents AS en
                    JOIN exams AS ex ON ex.code = en.exam_code
                    WHERE en.student_id = s.student_id AND ex.course_id = e.course_id
                ) AND s.student_id = ? AND s.grade IS NULL AND e.approved = ?`,
            [student_id, 1], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getAllApprovedExams() { 
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM exams WHERE approved = ?', [1], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
        });
    }

    static async getAllApprovedExamsByProfId(professor_id) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM exams WHERE approved = ? AND professor_id = ?', [1, professor_id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
     

    static async setEnrolledStudentsNumber(code) {
        return new Promise((resolve, reject) => {
            db.run(`
                UPDATE exams AS e
                SET enrolled_students = (
                    SELECT COUNT(*)
                    FROM enrolledStudents AS es
                    WHERE es.exam_code = e.code)
                WHERE e.code = ? AND e.approved = ?`,
                [code, 1], (err) => {
                if (err) return reject(err);
                resolve({ code });
            });
        });
    }
   
    static async getExamByCode(code) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM exams WHERE code = ? AND approved = ?', [code, 1], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static async getExamsByProfessorId(id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT u.first_name AS professor_first_name, u.last_name AS professor_last_name, e.*
                FROM exams as e
                JOIN users as u ON u.id = e.professor_id
                WHERE professor_id = ?`, [id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getExamsByCourseId(course_id) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM exams WHERE course_id = ? AND approved = ?`, [course_id, 1], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async createExam(course_id, date) {
        const { name, professor_id, credits } = await Courses.getCourseById(course_id);

        return new Promise((resolve, reject) => {
            db.run('INSERT INTO exams (name, credits, professor_id, date, course_id) VALUES (?,?,?,?,?)', [name, credits, professor_id, date, course_id],
                function(err) {
                if (err) return reject(err);
                resolve({ code: this.lastID, name, credits, professor_id, approved: null, enrolled_students: 0, date, course_id });
            });
        });
    }

    static async examsRequested() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM exams WHERE approved IS NULL`, [], (err, rows) => {
                if (err) return reject (err);
                resolve(rows);
            });
        });
    }

    static async  showExamsRequestsByProfId(prof_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT e.*, prof.id AS professor_id, prof.first_name AS professor_first_name, prof.last_name AS professor_last_name
                FROM exams AS e
                JOIN users as prof ON prof.id = e.professor_id
                WHERE prof.id = ?`,
                [prof_id],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            )
        })
    }

    static async approveExam(code, approved) {
        const approvedInt = approved ? 1 : 0;
        return new Promise((resolve, reject) => {
            db.run('UPDATE exams SET approved = ? WHERE code = ?', [approvedInt, code], (err) => {
                if (err) return reject(err);
                resolve({ approvedInt, code, updated: this.changes });
            });
        });
    }
}

module.exports = Exam;