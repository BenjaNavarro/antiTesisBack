const express = require('express');
const PacientController = require('../controllers/pacients.controller');

const router = express.Router();

router.post('/pacients/new',PacientController.newPacient);

module.exports = router;