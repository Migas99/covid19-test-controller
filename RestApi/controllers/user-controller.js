const mongoose = require("mongoose");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { loginValidation, registerValidation } = require('../validations/userValidations');
const userController = {};

/**
 * Método responsável por realizar o Login
 */
userController.login = async (req, res) => {
    
    /*Validamos a estrutura*/
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    /*Verificamos se a conta com esse username existe*/
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).send('The username must be wrong!');
    }

    /*Comparamos passwords e validamos*/
    if (user.role != 'ADMIN') {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid password!');
        }
    } else {
        if (req.body.password != user.password) {
            return res.status(400).send('Invalid password!');
        }
    }

    /*Criar e devolver o Token*/
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.TOKEN_SECRET);
    res.cookie('authToken', token, { expires: new Date(Date.now() + 60000), httpOnly: true });
    res.send({ AuthToken: token });
}

/**
 * Método responsável por criar um user
 */
userController.createUser = async (req, res) => {

    /*Validamos a estrutura do registo*/
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    /*Verificamos se o username encontra-se disponível*/
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist) {
        return res.status(400).send('Username is already in use!');
    }

    /*Verificamos se o email encontra-se disponível*/
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send('Email is already in use!');
    }

    /*Verificamos se o número civil encontra-se disponível*/
    const civilExist = await User.findOne({ civilNumber: req.body.civilNumber });
    if (civilExist) {
        return res.status(400).send('That civil number is already in use!');
    }

    /*Encriptamos a password*/
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var user = new User({
        username: req.body.username,
        password: hashedPassword,
        fullName: req.body.fullName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        civilNumber: req.body.civilNumber,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
        role: 'USER',
        registerDate: Date(Date.now()),
        state: 'Suspect'
    });

    try {
        await user.save();
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err)
    }
}

/**
 * Método responsável pelo registo de um técnico
 */
userController.createTechnician = async (req, res) => {

    /*Validamos a estrutura do registo*/
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    /*Verificamos se o username encontra-se disponível*/
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist) {
        return res.status(400).send('Username is already in use!');
    }

    /*Verificamos se o email encontra-se disponível*/
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send('Email is already in use!');
    }

    /*Verificamos se o número civil encontra-se disponível*/
    const civilExist = await User.findOne({ civilNumber: req.body.civilNumber });
    if (civilExist) {
        return res.status(400).send('That civil number is already in use!');
    }

    /*Encriptamos a password*/
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var technician = new User({
        username: req.body.username,
        password: hashedPassword,
        fullName: req.body.fullName,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        civilNumber: req.body.civilNumber,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
        role: 'TECHNICIAN',
        registerDate: Date(Date.now())
    });

    try {
        await technician.save();
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err)
    }
}

/**
 * Método responsável por atualizar um user
 */
userController.updateUser = async (req, res) => {
    try {
        /*Verificamos se o username encontra-se disponível*/
        const usernameExist = await User.findOne({ username: req.body.username });
        if (usernameExist) {
            return res.status(400).send('Username is already in use!');
        }

        /*Verificamos se o email encontra-se disponível*/
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).send('Email is already in use!');
        }

        /*Verificamos se o número civil encontra-se disponível*/
        const civilExist = await User.findOne({ civilNumber: req.body.civilNumber });
        if (civilExist) {
            return res.status(400).send('That civil number is already in use!');
        }
        
        await User.updateOne({ _id: req.params.userId }, req.body);
        res.status(200).send('Sucess!');
    } catch (err) {
        res.status(400).json(err);
    }
}

/**
 * Método responsável por apagar um user
 */
userController.deleteUser = async (req, res) => {
    try {
        await User.remove({ _id: req.params.userId });
        res.status(200).send('Sucess!');
    } catch (err) {
        res.status(400).json(err);
    }
}

/**
 * Método responsável por obter todos os users
 */
userController.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'USER' }, { username: 1, fullName: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1, isInfected: 1 });
        res.status(200).json(users);
    } catch (err) {
        res.json(err);
    }
}

/**
 * Método responsável por obter todos os users infetados
 */
userController.getAllInfectedUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'USER', state: "Infected" }, { username: 1, fullName: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1 });
        res.status(200).json(users);
    } catch (err) {
        res.json(err);
    }
}

/**
 * Método responsável por obter todos os técnicos
 */
userController.getAllTechnicians = async (req, res) => {
    try {
        const technicians = await User.find({ role: 'TECHNICIAN' }, { username: 1, fullName: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1 });
        res.status(200).json(technicians);
    } catch (err) {
        res.json(err);
    }
}

/**
 * Método responsável por obter um user pelo seu ID
 */
userController.getByIdUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, { username: 1, fullName: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1 });
        res.status(200).json(user);
    } catch (err) {
        res.json(err)
    }
}

/**
 * Método responsável por realizar o logout
 */
userController.logout = async (req, res) => {
    res.clearCookie('authToken');
    res.status(200).send('Sucess!');
}

module.exports = userController;