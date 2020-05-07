const express = require("express");

const users = require("./user-router");
const technicians = require("./technician-router");
const requests = require('./request-router');

const apiRouter = express.Router();

apiRouter.get("/", function(req, res){
    res.send({status: "ok"});
});

apiRouter.use("/users", users);
apiRouter.use("/technicians", technicians);
apiRouter.use("/requests", requests);

module.exports = apiRouter;