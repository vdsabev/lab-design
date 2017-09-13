const firebase = require('firebase-admin');
const functions = require('firebase-functions');
const env = require('var');

firebase.initializeApp(functions.config().firebase);

exports.updateUserIndicators = functions.database.ref('/logs/{userId}/{logId}').onWrite((event) => {
  const { userId, logId } = event.params;
  const log = event.data.val();

  if (!log.indicators) return Promise.resolve();

  const indicators = {};
  Object.keys(log.indicators).forEach((indicatorId) => {
    indicators[indicatorId] = {
      date: log.date,
      value: log.indicators[indicatorId]
    };
  });

  return event.data.ref.root.child(`users/${userId}/indicators`).update(indicators);
});
