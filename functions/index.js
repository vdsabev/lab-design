const firebase = require('firebase-admin');
const functions = require('firebase-functions');
const env = require('var');

firebase.initializeApp(functions.config().firebase);

const logRef = functions.database.ref('/users/{userId}/logs/{logId}');
const reportRef = functions.database.ref('/users/{userId}/reports/{reportId}');

// Profile Indicators
const getProfileIndicators = require('./getProfileIndicators');
const updateProfileIndicators = ({ params: { userId }, data }) =>
  getProfileIndicators(data.val()).then((indicators) =>
    data.ref.root.child(`users/${userId}/profile/indicators`).update(indicators)
  )
;

exports.updateProfileIndicatorsFromLog = logRef.onWrite(updateProfileIndicators);
exports.updateProfileIndicatorsFromReport = reportRef.onWrite(updateProfileIndicators);

// Timelines
const getTimelines = require('./getTimelines');

// https://medium.com/@danbroadbent/firebase-multi-path-updates-updating-denormalized-data-in-multiple-locations-b433565fd8a5
const updateTimelines = ({ params: { userId }, data }) =>
  getTimelines(data.val()).then((timelines) => {
    const valuesByPath = {};
    Object.keys(timelines).forEach((indicatorId) => {
      const valuesByDate = timelines[indicatorId];
      Object.keys(valuesByDate).forEach((date) => {
        valuesByPath[`${indicatorId}/${date}`] = valuesByDate[date];
      });
    });
    return data.ref.root.child(`users/${userId}/timelines`).update(valuesByPath);
  })
;

exports.updateTimelinesFromLog = logRef.onWrite(updateTimelines);
exports.updateTimelinesFromReport = reportRef.onWrite(updateTimelines);
