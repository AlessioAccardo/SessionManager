// importo il db
const db = require('../../db/database');

// importo il modulo bcryptjs per la gestione delle password
const bcrypt = require('bcryptjs');

// interagisce direttamente con il database per le operazioni CRUD sugli utenti
class User {

// definiamo il metodo per creare un nuovo utente
    static async create({ first_name, last_name, email, password, role }) {
        // verifica sul ruolo
        const ruoli = ['studente', 'segreteria', 'professore'];
        if (!ruoli.includes(role)) {
            throw new Error(`Ruolo non valido: ${role}`);
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // caso in cui sia studente
        if (role == "studente") {
            return new Promise((resolve, reject) => {    
                db.run(
                    'INSERT INTO users (first_name, last_name, email, password, role, credits, mean) VALUES (?,?,?,?,?,?,?)',
                    [first_name, last_name, email, hashedPassword, role, 0, 0],
                    function(err) {
                        if (err) return reject(err);
                        resolve({ id: this.lastID, first_name, last_name, email, role })
                    }
                );
            });
        // caso in cui non sia studente
        } else {
            return new Promise((resolve, reject) => {    
                db.run(
                    'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?,?,?,?,?)',
                    [first_name, last_name, email, hashedPassword, role],
                    function(err) {
                        if (err) return reject(err);
                        resolve({ id: this.lastID, first_name, last_name, email, role })
                    }
                );
            });
        }
    }

    static async comparePassword(candidatePassword, hash) {
        return bcrypt.compare(candidatePassword, hash);
    }

        // ricerca per ID
    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    // ricerca per email
    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users where email = ?', [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }
}

module.exports = User;