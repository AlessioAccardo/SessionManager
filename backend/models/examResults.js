const db = require('../db/database');

class ExamResults {
    //funzione di inserimento dei risultati per ogni esame
    static async createResults(student_id, exam_code, grade){ 
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO examResults(student_id, exam_code, grade) VALUES (?,?,?)', [student_id, exam_code, grade],
                function(err) {
                if(err) return reject(err);
                resolve({ id: this.lastID, student_id, exam_code, grade});
            });
        });
    }
    
    //funzione per i risultati di un singolo studente se il risultato è stato accettato
    static async getResultsByStudentId(student_id) {
        return new Promise((resolve, reject) => {
             db.all(`
                SELECT u.first_name AS student_first_name, u.last_name AS student_last_name, ex.name AS exam_name, er.*
                FROM examResults AS er
                JOIN exams as ex ON ex.code = er.exam_code
                JOIN users as u ON u.id = er.student_id
                WHERE student_id = ?`,
                [student_id], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
            });
        });
    }

    // PER LA SEGRETERIA
    static async getResultsByProfessorId(professor_id) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT er.*, us.first_name AS student_first_name, us.last_name AS student_last_name, ex.professor_id, u.first_name AS professor_first_name, u.last_name AS professor_last_name
                FROM examResults AS er
                JOIN exams AS ex ON ex.code = er.exam_code
                JOIN users AS u ON u.id = ex.professor_id
                JOIN users AS us ON us.id = er.student_id
                WHERE ex.professor_id = ?`,
                [professor_id],
                (err, rows) => {
                if(err) return reject(err);
                resolve(rows);
            });
        });
    }

    // PER IL PROFESSORE
    static async getExamResults(professor_id, exam_code) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT er.*, us.first_name AS student_first_name, us.last_name AS student_last_name, ex.professor_id, u.first_name AS professor_first_name, u.last_name AS professor_last_name
                FROM examResults AS er
                JOIN exams AS ex ON ex.code = er.exam_code
                JOIN users AS u ON u.id = ex.professor_id
                JOIN users AS us ON us.id = er.student_id
                WHERE ex.professor_id = ? AND er.exam_code = ?`,
                [professor_id, exam_code],
                (err, rows) => {
                if(err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async acceptResult(student_id, exam_code, value) {
        const valueInt = value ? 1 : 0;
        return new Promise((resolve, reject) => {
            db.run('UPDATE examResults SET accepted = ? WHERE student_id = ? AND exam_code = ?', [valueInt, student_id, exam_code],
                function(err) {
                if (err) return reject(err);
                resolve({ student_id, exam_code, accepted: !!valueInt, changes: this.changes });
            });
        });
    }
}

module.exports = ExamResults;