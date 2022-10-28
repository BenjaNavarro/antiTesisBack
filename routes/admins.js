const express = require('express');
const AdminController = require('../controllers/admins.controller');

const router = express.Router();

router.post('/admins/new_admin',AdminController.NewAdmin);

router.post('/admins/login',AdminController.Login);

module.exports = router;