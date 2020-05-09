var mongoose = require("mongoose");
var User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validations/userValidations');

var userController = {};

//Login de um user
userController.login = async(req, res) =>{
    //Validamos se a estrutura é válida
    const { error } = loginValidation(req.body);
    
    if(error){
        res.status(400).send(error.details[0].message);
    }

    //Verificamos se a conta existe
    const user = await User.findOne({username: req.body.username});
    if(!user){
        return res.status(400).send('The username must be wrong!');
    }

    //Verificamos se a password é válida
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send('Invalid password!');
    }

    //Criar e devolver o token
    const token = jwt.sign({_id: user.id, role: 'user'}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
};

//Registo de um user
userController.createUser = async (req, res) => {
    
    //Validamos se a estrutura é válida
    const { error } = registerValidation(req.body);
    
    if(error){
        res.status(400).send(error.details[0].message);
    }

    //Verificamos se o username encontra-se disponível
    const usernameExist = await User.findOne({username: req.body.username});
    if(usernameExist){
        return res.status(400).send('Username is already in use!');
    }

    //Verificamos se o email encontra-se disponível
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist){
        return res.status(400).send('Email is already in use!');
    }

    //Verificamos se o número civil encontra-se disponível
    const civilExist = await User.findOne({civilNumber: req.body.civilNumber});
    if(civilExist){
        return res.status(400).send('That civil number is already in use!');
    }

    //Encriptar a password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var user = new User({
        username: req.body.username,
        password: hashedPassword,
        fullName: req.body.fullName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        civilNumber: req.body.civilNumber
    });

    try{
        await user.save();
        res.status(200).send('Sucess!');
    }catch(err){
        res.json(err)
    }
};

//Atualizar um user
userController.updateUser = async (req, res) => {
    try{
        await User.updateOne({_id: req.params.userId}, req.body);
        res.status(200).send('Sucess!');
    }catch(err){
        res.json(err);
    }
};

//APAGAR UM UTILIZADOR
userController.deleteUser = async (req, res) => {
    try{
        await User.remove({_id: req.params.UserId});
        res.status(200).send('Sucess!');
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

module.exports = userController;