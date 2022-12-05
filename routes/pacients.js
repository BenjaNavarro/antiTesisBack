const express = require('express');
const PacientController = require('../controllers/pacients.controller');
const Auth = require('../middleware/Auth');

const router = express.Router();

router.post('/pacients/new',PacientController.newPacient);

router.get('/pacients',Auth,PacientController.getPacients);

router.post('/pacients/login',PacientController.Login);

router.post('/pacients/getPacients', PacientController.getPacientsByTerapistId);

router.delete('/pacients/:id/deletepacient',Auth,PacientController.deletePacient);

module.exports = router;