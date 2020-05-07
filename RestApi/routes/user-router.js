var express = require('express');
var router = express.Router();
var userController = require("../controllers/user-controller");

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

router.get('/:userId', userController.getOneUser);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

router.param('userId', userController.getByIdUser);

router.post("/login");

module.exports = router;