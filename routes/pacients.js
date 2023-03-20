const express = require('express');
const PacientController = require('../controllers/pacients.controller');
const Auth = require('../middleware/Auth');

const router = express.Router();

router.post('/pacients/new',PacientController.newPacient);

router.get('/pacients',Auth,PacientController.getPacients);

router.post('/pacients/login',PacientController.Login);

router.post('/pacients/getPacients', PacientController.getPacientsByTerapistId);

router.delete('/pacients/:id/deletepacient',Auth,PacientController.deletePacient);

router.put('/pacients/putPacient',Auth,PacientController.PutPacient);

router.get('/pacients/:id/changeState',Auth,PacientController.changeStatePacient);

router.post('/pacients/:id/changePassword',Auth,PacientController.ChangePassword);

module.exports = router;