var mongoose = require("mongoose");
var Technician = require("../models/technician");

var technicianController = {};

technicianController.createTechnician = function(req, res, next) {
    var technician = new Technician(req.body);

    technician.save(function(err) {
        if(err){
            next(err);
        } else {
            res.json(technician);
        }
    });
};

technicianController.updateTechnician = function(req, res, next) {
    Technician.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, technician) {
        if(err) {
            next(err);
        } else {
            res.json(technician);
        }
    });
};

technicianController.deleteTechnician = function(req, res, next) {
    req.technician.remove(function(err) {
        if(err) {
            next(err);
        } else {
            res.json(req.technician);
        }
    });
};

technicianController.getAllTechnicians = function(req, res, next) {
    Technician.find(function(err, technicians) {
        if(err){
            next(err);
        } else {
            res.json(technicians);
        }
    });
};

technicianController.getOneTechnician = function(req, res) {
    res.json(req.technician);
};

technicianController.getByIdTechnician = function(req, res, next, id) {
    Technician.findOne({_id: id}, function(err, technician) {
        if(err) {
            next(err);
        } else {
            req.technician = technician;
            next();
        }
    });
};

module.exports = technicianController;