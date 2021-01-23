const { getEventsRecords, putEventsRecords } = require("./events.service");
const {
  timeStampsValidation,
  eventTypeValidation,
} = require("./events.validation");

module.exports = {
  async getEvents(req, res, next) {
    const { eventType } = req.params;
    const { from, to } = req.query;

    // Check if require parameters existed
    const eventTypeError = eventTypeValidation(next, eventType);
    const timestampError = timeStampsValidation(next, from, to);
    if (eventTypeError || timestampError) {
      return;
    }

    // Call events service
    const result = await getEventsRecords(next, eventType, from, to);
    if (!result) {
      return;
    }

    return res.status(200).json(result);
  },
  async postEvents(req, res, next) {
    const { eventType } = req.params;

    // Check if eventType existed
    const eventTypeError = eventTypeValidation(next, eventType);
    if (eventTypeError) {
      return;
    }

    // Call events service
    const result = await putEventsRecords(next, eventType);
    if (!result) {
      return;
    }

    return res.status(200).json(result);
  },
};
