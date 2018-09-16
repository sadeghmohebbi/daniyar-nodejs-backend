const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');
const validator = require('express-validator');
const validatorMessage = require('./routes/middlewares/validator-message');

const TAG = "[Server]";

//Configure our app
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

db.start().then(models => {
    //configure passport
    require('./utils/passport-local')(models);
    
}).catch((err) => {
    console.error(TAG, err);
});

//root welcome page api
app.get('/', (req, res) => res.send('<p>Welcome to <strong>Daniyar</strong> API</p>'));

//configure routes and global middlewares
app.use(validatorMessage, require('./routes'));

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function () {
    console.log('[Server] http: serat app listening on port ' + port);
});