var mongoose = require("mongoose");
var Request = require("../models/request");
var User = require('../models/user');

var requestController = {};

//CRIAR UM REQUEST
requestController.createRequest = async (req, res) => {
    if(req.auth.role != 'USER'){
        res.status(403).send('You are not an user!');
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
        const request = await Request.updateOne({ _id: req.params.requestId }, req.body);
        res.status(200).send('Sucess!');

        console.log(request.finalResult);
        if(request.finalResult == true){
            await User.updateOne({ username: request.requesterUsername }, { isInfected: request.finalResult });
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