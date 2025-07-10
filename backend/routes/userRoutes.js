const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

//GET all professors
router.get('/professors', userCtrl.getAllProfessors);

// GET all users
router.get('/', userCtrl.getAll);

module.exports = router;