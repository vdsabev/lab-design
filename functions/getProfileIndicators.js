module.exports = (record) => {
  const indicators = {};
  Object.keys(record.indicators).forEach((indicatorId) => {
    indicators[indicatorId] = {
      date: record.date,
      value: record.indicators[indicatorId]
    };
  });

  return Promise.resolve(indicators);
};
