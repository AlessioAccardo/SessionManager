const db = require('../db/database');

class User {

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
}

module.exports = User;