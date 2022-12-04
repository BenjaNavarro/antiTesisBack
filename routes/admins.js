const express = require('express');
const AdminController = require('../controllers/admins.controller');
const Auth = require('../middleware/Auth');

const router = express.Router();

router.post('/admins/new_admin',AdminController.NewAdmin);

router.post('/admins/login',AdminController.Login);

router.get('/admins',AdminController.GetAdmins);

router.post('/admins/logout',Auth,AdminController.Logout);

module.exports = router;