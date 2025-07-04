const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

//GET all professors
router.get('/professors', userCtrl.getAllProfessors);

//GET professor by id
router.get('/professor/:id', userCtrl.getProfessorById);

// GET by user id
router.get('/:id', userCtrl.getById);

// GET by email
router.get('/:email', userCtrl.getByEmail);

// GET by full name
router.get('/search', userCtrl.getByFullName);

// GET by first name
router.get('/search', userCtrl.getByFName);

// GET by last name
router.get('/search', userCtrl.getByLName);

// GET all users
router.get('/', userCtrl.getAll);

module.exports = router;