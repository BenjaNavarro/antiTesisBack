const express = require('express');
const TerapistController = require('../controllers/terapist.controller');

const router = express.Router();

router.post('/terapists/new',TerapistController.NewTerapist);