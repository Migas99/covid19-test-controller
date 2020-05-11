var mongoose = require("mongoose");
var Request = require("../models/request");
var User = require('../models/user');
const { createRequestValidation,
    updateRequestFirstTestDateValidation,
    updateRequestFirstTestResultValidation,
    updateRequestSecondTestDateValidation,
    updateRequestSecondTestResultValidation }
    = require('../validations/requestValidations');

var requestController = {};

//CRIAR UM REQUEST
requestController.createRequest = async (req, res) => {
    if (req.auth.role != 'USER') {
        res.status(403).send('You are not an user, so you shouldnt be making requests to be tested!');
    }

    //Verificamos se a estrutura é válida
    const { error } = createRequestValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    var request = new Request({
        requesterUsername: req.auth.username,
        description: req.body.description
    });

    try {
        await request.save();
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err)
    }
};

//ATUALIZAR UM REQUEST
requestController.updateRequest = async (req, res) => {
    try {
        await Request.updateOne({ _id: req.params.requestId }, req.body);
        res.status(200).send('Sucess!');

        const request = await Request.findOne({ _id: req.params.requestId });
        if (request.finalResult) {
            await User.updateOne({ username: request.requesterUsername }, { $set: { isInfected: request.finalResult } });
        }

    } catch (err) {
        res.json(err);
    }
};

requestController.updateRequestFirstTestDate = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateRequestFirstTestDateValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    
    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if(request.finalResult != null){
            res.status(400).send('This test has already been handled!');
        }

        if(request.firstTestDate != null){
            res.status(400).send('This test first date has already been defined!');
        }

        await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTestDate: req.body.firstTestDate } });
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err);
    }
};

requestController.updateRequestFirstTestResult = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateRequestFirstTestResultValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    
    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if(request.finalResult != null){
            res.status(400).send('This test has already been handled!');
        }

        if(request.firstTestDate == null){
            res.status(400).send('This test first date hasnt been defined yet! Define it first before adding the result!');
        }

        if(request.firstTestFilePath != null && request.firstResult != null){
            res.status(400).send('The first test of this request has already been done!');
        }

        await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTestFilePath: req.body.firstTestFilePath, firstResult: req.body.firstResult } });
        res.status(200).send('Sucess!');

        if(req.body.firstResult){
            await Request.updateOne({ _id: req.params.requestId }, { $set: { finalResultDate: Date(Date.now()) , finalResult: true } });
            await User.updateOne({ username: request.requesterUsername }, { $set: { isInfected: request.finalResult } });
        }

    } catch (err) {
        res.json(err);
    }
};

requestController.updateRequestSecondTestDate = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateRequestSecondTestDateValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    
    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if(request.finalResult != null){
            res.status(400).send('This test has already been handled!');
        }

        if(request.firstResult == null){
            res.status(400).send('You cant make a second test without handling the first!');
        }

        if(request.secondTestDate != null){
            res.status(400).send('This test second date has already been defined!');
        }

        await Request.updateOne({ _id: req.params.requestId }, { $set: { secondTestDate: req.body.secondTestDate } });
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err);
    }
};

requestController.updateRequestSecondTestResult = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateRequestSecondTestResultValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    
    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if(request.finalResult != null){
            res.status(400).send('This test has already been handled!');
        }

        if(request.secondTestDate == null){
            res.status(400).send('This test second date hasnt been defined yet! Define it first before adding the result!');
        }

        if(request.secondTestFilePath != null && request.secondResult != null){
            res.status(400).send('The second test of this request has already been done!');
        }

        await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTestFilePath: req.body.firstTestFilePath, firstResult: req.body.firstResult } });
        res.status(200).send('Sucess!');

        if(req.body.secondResult){
            await Request.updateOne({ _id: req.params.requestId }, { $set: { finalResultDate: Date(Date.now()) , finalResult: true } });
            await User.updateOne({ username: request.requesterUsername }, { $set: { isInfected: request.finalResult } });
        }

    } catch (err) {
        res.json(err);
    }
};

//APAGAR UM REQUEST
requestController.deleteRequest = async (req, res) => {
    try {
        await Request.remove({ _id: req.params.requestId });
        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err);
    }
};

//RECEBER TODOS OS REQUESTS
requestController.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.json(err);
    }
};

//RECEBER REQUEST COM DETERMINADO ID
requestController.getByIdRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId);

        if (req.auth.role != 'USER') {
            res.json(request);
        } else {
            if (request.requesterUsername == req.auth.username) {
                res.json(request)
            } else {
                res.status(403).send('You dont have permissions to acess other users information!');
            }
        }

    } catch (err) {
        res.json(err)
    }
};

//RECEBER REQUESTS DE UM UTILIZADOR
requestController.getUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requesterUsername: req.params.username });
        res.json(requests);
    } catch (error) {
        res.json(err);
    }
};

module.exports = requestController;