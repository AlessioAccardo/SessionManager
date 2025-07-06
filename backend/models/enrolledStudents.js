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

    // tutti gli studenti iscritti agli esami del professore
    static async getEnrolledStudentsByProfId(professor_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT u.first_name AS student_first_name, u.last_name AS student_last_name, es.*,
                    e.name AS exam_name, e.credits, e.enrolled_students, e.professor_id, e.date, e.course_id,
                    us.first_name AS professor_first_name, us.last_name AS professor_last_name
                FROM users AS u 
                JOIN enrolledStudents AS es ON es.student_id = u.id
                JOIN exams AS e ON e.code = es.exam_code
                JOIN users AS us ON us.id = e.professor_id
                WHERE e.professor_id = ? AND es.taken IS NULL`,
            [professor_id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async updateTaken(student_id, exam_code, taken) {
        const takenInt = taken ? 1 : 0;
        return new Promise((resolve, reject) => {
            db.run(`UPDATE enrolledStudents SET taken = ? WHERE student_id = ? AND exam_code = ?`,
                [takenInt, student_id, exam_code],
                function(err) {
                    if (err) return reject(err);
                    resolve({ student_id, exam_code, taken: !!takenInt });
                }
            );
        });
    }

    static async deleteEnrolledStudent(student_id, exam_code) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM enrolledStudents WHERE student_id = ? AND exam_code = ?`,
                [student_id, exam_code],
                function(err) {
                    if (err) return reject(err);
                    resolve({ student_id, exam_code });
                }
            );
        })
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
                WHERE es.student_id = ? AND es.taken IS NULL`,
                [student_id], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
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
                WHERE es.exam_code = ? AND es.taken IS NULL`,
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