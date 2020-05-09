var mongoose = require("mongoose");
var Technician = require("../models/technician");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { loginValidation, technicianRegisterValidation, } = require('../validations/validations');

var technicianController = {};

//Login de um técnico
technicianController.login = async (req, res) => {

    //Validamos se a estrutura é válida
    const { error } = loginValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    //Verificamos se a conta existe
    const technician = await Technician.findOne({ username: req.body.username });
    if (!technician) {
        return res.status(400).send('The username must be wrong!');
    }

    //Verificamos se a password é válida
    const validPassword = await bcrypt.compare(req.body.password, technician.password);
    if (!validPassword) {
        return res.status(400).send('Invalid password!');
    }

    //Criar e devolver o token
    const token = jwt.sign({ id: technician.id, role: 'TECHNICIAN' }, process.env.TOKEN_SECRET);
    res.cookie('authToken', token, { expires: new Date(Date.now() + 60000), httpOnly: true });
    res.send({ AuthToken: token });
};

//Registo de um técnico
technicianController.createTechnician = async (req, res) => {

    //Validamos se a estrutura é válida
    const { error } = technicianRegisterValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    //Verificamos se o username encontra-se disponível
    const usernameExist = await Technician.findOne({ username: req.body.username });
    if (usernameExist) {
        return res.status(400).send('Username is already in use!');
    }

    //Verificamos se o email encontra-se disponível
    const emailExist = await Technician.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send('Email is already in use!');
    }

    //Verificamos se o número civil encontra-se disponível
    const civilExist = await Technician.findOne({ civilNumber: req.body.civilNumber });
    if (civilExist) {
        return res.status(400).send('That civil number is already in use!');
    }

    //Encriptar a password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var technician = new Technician({
        username: req.body.username,
        password: hashedPassword,
        fullName: req.body.fullName,
        civilNumber: req.body.civilNumber,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email
    });

    try {
        await technician.save();
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err)
    }
};

//ATUALIZAR TECNICO
technicianController.updateTechnician = async (req, res) => {
    try {
        await Technician.updateOne({ _id: req.params.technicianId }, req.body);
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err);
    }
};

//APAGAR UM TECNICO
technicianController.deleteTechnician = async (req, res) => {
    try {
        await Technician.remove({ _id: req.params.technicianId });
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err);
    }
};

//RECEBER TODOS OS TECNICOS
technicianController.getAllTechnicians = async (req, res) => {
    try {
        const technicians = await Technician.find();
        res.json(technicians);
    } catch (error) {
        res.json(err);
    }
};

//RECEBER TECNICO COM DETERMINADO ID
technicianController.getByIdTechnician = async (req, res) => {
    try {
        const technician = await Technician.findById(req.params.technicianId);
        res.json(technician);
    } catch (err) {
        res.json(err)
    }
};

//Logout do técnico
technicianController.logout = async (req, res) => {
    res.clearCookie('authToken');
	res.status(200).send('Sucess!');
};

module.exports = technicianController;