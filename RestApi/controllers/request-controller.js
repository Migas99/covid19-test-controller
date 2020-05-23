const mongoose = require("mongoose");
const Request = require("../models/request");
const User = require('../models/user');
const { createRequestValidation, updateTestDateValidation, updateTestInfoValidation } = require('../validations/requestValidations');
const multer = require('multer');
const fs = require('fs');
const requestController = {};

/**
 * Método responsável pela criação de um novo pedido
 */
requestController.createRequest = async (req, res) => {

    /*Apenas users podem criar pedidos*/
    if (req.auth.role != 'USER') {
        return res.status(403).json({ 'Error': 'You are not an user, so you shouldnt be making requests to be tested!' });
    }

    /*Verificamos se já não existe um pedido feito por este user que ainda não foi totalmente concluído*/
    const checkRequests = await Request.findOne({ requesterUsername: req.auth.username, isInfected: null });
    if (checkRequests) {
        return res.status(400).json({ 'Error': 'You already have an open request, wich is being handled. You cant make another request.' });
    }

    /*Validamos a estrutura do pedido*/
    const { error } = createRequestValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const request = new Request({
        requesterUsername: req.auth.username,
        description: req.body.description,
        priority: req.body.priority,
        submitDate: Date(Date.now())
    });

    try {
        await request.save();
        return res.status(200).json({ 'Success': 'The request was created with success!' });
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por atualizar um pedido
 * Neste método pode-se atualizar qualquer parâmetro, e apenas o ADMIN pode o fazer
 */
requestController.updateRequest = async (req, res) => {
    try {
        /*Atualizamos a informação*/
        await Request.updateOne({ _id: req.params.requestId }, req.body);

        /*Verificamos se qual o resultado do pedido e atualizamos o estado do user*/
        const request = await Request.findOne({ _id: req.params.requestId });
        if (request.isInfected) {
            await User.updateOne({ username: request.requesterUsername }, { $set: { isInfected: "Infected" } });
        } else {
            await User.updateOne({ username: request.requesterUsername }, { $set: { isInfected: "Safe" } });
        }

        return res.status(200).json({ 'Success': 'The request was updated with success!' });
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por definir uma data para um teste
 */
requestController.updateRequestTestDate = async (req, res) => {

    /*Validamos a estrutura*/
    const { error } = updateTestDateValidation(req.body);
    if (error) {
        return res.status(400).json({ 'Error': error.details[0].message });
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        /*Verificamos se o pedido já não foi tratado (ou seja, se tem um resultado)*/
        if (request.isInfected !== null) {
            return res.status(400).json({ 'Error': 'This request has already been handled!' });
        } else {

            /*Verificamos se estamos a definir a data para o primeiro ou segundo teste*/
            if (request.firstTest === null) {
                await Request.updateOne({ _id: req.params.requestId }, { $set: { firstTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
                return res.status(200).json({ 'Success': 'The request was updated with success!' });
            } else {

                /*Verificamos se o segundo teste já não foi realizado*/
                if (!request.secondTest) {

                    /*Verificamos se a diferença de tempo entre os dois testes é de 48 horas*/
                    if ((Math.abs(new Date(req.body.testDate) - request.firstTest.testDate) / 3600000) > 48) {
                        await Request.updateOne({ _id: req.params.requestId }, { $set: { secondTest: { testDate: req.body.testDate, responsibleTechnicianId: req.auth.id } } });
                        return res.status(200).json({ 'Success': 'The request was updated with success!' });
                    } else {
                        return res.status(400).json({ 'Error': 'The second test should be made at least 48 hours after the first test!' });
                    }

                } else {
                    /*Nunca podemos chegar aqui*/
                    return res.status(400).json({ 'Error': 'This request hasnt been handled correctly!' });
                }
            }
        }

    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por atualizar o resultado de um teste
 */
requestController.updateRequestTestInfo = async (req, res) => {

    /*Validamos a estrutura*/
    const { error } = updateTestInfoValidation(req.body);
    if (error) {
        return res.status(400).json({ 'Error': error.details[0].message });
    }

    try {
        const request = await Request.findOne({ _id: req.params.requestId });

        /*Verificamos se o pedido já não foi tratado (verificando se tem um resultado)*/
        if (request.isInfected != null) {
            return res.status(400).json({ 'Error': 'This request has already been handled!' });
        } else {

            /*Verificamos se o primeiro teste tem uma data definida*/
            if (request.firstTest != null) {

                /*Verificamos se o primeiro teste tem um resultado*/
                if (request.firstTest.result == null) {

                    console.log('antes')
                    /*Guardamos o ficheiro PDF*/
                    await upload(req, res);
                    console.log('depois')

                    /*Se o estado atual do user for 'Safe' e o teste der negativo, podemos então definir o resultado final do pedido*/
                    if (request.userState == 'Safe' && req.body.result == 'false') {
                        await Request.updateOne({ _id: req.params.requestId }, { $set: { 'firstTest.pdfFilePath': req.body.pdfFilePath, 'firstTest.result': false, resultDate: Date(Date.now()), isInfected: false } });
                    } else {

                        console.log(req.body.pdfFilePath)
                        /*Se o resultado for positivo*/
                        if (req.body.result == 'true') {
                            await Request.updateOne({ _id: req.params.requestId }, { $set: { 'firstTest.pdfFilePath': req.body.pdfFilePath, 'firstTest.result': true, resultDate: Date(Date.now()), isInfected: true } });
                            await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Infected' } });
                        } else {
                            /*Se o resultado der negativo e o estado atual do user for suspeito ou infetado*/
                            //await Request.updateOne({ _id: req.params.requestId }, { $set: { 'firstTest.pdfFilePath': req.body.pdfFilePath, 'firstTest.result': false, resultDate: Date(Date.now()), isInfected: false } });
                        }

                    }

                    return res.status(200).json({ 'Success': 'The request was updated with success!' });
                } else {

                    /*Verificamos se o segundo teste já tem data definida*/
                    if (request.secondTest != null) {

                        /*Verificamos se o segundo teste já tem um resultado*/
                        if (request.secondTest.result == null) {

                            /*Guardamos o ficheiro PDF*/
                            await upload(req, res);

                            /*Dependendo do resultado, atualizamos o estado do user*/
                            if (req.body.result == 'true') {
                                await Request.updateOne({ _id: req.params.requestId }, { $set: { 'secondTest.pdfFilePath': req.body.pdfFilePath, 'secondTest.result': true, resultDate: Date(Date.now()), isInfected: req.body.result } });
                                await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Infected' } });
                            } else {
                                await Request.updateOne({ _id: req.params.requestId }, { $set: { 'secondTest.pdfFilePath': req.body.pdfFilePath, 'secondTest.result': false, resultDate: Date(Date.now()), isInfected: req.body.result } });
                                await User.updateOne({ username: request.requesterUsername }, { $set: { state: 'Safe' } });
                            }

                            return res.status(200).json({ 'Success': 'The request was updated with success!' });
                        } else {
                            /*We can never reach this point, otherwise something is wrong*/
                            return res.status(400).json({ 'Error': 'This request hasnt been handled correctly!' });
                        }

                    } else {
                        return res.status(400).json({ 'Error': 'You cant update the test info because the test probably doesnt have a defined date!' });
                    }
                }

            } else {
                return res.status(400).json({ 'Error': 'You cant update the test info because the test probably doesnt have a defined date!' });
            }
        }

    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por eliminar um pedido
 */
requestController.deleteRequest = async (req, res) => {
    try {
        await Request.deleteOne({ _id: req.params.requestId });
        return res.status(200).json({ 'Success': 'The request was deleted with success!' });
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter todos os pedidos
 */
requestController.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        return res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter um pedido com um ID específico
 */
requestController.getByIdRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId);

        if (req.auth.role != 'USER') {
            return res.status(200).json(request);
        } else {
            if (request.requesterUsername == req.auth.username) {
                return res.status(200).json(request)
            } else {
                return res.status(403).json({ 'Error': 'You dont have permissions to acess other users information!' });
            }
        }

    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter todos os pedidos realizados por um dado user
 */
requestController.getUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requesterUsername: req.params.requesterUsername });
        return res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

/**
 * Método responsável por obter o número de testes realizados durante um período de tempo
 */
requestController.getTestsBetweenDates = async (req, res) => {
    try {
        if (Math.abs(new Date(req.body.beginDate) - new Date(req.body.endDate)) >= 0) {
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

            return res.status(200).json({ 'Success': testCount });
        } else {
            return res.status(400).json({ 'Error': 'The endDate must after the beginDate.' });
        }

    } catch (err) {
        console.log(err);
        return res.json(err);
    }
}

upload = async (req, res) => {
    const path = "./tmp/uploads/" + req.file.filename;

    fs.readFile(req.file.path, function (err, data) {
        if (err) {
            console.log(err);
            return res.json({ 'Error': err });
        } else {

            fs.writeFile(path, data, function (err) {
                if (err) {
                    console.log(err);
                    return res.json({ 'Error': err })

                } else {
                    response = {
                        message: 'File uploaded successfully!',
                        filename: req.file.filename,
                        path: path
                    };

                    req.body.pdfFilePath = path;
                    console.log(response);
                }

            });
        }
    });
}

module.exports = requestController;