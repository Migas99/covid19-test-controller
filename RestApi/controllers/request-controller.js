var mongoose = require("mongoose");
var Request = require("../models/request");
var User = require('../models/user');
const { createRequestValidation, updateTestDateValidation, updateTestInfoValidation } = require('../validations/requestValidations');

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
        description: req.body.description,
        priority: req.body.priority,
        submitDate: Date(Date.now())
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

requestController.updateRequestTestDate = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateTestDateValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if (request.isInfected != null) {
            res.status(400).send('This request has already been handled!');
        } else {
            if (request.firstTest == null) {
                await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
            } else {
                if (request.secondTest == null) {
                    await Request.updateOne({ _id: req.params.requestId }, { $set: { secondTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
                } else {
                    res.status(400).send('This request hasnt been handled correctly!');
                }
            }
        }

        res.status(200).send('Sucess!');
    } catch (err) {
        res.json(err);
    }
};

requestController.updateRequestTestInfo = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateTestInfoValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if (request.finalResult != null) {
            res.status(400).send('This request has already been handled!');
        } else {
            if (request.firstTest.testDate != null && request.firstTest.result == null) {
                await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTest: { pdfFilePath: req.body.pdfFilePath, result: req.body.result } } });
            } else {
                if (request.secondTest.testDate != null && request.secondTest.result == null) {
                    await Request.updateOne({ _id: req.params.requestId }, { $set: { secondTest: { pdfFilePath: req.body.pdfFilePath, result: req.body.result } } });
                } else {
                    res.status(400).send('You cant update the test info because the test probably doesnt have a defined date!');
                }
            }
        }

        res.status(200).send('Sucess!');

        if (req.body.result) {
            await Request.updateOne({ _id: req.params.requestId }, { $set: { resultDate: Date(Date.now()), isInfected: true } });
            await User.updateOne({ username: request.requesterUsername }, { $set: { isInfected: true } });
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