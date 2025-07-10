const User = require('../models/user');

class UserController {
    static async getAll(req, res, next) {
        try {
            const list = await User.getAllUsers();
            if (!list) return res.status(404).json({ message: 'Lista degli utenti vuota' });

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
            if(!list) return res.status(404).json({message: 'Lista dei professori vuota'});
            const professors = list.map(({ password, ...prof }) => prof);
            return res.status(200).json(professors);
        }catch(err){
            next(err);
        }
    }

}

module.exports = UserController;