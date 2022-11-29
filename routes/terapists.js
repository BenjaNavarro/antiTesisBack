const express = require('express');
const TerapistController = require('../controllers/terapist.controller');
const Auth = require('../middleware/Auth');

const router = express.Router();

router.post('/terapists/new',Auth,TerapistController.NewTerapist);

router.post('/terapists/logout',Auth,TerapistController.Logout);

router.post('/terapists/login',TerapistController.Login);

router.get('/terapists',Auth,TerapistController.GetTerapists);

module.exports = router;