const express = require('express');
const PacientController = require('../controllers/pacients.controller');
// import PacientController from '../controllers/pacients.controller';

const router = express.Router();

router.post('/pacients/new',PacientController.newPacient);

router.get('/pacients',PacientController.getPacients);

module.exports = router;