var mongoose = require("mongoose");
var Request = require("../models/request");

var requestController = {};

requestController.createRequest = function(req, res, next) {
    var request = new Request(req.body);

    request.save(function(err) {
        if(err){
            next(err);
        } else {
            res.json(request);
        }
    });
};

requestController.updateRequest = function(req, res, next) {
    Request.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, request) {
        if(err) {
            next(err);
        } else {
            res.json(request);
        }
    });
};

requestController.deleteRequest = function(req, res, next) {
    req.request.remove(function (err) {
        if(err) {
            next(err);
        } else {
            res.json(req.request);
        }
    });
};

requestController.getAllRequests = function(req, res, next) {
    Request.find(function(err, requests) {
        if(err) {
            next(err);
        } else {
            res.json(requests);
        }
    });
};

requestController.getOneRequest = function(req, res) {
    res.json(res.request);
};

requestController.getByIdRequest = function(req, res, next, id) {
    Request.findOne({_id: id}, function(err, request) {
        if(err) {
            next(err);
        } else {
            req.request = request;
            next();
        }
    });
};

requestController.getForUserRequest = function(req, res, next, userUsername) {
    Request.findOne({userUsername: userUsername}, function(err, request) {
        if(err) {
            next(err);
        } else {
            req.request = request;
            next();
        }
    });
};

requestController.getUserRequests = function(req, res, next, requesterUsername) {
    Request.find({requesterUsername: requesterUsername}, function(err, request) {
        if(err) {
            next(err);
        } else {
            res.json(request);
            next();
        }
    });
};

module.exports = requestController;