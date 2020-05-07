//Dependencies
require('dotenv/config');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json')

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Middlewares
//app.use(auth);

//Initialize the server
app.listen(process.env.DEFAULT_PORT);
console.log("http://localhost:3000");