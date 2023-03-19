const express = require('express');
const TerapistController = require('../controllers/terapist.controller');
const Auth = require('../middleware/Auth');

const router = express.Router();

router.post('/terapists/new',Auth,TerapistController.NewTerapist);

router.post('/terapists/logout',Auth,TerapistController.Logout);

router.post('/terapists/login',TerapistController.Login);

router.get('/terapists',Auth,TerapistController.GetTerapists);

router.delete('/terapists/:id/deleteTerapist',Auth,TerapistController.DeleteTerapist);

router.put('/terapists/putTerapist',Auth,TerapistController.PutTerapist);

router.get('/terapists/:id/changeState',Auth,TerapistController.ChangeStateTerapist);

module.exports = router;