
const functions = require('firebase-functions');
const auth = require('./middlewares/auth');
const parse = require('csv').parse;
const fs = require('fs');
const path = require('path');
express = require('express');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('./db/firebase-functions').addMessage(functions);

const whitelist = ['https://https://ntrivia-86e25.firebaseapp.com/', 'http://localhost']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.use(cookieParser);
app.use(auth.validateFirebaseIdToken);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/images', express.static(__dirname + '/../../images'));

// Routes
app.use(require('./routes/routes'))



exports.app = functions.https.onRequest(app);
