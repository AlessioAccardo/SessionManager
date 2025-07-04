const AuthService = require('../services/authServices');
const jwt = require('jsonwebtoken');

class AuthController {
    static async register(req, res) {
        try {
            const { user, token } = await AuthService.registerUser(req.body);
            res.status(201).json({
                success: true,
                data: user,
                token
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.loginUser(email, password);
            res.json({
                success: true,
                data: user,
                token
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    static async verify(req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token || AuthService.isTokenBlackListed(token)) {
                return res.status(401).json({ success: false, message: "Token non valido" });
            }
        
            const user = await AuthService.verifyUser(req.user.id);
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    static logout(req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (token) {
                AuthService.logoutUser(token);
            }
            res.json({
                success: true,
                message: "Logout effettuato correttamente"
            });
        } catch (err) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    static async me(req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token mancante'
                });
            }

            if (AuthService.isTokenBlackListed(token)) {
                return res.status(401).json({
                    success: false,
                    message: 'Token non valido'
                });
            }

            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await AuthService.verifyUser(payload.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utente non trovato'
                });
            }

            const { password, ...safeUser } = user;

            return res.json({
                success: true,
                data: safeUser
            });

        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token non valido o scaduto'
            });
        }
    }

}

module.exports = AuthController;