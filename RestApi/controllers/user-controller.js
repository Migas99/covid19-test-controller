var mongoose = require("mongoose");
var User = require("../models/user");

var userController = {};

userController.createUser = function (req, res, next) {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullName,
        birthDate: Date(req.body.birthDate),
        civilNumber: req.body.civilNumber,
        registerDate: Date().now
    });

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

userController.verifyLogin = function(req, res){
    const user = User.find (user => user.username = req.params.username);
    
    if(user == null){
        res.send("User not found");
    }else{
        if(user.password == req.params.password){
            res.send("Sucess");
        }else{
            res.send("Password Incorrect");
        }
    }
};

module.exports = userController;