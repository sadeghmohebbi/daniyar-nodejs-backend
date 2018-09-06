const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');

const TAG = "[Server]";
const HTTP_PORT = process.env.PORT || 3000;

//Configure our app
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


db.start().then(models => {
    //configure passport
    require('./utils/passport-local')(models);
    
    //root welcome page api
    app.get('/', (req, res) => res.send('<p>Welcome to <strong>serat</strong> API</p>'));
    
    //configure routes
    app.use(require('./routes'));
    
    app.listen(HTTP_PORT, () => {
        console.log(TAG, 'http: serat app listening on port ' + HTTP_PORT);
    });
}).catch((err) => {
    console.error(TAG, err);
});