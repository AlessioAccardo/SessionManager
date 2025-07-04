const User = require('../models/user');

class UserController {
    static async getAll(req, res, next) {
        try {
            const list = await User.getAllUsers();
            if (!list || list.length === 0) return res.status(404).json({ message: 'Lista degli utenti vuota' });

            // Rimuovo la password da ciascun oggetto user
            const safeList = list.map(({ password, ...user }) => user);

            return res.status(200).json(safeList);
        } catch (err) {
            next(err);
        }
    }

    static async getAllProfessors(req, res, next) {
        try{
            const list = await User.getAllProfessors();
            if(!list || list.length === 0) return res.status(404).json({message: 'Lista dei professori vuota'});
            const professors = list.map(({ password, ...prof }) => prof);
            return res.status(200).json(professors);
        }catch(err){
            next(err);
        }
    }

    static async getByFName(req, res, next) {
        try {
            const { first_name } = req.query;
            const list = await User.getByFName(first_name);
            const safeList = list.map(({ password, ...user }) => user);
            if (!list || list.lenght === 0) return res.status(404).json({ message: 'Lista degli utenti vuota'});
            res.status(200).json(safeList);
        } catch (err) {
            next(err);
        }
    }

    static async getByLName(req, res, next) {
        try {
            const { last_name } = req.query;
            const list = await User.getByLName(last_name);
            const safeList = list.map(({ password, ...user }) => user);
            if (!list || list.lenght === 0) return res.status(404).json({ message: 'Lista degli utenti vuota'});
            res.status(200).json(safeList);
        } catch (err) {
            next(err);
        }
    }

    static async getByFullName(req, res, next) {
        try {
            const { first_name, last_name } = req.query;
            const list = await User.getByFullName(first_name, last_name);
            if (!list || list.lenght === 0) return res.status(404).json({ message: 'Lista degli utenti vuota'});
            const safeList = list.map(({ password, ...user }) => user);
            res.status(200).json(safeList);
        } catch (err) {
            next(err);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const searchedUser = await User.getById(id);
            if (!searchedUser) return res.status(404).json({ message: 'Utente non trovato'});
            const { password: _, ...user} = searchedUser;
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    static async getProfessorById(req, res, next) {
        try {
            const {id} = req.params;
            const searchedUser = await User.getProfessorById(id);
            if(!searchedUser) return res.status(404).json({ message: 'Utente non trovato'});
            res.status(200).json(user);
        }catch (err){
            next(err);
        }
    }

    static async getByEmail(req, res, next) {
        try {
            const { email } = req.params;
            const searchedUser = await User.getByEmail(email);
            const { password: _, ...user} = searchedUser;
            if (!searchedUser) return res.status(404).json({ message: 'Utente non trovato'});
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

}

module.exports = UserController;