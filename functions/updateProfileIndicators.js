module.exports = (event) => {
  const { userId } = event.params;
  const record = event.data.val();

  if (!record.indicators) return Promise.resolve();

  const indicators = {};
  Object.keys(record.indicators).forEach((indicatorId) => {
    indicators[indicatorId] = {
      date: record.date,
      value: record.indicators[indicatorId]
    };
  });

  return event.data.ref.root.child(`users/${userId}/indicators`).update(indicators);
};
