module.exports = (record) => {
  const timelines = {};
  Object.keys(record.indicators).forEach((indicatorId) => {
    timelines[indicatorId] = { [record.date]: record.indicators[indicatorId] };
  });

  return Promise.resolve(timelines);
};
