const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');

const TAG = "[Server]";

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
    
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('[Server] http: serat app listening on port ' + port);
    });
}).catch((err) => {
    console.error(TAG, err);
});