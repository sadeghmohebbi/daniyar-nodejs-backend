const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const http = require('http');


(start) => {
    //Configure our app
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

    if(!isProduction) {
        app.use(errorHandler());
    }

    //Configure isProduction variable
    const isProduction = process.env.NODE_ENV === 'production';

    

    try {
        http.createServer(app).listen(HTTP_PORT, '0.0.0.0', function () {
            console.log('[Server] http: serat app listening on port ' + HTTP_PORT);
        });
    } catch(error) {
        console.error(error);
    }
}

