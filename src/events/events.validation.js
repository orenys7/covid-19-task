const CustomError = require("../errors/custom-error");
module.exports = {
  timeStampsValidation(next, from, to) {
    let error;
    const currentTimestamp = new Date().getTime();
    if (!from) {
      error = new CustomError("'from' timestamp is missing.", 400);
      next(error);
      return;
    }
    if (!to) {
      error = new CustomError("'to' timestamp is missing.", 400);
      next(error);
      return;
    }

    const fromTimestamp = new Date(from * 1000).getTime();
    const toTimestamp = new Date(to * 1000).getTime();

    if (fromTimestamp > currentTimestamp) {
      error = new CustomError(
        "'from' timestamp bigger than current timestamp.",
        400
      );
      next(error);
      return;
    } else if (toTimestamp > currentTimestamp) {
      error = new CustomError(
        "'to' timestamp bigger than current timestamp.",
        400
      );
      next(error);
      return;
    } else if (fromTimestamp > toTimestamp) {
      error = new CustomError(
        "'from' timestamp bigger than 'to' timestamp.",
        400
      );
      next(error);
      return;
    }
  },
  eventTypeValidation(next, eventType) {
    if (!eventType) {
      const error = new CustomError("'eventType' is missing.", 400);
      next(error);
      return;
    }
  },
};
