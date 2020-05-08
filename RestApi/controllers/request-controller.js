var mongoose = require("mongoose");
var Request = require("../models/request");

var requestController = {};

//CRIAR UM REQUEST
requestController.createRequest = async (req, res) => {
    const request = new Request({requesterUsername: req.body.requesterUsername,
                                 description: req.body.description});
    request.save()
    .exec()
    .then(result => {console.log(result)})
        .catch(err => console.log(err));
};

//ATUALIZAR UM REQUEST
requestController.updateRequest = async (req, res) => {
    try{
        const updatedRequest = await Request.updateOne({_id: req.params.requestId}, req.body);
    }catch(err){
        res.err(err);
    }
};

//APAGAR UM REQUEST
requestController.deleteRequest = async (req, res) => {
    try{
        const deletetedRequest = await Request.remove({_id: req.params.requestId});
    }catch(err){
        res.err(err);
    }
};

//RECEBER TODOS OS REQUESTS
requestController.getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.err(err);
    }
};

//NAO FAZ SENTIDO
requestController.getOneRequest = function(req, res) {
    res.json(res.request);
};

//RECEBER REQUEST COM DETERMINADO ID
requestController.getByIdRequest = async (req, res) => {
    try{
        const request = await Request.findById(req.params.requestId);
        res.json(request);
    }catch(err){
        res.err(err)
    }
};

//RECEBER REQUESTS DE UM UTILIZADOR
requestController.getUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({requesterUsername: req.params.username});
        res.json(requests);
    } catch (error) {
        res.err(err);
    }
};

module.exports = requestController;