const express = require("express");

const users = require("./user-router");
const apiRouter = express.Router();

apiRouter.get("/", function(req, res){
    res.send({status: "ok"});
});

//vai guardar na coleção users
apiRouter.use("/users", users);

module.exports = apiRouter;