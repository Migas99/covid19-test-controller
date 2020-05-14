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
    const checkRequests = await Request.find({ requesterUsername: req.auth.username, isInfected: null });
    if (checkRequests) {
        res.status(400).send('You have an open request. Wich is being handled.');
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
        console.log(err);
        res.status(400).send(err);
    }
}

//ATUALIZAR UM REQUEST
requestController.updateRequest = async (req, res) => {
    try {
        await Request.updateOne({ _id: req.params.requestId }, req.body);
        res.status(200).send('Sucess!');

        const request = await Request.findOne({ _id: req.params.requestId });
        if (request.isInfected) {
            await User.updateOne({ username: request.requesterUsername }, { $set: { isInfected: "Infected" } });
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

requestController.updateRequestTestDate = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateTestDateValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if (request.isInfected !== null) {
            res.status(400).send('This request has already been handled!');
        } else {
            if (request.firstTest === null) {
                await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
                res.status(200).send("Sucess!");
            } else {
                if (!request.secondTest) {
                    if ((Math.abs(new Date(req.body.testDate) - request.firstTest.testDate) / 3600000) > 48) {
                        await Request.updateOne({ _id: req.params.requestId }, { $set: { secondTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
                        res.status(200).send("Sucess!");
                    } else {
                        res.status(400).send('The second test should be at least 48 hours later!');
                    }
                } else {
                    res.status(400).send('This request hasnt been handled correctly!');
                }
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

requestController.updateRequestTestInfo = async (req, res) => {
    //Verificamos se a estrutura é válida
    const { error } = updateTestInfoValidation(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        if (request.isInfected !== null) {
            res.status(400).send('This request has already been handled!');
        } else {
            if (request.firstTest != null) {
                if (request.firstTest.result == null) {
                    await Request.updateOne({ _id: req.params.requestId }, { $set: { 'firstTest.pdfFilePath': req.body.pdfFilePath, 'firstTest.result': req.body.result } });
                    if (req.body.result) {
                        await Request.updateOne({ _id: req.params.requestId }, { $set: { resultDate: Date(Date.now()), isInfected: true } });
                        await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Infected' } });
                    }
                    res.status(200).send("Sucess!");
                } else {
                    if (request.secondTest != null) {
                        if (request.secondTest.result == null) {
                            await Request.updateOne({ _id: req.params.requestId }, { $set: { 'secondTest.pdfFilePath': req.body.pdfFilePath, 'secondTest.result': req.body.result, resultDate: Date(Date.now()), isInfected: req.body.result } });
                            if (req.body.result) {
                                await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Infected' } });
                            } else {
                                await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Safe' } });
                            }
                            res.status(200).send("Sucess!");
                        } else {
                            res.status(400).send("Contact admin because you are being hacked!");
                        }
                    } else {
                        res.status(400).send('You cant update the test info because the test probably doesnt have a defined date!');
                    }
                }
            } else {
                res.status(400).send('You cant update the test info because the test probably doesnt have a defined date!');
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

//APAGAR UM REQUEST
requestController.deleteRequest = async (req, res) => {
    try {
        await Request.remove({ _id: req.params.requestId });
        res.status(200).send('Sucess!');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

//RECEBER TODOS OS REQUESTS
requestController.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

//RECEBER REQUEST COM DETERMINADO ID
requestController.getByIdRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId);

        if (req.auth.role != 'USER') {
            res.status(200).json(request);
        } else {
            if (request.requesterUsername == req.auth.username) {
                res.status(200).json(request)
            } else {
                res.status(403).send('You dont have permissions to acess other users information!');
            }
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

//RECEBER REQUESTS DE UM UTILIZADOR
requestController.getUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requesterUsername: req.params.requesterUsername });
        res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

//RECEVER REQUESTS DE UM INTERVALO DE TEMPO
requestController.getDateIntervalTests = async (req, res) => {
    try {
        var testCount = await Request.countDocuments({
            "firstTest.testDate": {
                $gte: new Date(req.body.testDate1),
                $lt: new Date(req.body.testDate2)
            }
        });
        testCount = testCount + await Request.countDocuments({
            "secondTest.testDate": {
                $gte: new Date(req.body.testDate1),
                $lt: new Date(req.body.testDate2)
            }
        });
        res.status(200).json({"testCount" : testCount});
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = requestController;