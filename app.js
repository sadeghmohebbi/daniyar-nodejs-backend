const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const http = require('http');
const db = require('./db');

//Configure our app
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

if(!isProduction) {
    app.use(errorHandler());
}

//Error handlers & middlewares
if(!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}
  
app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

//configure passport
require('./utils/passport-util');

//configure routes
app.use(require('./routes'));

try {
    db.start().then(() => {
        http.createServer(app).listen(HTTP_PORT, '0.0.0.0', function () {
            console.log('[Server] http: serat app listening on port ' + HTTP_PORT);
        });
    }).catch((err) => {
        console.error(err);
    });
} catch(error) {
    console.error(error);
}

