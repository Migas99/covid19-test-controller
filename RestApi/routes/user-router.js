var express = require('express');
var router = express.Router();
var userController = require("../controllers/user-controller");
var { verifyTokenForUsers } = require('../validations/verifyToken');

router.post('/login', userController.login);
router.post('/register', userController.createUser);

router.get('/', verifyTokenForUsers, userController.getAllUsers);
router.put('/:userId', verifyTokenForUsers, userController.updateUser);
router.delete('/:userId', verifyTokenForUsers, userController.deleteUser);

router.get('/:userId', verifyTokenForUsers, userController.getByIdUser);

module.exports = router;