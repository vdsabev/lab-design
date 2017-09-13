const firebase = require('firebase-admin');
const functions = require('firebase-functions');
const env = require('var');

firebase.initializeApp(functions.config().firebase);

const updateUserIndicators = require('./updateUserIndicators');
exports.updateUserIndicatorsFromLog = functions.database.ref('/logs/{userId}/{logId}').onWrite(updateUserIndicators);
exports.updateUserIndicatorsFromReport = functions.database.ref('/reports/{userId}/{reportId}').onWrite(updateUserIndicators);
