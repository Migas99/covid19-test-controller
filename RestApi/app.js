//Dependencies
require('dotenv/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('./middlewares/session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')
const multer = require('multer');

//Multer storage options
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './tmp/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);
app.use(multer({ storage: storage }).single('file'));

//Import Routes
const apiRouter = require('./routes');

//Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connection sucessful!'))
    .catch((err) => console.error(err));

//Routes
app.use('/', apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Initialize the server
app.listen(process.env.DEFAULT_PORT);

//Additional information
console.log("Server is listenning on: http://localhost:3000 .");
console.log("Check http://localhost:3000/api-docs for additional information.");