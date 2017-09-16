const firebase = require('firebase-admin');
const functions = require('firebase-functions');
const env = require('var');

firebase.initializeApp(functions.config().firebase);

const updateProfileIndicators = require('./updateProfileIndicators');
exports.updateProfileIndicatorsFromLog = functions.database.ref('/users/{userId}/logs/{logId}').onWrite(updateProfileIndicators);
exports.updateProfileIndicatorsFromReport = functions.database.ref('/users/{userId}/reports/{reportId}').onWrite(updateProfileIndicators);
