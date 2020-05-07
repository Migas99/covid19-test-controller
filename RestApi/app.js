//Dependencies
require('dotenv/config');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

//Import Routes
var usersRouter = require('./routes/user-router');
var techniciansRouter = require('./routes/technician-router');
var requestRouter = require('./routes/request-router');

//Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
.then(() => console.log('Connection sucessful!'))
.catch((err) => console.error(err));


//Routes
app.use('/api/', usersRouter);
/*app.use('/api/', technicianRouter);
/*app.use('/api/', requestRouter);*/

//Middlewares
//app.use(auth);

//Initialize the server
app.listen(process.env.DEFAULT_PORT);

//module.exports = app;