const express = require('express');
const PacientController = require('../controllers/pacients.controller');

const router = express.Router();

router.post('/pacients/new',PacientController.newPacient);

router.get('/pacients',PacientController.getPacients);

router.post('/pacients/login',PacientController.Login);

module.exports = router;