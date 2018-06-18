const admin = require('firebase-admin');
const fs1 = require('fs');
const path1 = require('path');
const serviceAccount = JSON.parse(fs1.readFileSync
  (path1.resolve(__dirname, '../../../config/ntrivia-86e25-firebase-adminsdk-omjdx-b06231cee8.json')
    , 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ntrivia-86e25.firebaseio.com'
});

module.exports = admin;
