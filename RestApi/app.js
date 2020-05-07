//Dependencies
require('dotenv/config');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

//Import Routes
const apiRouter = require('./routes');

//Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
.then(() => console.log('Connection sucessful!'))
.catch((err) => console.error(err));

app.get("/", function(req, res){
    res.send("ATUM");
});

//Routes
app.use('/api', apiRouter);


//Middlewares
//app.use(auth);

//Initialize the server
app.listen(process.env.DEFAULT_PORT);
console.log("http://localhost:3000");

//module.exports = app;