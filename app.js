const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');
const validator = require('express-validator');
const fs = require('fs');

//create default directories if not exists
var directories = [
    './logs',
    './public',
    './public/images',
    './public/images/uploads'
];
directories.forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
});

app.use(morgan('dev'));

//Configure our app
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

//starting and defining mongo db models
db.start().then(() => {
    //configure passport
    require('./utils/passport-local');
    
}).catch((err) => {
    console.error("[Server]", err);
});

//root welcome page api
app.get('/', (req, res) => res.send('<p>Welcome to <strong>Daniyar</strong> API</p>'));

//configure routes and global middlewares
app.use(require('./routes'));

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function () {
    console.log('[Server] http: serat app listening on port ' + port);
});