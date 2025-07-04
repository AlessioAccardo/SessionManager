const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFile = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.log(`Errore nella connessione al database`);
    } else {
        db.serialize(() => {
            db.run('PRAGMA foreign_keys = ON;', (err) => {
                if (err) {
                    console.log(`Errore nell'attivazione delle foreign keys:`, err);
                } else {
                    console.log('Foreign key support attivato!');
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name VARCHAR(45) NOT NULL,
                last_name VARCHAR(45) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(45) NOT NULL,
                credits INT,
                mean DECIMAL(4,2)    
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(45) NOT NULL,
                professor_id INTEGER NOT NULL,
                credits INTEGER NOT NULL,
                FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS exams (
                code INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                credits INTEGER NOT NULL,
                enrolled_students INTEGER DEFAULT 0,
                professor_id INTEGER NOT NULL,
                approved INTEGER CHECK(approved IN (0,1)),
                date TEXT NOT NULL,
                course_id INT NOT NULL,
                FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE NO ACTION
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS examResults (
                exam_code INTEGER NOT NULL,
                student_id INTEGER NOT NULL,
                grade INTEGER,
                accepted INTEGER CHECK(accepted IN (0,1)),
                PRIMARY KEY (exam_code, student_id),
                FOREIGN KEY (exam_code) REFERENCES exams(code) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS studyPlan (
                student_id INTEGER,
                course_id INTEGER,
                grade INTEGER,
                PRIMARY KEY (student_id, course_id),
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE ON UPDATE NO ACTION
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS enrolledStudents(
                student_id INTEGER,
                exam_code INTEGER,
                PRIMARY KEY (student_id, exam_code),
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (exam_code) REFERENCES exams(code)
            )`);
        });
    }
});

module.exports = db;