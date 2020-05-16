const mongoose = require("mongoose");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { loginValidation, registerValidation, updateValidation } = require('../validations/userValidations');
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
    return res.status(200).cookie('authToken', token, { expires: new Date(Date.now() + 10*60000), httpOnly: true }).send({ AuthToken: token });
}

/**
 * Responsável por retornar as informações do user autenticado
 */
userController.getMyProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.auth.id }, { username: 1, fullName: 1, gender: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1, role: 1, isInfected: 1 });
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
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

    var valid = true;
    const errors = [];

    /*Verificamos se o username encontra-se disponível*/
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist) {
        valid = false;
        errors.push('Username is already in use!');
    }

    /*Verificamos se o email encontra-se disponível*/
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        valid = false;
        errors.push('Email is already in use!');
    }

    /*Verificamos se o número civil encontra-se disponível*/
    const civilExist = await User.findOne({ civilNumber: req.body.civilNumber });
    if (civilExist) {
        valid = false;
        errors.push('Civil Number is already in use!');
    }

    /*Se não passar todas as verificações, é então inválido*/
    if(!valid){
        return res.status(400).send(errors);
    }

    /*Encriptamos a password*/
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
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
        return res.status(200).send('Sucess!');
    } catch (err) {
        console.log(err);
        return res.json(err)
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

    var valid = true;
    const errors = [];

    /*Verificamos se o username encontra-se disponível*/
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist) {
        valid = false;
        errors.push('Username is already in use!');
    }

    /*Verificamos se o email encontra-se disponível*/
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        valid = false;
        errors.push('Email is already in use!');
    }

    /*Verificamos se o número civil encontra-se disponível*/
    const civilExist = await User.findOne({ civilNumber: req.body.civilNumber });
    if (civilExist) {
        valid = false;
        errors.push('Civil Number is already in use!');
    }

    /*Se não passar todas as verificações, é então inválido*/
    if(!valid){
        return res.status(400).send(errors);
    }

    /*Encriptamos a password*/
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const technician = new User({
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
        return res.status(200).send('Sucess!');
    } catch (err) {
        console.log(err);
        return res.json(err)
    }
}

/**
 * Método responsável por atualizar um user
 */
userController.updateUser = async (req, res) => {

    /*Validamos a estrutura do update*/
    const { error } = updateValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    /*Verificamos se o email encontra-se disponível*/
    if (req.body.email) {
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            return res.status(400).send('Email is already in use!');
        }
    }
    
    try {
        await User.updateOne({ _id: req.params.userId }, req.body);
        if(req.body.password){
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await User.updateOne({ _id: req.params.userId }, {password: hashedPassword});
        }
        return res.status(200).send('Sucess!');
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por apagar um user
 */
userController.deleteUser = async (req, res) => {
    try {
        await User.remove({ _id: req.params.userId });
        return res.status(200).send('Sucess!');
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter todos os users
 */
userController.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'USER' }, { username: 1, fullName: 1, gender: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1, isInfected: 1 });
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter todos os users infetados
 */
userController.getAllInfectedUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'USER', state: "Infected" }, { username: 1, fullName: 1, gender: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1 });
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter todos os técnicos
 */
userController.getAllTechnicians = async (req, res) => {
    try {
        const technicians = await User.find({ role: 'TECHNICIAN' }, { username: 1, fullName: 1, gender: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1 });
        return res.status(200).json(technicians);
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter um user pelo seu ID
 */
userController.getByIdUser = async (req, res) => {
    try {

        /*Se for o ADMIN, devolvemos sempre a informação do user*/
        if (req.auth.role == 'ADMIN') {
            const user = await User.findById(req.params.userId, { username: 1, fullName: 1, gender: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1 });
            return res.status(200).json(user);
        } else {
            /*Se não é um ADMIN, é um Technician*/
            const checkUser = await User.findById(req.params.userId);

            /*Se for informações de um User, ou do próprio técnico*/
            if (checkUser.role == 'USER' || req.auth.id == checkUser._id) {
                const user = await User.findById(req.params.userId, { username: 1, fullName: 1, gender: 1, birthDate: 1, civilNumber: 1, phoneNumber: 1, email: 1, isInfected: 1 });
                return res.status(200).json(user);
            } else {
                /*Um technician não tem direito de ter informações relativas a outro technician*/
                return res.status(403).send('You dont have permissions to see other technicians information!');
            }

        }

    } catch (err) {
        console.log(err);
        return res.json(err)
    }
}

/**
 * Método responsável por realizar o logout
 */
userController.logout = async (req, res) => {
    return res.status(200).clearCookie('authToken').send('Sucess!');
}

module.exports = userController;