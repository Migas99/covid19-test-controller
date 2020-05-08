var express = require('express');
var router = express.Router();
var userController = require("../controllers/user-controller");

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

router.get('/:userId', userController.getByIdUser);

//router.get("/login", userController.verifyLogin);

module.exports = router;