const mongoose = require("mongoose");
const Request = require("../models/request");
const User = require('../models/user');
const { createRequestValidation, updateTestDateValidation, updateTestInfoValidation } = require('../validations/requestValidations');
const requestController = {};

/**
 * Método responsável pela criação de um novo pedido
 */
requestController.createRequest = async (req, res) => {

    /*Apenas users podem criar pedidos*/
    if (req.auth.role != 'USER') {
        res.status(403).send('You are not an user, so you shouldnt be making requests to be tested!');
    }

    /*Verificamos se já não existe um pedido feito por este user que ainda não foi totalmente concluído*/
    const checkRequests = await Request.find({ requesterUsername: req.auth.username, isInfected: null });
    if (checkRequests) {
        res.status(400).send('You have an open request. Wich is being handled.');
    }

    /*Validamos a estrutura do pedido*/
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

/**
 * Método responsável por atualizar um pedido
 * Neste método pode-se atualizar qualquer parâmetro
 */
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

/**
 * Método responsável por definir uma data para um teste
 */
requestController.updateRequestTestDate = async (req, res) => {

    /*Validamos a estrutura*/
    const { error } = updateTestDateValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        /*Verificamos se o pedido já não foi tratado (ou seja, se tem um resultado)*/
        if (request.isInfected !== null) {
            res.status(400).send('This request has already been handled!');
        } else {

            /*Verificamos se estamos a definir a data para o primeiro ou segundo teste*/
            if (request.firstTest === null) {
                await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
                res.status(200).send("Sucess!");
            } else {

                /*Verificamos se o segundo teste já não foi realizado*/
                if (!request.secondTest) {

                    /*Verificamos se a diferença de tempo entre os dois testes é de 48 horas*/
                    if ((Math.abs(new Date(req.body.testDate) - request.firstTest.testDate) / 3600000) > 48) {
                        await Request.updateOne({ _id: req.params.requestId }, { $set: { secondTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
                        res.status(200).send("Sucess!");
                    } else {
                        res.status(400).send('The second test should be at least 48 hours later!');
                    }

                } else {
                    /*Nunca podemos chegar aqui*/
                    res.status(400).send('This request hasnt been handled correctly!');
                }
            }
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

/**
 * Método responsável por atualizar o resultado de um teste
 */
requestController.updateRequestTestInfo = async (req, res) => {

    /*Validamos a estrutura*/
    const { error } = updateTestInfoValidation(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        /*Verificamos se o pedido já não foi tratado (verificando se tem um resultado)*/
        if (request.isInfected !== null) {
            res.status(400).send('This request has already been handled!');
        } else {

            /*Verificamos se o primeiro teste tem uma data definida*/
            if (request.firstTest != null) {

                /*Verificamos se o primeiro teste tem um resultado*/
                if (request.firstTest.result == null) {

                    /*Se o estado atual do user for 'Safe' e o teste der negativo, podemos então definir o resultado final do pedido*/
                    if (request.userState == 'Safe' && !req.body.result) {
                        await Request.updateOne({ _id: req.params.requestId }, { $set: { 'firstTest.pdfFilePath': req.body.pdfFilePath, 'firstTest.result': req.body.result, resultDate: Date(Date.now()), isInfected: false } });
                    } else {

                        /*Se o resultado for positivo*/
                        if (req.body.result) {
                            await Request.updateOne({ _id: req.params.requestId }, { $set: { 'firstTest.pdfFilePath': req.body.pdfFilePath, 'firstTest.result': req.body.result, resultDate: Date(Date.now()), isInfected: true } });
                            await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Infected' } });
                        }

                    }

                    res.status(200).send("Sucess!");
                } else {

                    /*Verificamos se o segundo teste já tem data definida*/
                    if (request.secondTest != null) {

                        /*Verificamos se o segundo teste já tem um resultado*/
                        if (request.secondTest.result == null) {
                            await Request.updateOne({ _id: req.params.requestId }, { $set: { 'secondTest.pdfFilePath': req.body.pdfFilePath, 'secondTest.result': req.body.result, resultDate: Date(Date.now()), isInfected: req.body.result } });

                            /*Dependendo do resultado, atualizamos o estado do user*/
                            if (req.body.result) {
                                await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Infected' } });
                            } else {
                                await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Safe' } });
                            }

                            res.status(200).send("Sucess!");
                        } else {
                            /*We can never reach this point, otherwise something is wrong*/
                            res.status(400).send('This request hasnt been handled correctly!');
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

/**
 * Método responsável por eliminar um pedido
 */
requestController.deleteRequest = async (req, res) => {
    try {
        await Request.remove({ _id: req.params.requestId });
        res.status(200).send('Sucess!');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

/**
 * Método responsável por obter todos os pedidos
 */
requestController.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

/**
 * Método responsável por obter um pedido com um ID específico
 */
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

/**
 * Método responsável por obter todos os pedidos realizados por um dado user
 */
requestController.getUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requesterUsername: req.params.requesterUsername });
        res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

/**
 * Método responsável por obter o número de testes realizados durante um período de tempo
 */
requestController.getTestsBetweenDates = async (req, res) => {
    try {
        if(Math.abs(new Date(req.body.beginDate) - new Date(req.body.endDate)) >=0){
        var testCount = await Request.countDocuments({
            "firstTest.testDate": {
                $gte: new Date(req.body.beginDate),
                $lt: new Date(req.body.endDate)
            }
        });

        testCount = testCount + await Request.countDocuments({
            "secondTest.testDate": {
                $gte: new Date(req.body.beginDate),
                $lt: new Date(req.body.endDate)
            }
        });

        res.status(200).json({ "testCount": testCount });
    }else{
        res.status(400).send("The endDate must after the beginDate.");
    }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

module.exports = requestController;