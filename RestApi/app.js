//Dependencies
require('dotenv/config');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json')

//Middlewares
app.use(cors());
app.use(bodyParser.json());

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

//Initialize the server
app.listen(process.env.DEFAULT_PORT);

//Additional information
console.log("Server is listenning on: http://localhost:3000 .");
console.log("Check http://localhost:3000/api-docs for additional information.");