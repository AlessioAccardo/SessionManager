const { body, validationResult } = require('express-validator');

// controllo che i campi siano valorizzati per la registrazione

const registerValidator = [
    body('email').isEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 6 }).withMessage('Password deve essere di almeno 6 caratteri')
];

const loginValidator = [
    body('email').notEmpty().withMessage('email é obbligatoria'),
    body('password').notEmpty().withMessage('Password é obbligatoria')
];

// Raccoglie tutti gli errori di validazione usando validationResult(req)
// questo aggiunge uno strato intermedio che controlla se ci sono errori da altri validatori
// e se ci sono errori, restituisce un errore 400 con gli errori di validazione
// questo middleware viene eseguito dopo i validatori definiti sopra e può essere associato a quasiasi nuovo validatore

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerValidator,
    loginValidator,
    validate
};