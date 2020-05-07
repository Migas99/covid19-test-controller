var mongoose = require("mongoose");
var User = require("../models/user");

var userController = {};

userController.createUser = function (req, res, next) {
    var user = new User(req.body);

    user.save(function(err) {
        if(err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

userController.updateUser = function (req, res, next) {
    User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, user) {
        if(err) {
            next(err);
        } else {
            res.json(user);
        }
    });
};

userController.deleteUser = function (req, res, next) {
    req.user.remove(function(err) {
        if(err) {
            next(err);
        } else {
            res.json(req.user);
        }
    });
};

userController.getAllUsers = function(req, res, next) {
    User.find(function(err, users) {
        if(err){
            next(err);
        } else {
            res.json(users);
        }
    });
};

userController.getOneUser = function(req, res, next) {
    res.json(req.user);
};

userController.getByIdUser = function(req, res, next, id) {
    User.findOne({_id: id}, function(err, user) {
        if(err){
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

module.exports = userController;