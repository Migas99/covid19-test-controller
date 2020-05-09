var express = require('express');
var router = express.Router();
var userController = require("../controllers/user-controller");
var { authorizeBasedOnRoles, authorizeBasedOnRolesAndUserId } = require('../middleware/authorize');

router.post('/login', userController.login);
router.post('/register', userController.createUser);

router.get('/', authorizeBasedOnRoles(['TECHNICIAN'], ['ADMIN']), userController.getAllUsers);
router.put('/:userId', authorizeBasedOnRolesAndUserId(['ADMIN']), userController.updateUser);
router.delete('/:userId', authorizeBasedOnRolesAndUserId(['ADMIN']), userController.deleteUser);

router.get('/:userId', authorizeBasedOnRolesAndUserId(['TECHNICIAN'], ['ADMIN']), userController.getByIdUser);
router.post('/logout', userController.logout);

module.exports = router;