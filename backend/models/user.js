const db = require('../db/database');

class User {

    // get all
    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users', [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static async getAllProfessors(){
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users WHERE role = ?', ['professore'], (err, rows) =>{
                if(err) return reject(err);
                resolve(rows);
            });
        });
    }

    // ricerca per first_name
    static async getByFName(first_name) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users WHERE first_name = ?', [first_name], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // ricerca per last_name
    static async getByLName(last_name) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users WHERE last_name = ?', [last_name], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // ricerca per full name
    static async getByFullName(first_name, last_name) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users WHERE first_name = ? AND last_name = ?', [first_name, last_name], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    // ricerca per ID
    static async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    static async getProfessorById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'professore'], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    // ricerca per email
    static async getByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users where email = ?', [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
}

module.exports = User;