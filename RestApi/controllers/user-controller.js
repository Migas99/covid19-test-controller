var mongoose = require("mongoose");
var User = require('../models/user');

var userController = {};

//CRIAR UM USER
userController.createUser = async (req, res) => {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullName,
        birthDate: Date(req.body.birthDate),
        civilNumber: req.body.civilNumber,
        registerDate: Date(Date.now()),
        isInfected: false
    });

    user.save()
    .exec()
    .then(result => {console.log(result)})
        .catch(err => console.log(err));
};

//ATUALIZAR UTILIZADOR
userController.updateUser = async (req, res) => {
    try{
        const updatedUser = await User.updateOne({_id: req.params.userId}, req.body);
    }catch(err){
        res.json(err);
    }
};

//APAGAR UM UTILIZADOR
userController.deleteUser = async (req, res) => {
    try{
        const deletetedUser = await User.remove({_id: req.params.UserId});
    }catch(err){
        res.json(err);
    }
};

//RECEBER TODOS OS UTILIZADORES
userController.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.json(err);
    }
};

//RECEBER UTILIZADOR COM DETERMINADO ID
userController.getByIdUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        res.json(user);
    }catch(err){
        res.json(err)
    }
};

//VERIFICAR LOGIN DO UTILIZADOR
userController.verifyLogin = async(req, res) =>{
    const user = await User.find (user => user.username = req.params.username);
    
    if(user == null){
        res.send("User not found");
    }else{
        if(user.password == req.params.password){
            res.send("Sucess");
        }else{
            res.send("Password Incorrect");
        }
    }
};

module.exports = userController;