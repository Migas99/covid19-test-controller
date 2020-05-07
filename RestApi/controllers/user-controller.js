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