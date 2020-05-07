var express = require('express');
var router = express.Router();
var userController = require("../controllers/user-controller");

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);

router.get('/user/:userId', userController.getOneUser);
router.put('/user/:userId', userController.updateUser);
router.delete('/user/:userId', userController.deleteUser);

router.param('userId', userController.getByIdUser);

module.exports = router;