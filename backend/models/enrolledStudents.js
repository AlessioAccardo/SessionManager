const db = require('../db/database');

class EnrolledStudents{

    // tutti gli studenti iscritti ad un qualsiasi esame
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT u.first_name AS student_first_name, u.last_name AS student_last_name, es.*,
                    e.name AS exam_name, e.credits, e.enrolled_students, e.professor_id, e.date, e.course_id,
                    us.first_name AS professor_first_name, us.last_name AS professor_last_name
                FROM users AS u 
                JOIN enrolledStudents AS es ON es.student_id = u.id
                JOIN exams AS e ON e.code = es.exam_code
                JOIN users AS us ON us.id = e.professor_id`,
            [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // tutti gli esami ai quali uno studente è iscritto
    static async getExamsByEnrolledStudentId(student_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT u.first_name AS student_first_name, u.last_name AS student_last_name, es.*,
                    e.name AS exam_name, e.credits, e.enrolled_students, e.professor_id, e.date, e.course_id,
                    us.first_name AS professor_first_name, us.last_name AS professor_last_name
                FROM users AS u 
                JOIN enrolledStudents AS es ON es.student_id = u.id
                JOIN exams AS e ON e.code = es.exam_code
                JOIN users AS us ON us.id = e.professor_id
                WHERE student_id = ?`,
                [student_id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
        })
    }

    //tutti gli studenti iscritti per esame
    static async getEnrolledStudentsByExam(exam_code){
        return new Promise((resolve, reject)=> {
            db.all(`
                SELECT u.first_name AS student_first_name, u.last_name AS student_last_name, es.*,
                    e.name AS exam_name, e.credits, e.enrolled_students, e.professor_id, e.date, e.course_id,
                    us.first_name AS professor_first_name, us.last_name AS professor_last_name
                FROM users AS u 
                JOIN enrolledStudents AS es ON es.student_id = u.id
                JOIN exams AS e ON e.code = es.exam_code
                JOIN users AS us ON us.id = e.professor_id
                WHERE es.exam_code = ?`,
                [exam_code], (err, rows) => {
                    if(err) return reject(err);
                    resolve(rows);
                });
        });
    }

    //iscrizione studente ad un esame
    static async enrollStudent(student_id, exam_code) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO enrolledStudents(student_id, exam_code) VALUES (?, ?)',
                [student_id, exam_code],
                function(err) {
                    if(err) return reject(err);
                    resolve({ student_id, exam_code })
                });
        });
    }
    
    // disiscrizione studente da esame
    static async unenrollStudent(student_id, exam_code) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM enrolledStudents WHERE student_id = ? AND exam_code = ?', [student_id, exam_code], (err) => {
                if (err) return reject(err);
                resolve({ student_id, exam_code, deleted: this.changes});
            });
        });
    }
}

module.exports = EnrolledStudents;