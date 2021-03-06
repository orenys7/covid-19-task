const atob = require("atob");
const CustomError = require("../errors/custom-error");
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });

const kinesis = new AWS.Kinesis();

const filterByTimestamp = (dataRecords, from, to) => {
  const records = dataRecords.filter(
    (record) =>
      record.ApproximateArrivalTimestamp.getTime() >=
        new Date(from * 1000).getTime() &&
      record.ApproximateArrivalTimestamp.getTime() <=
        new Date(to * 1000).getTime()
  );

  if (records) {
    return records.map((record) => JSON.parse(atob(record.Data)));
  }
  return;
};

module.exports = {
  async getEventsRecords(next, eventType, from, to) {
    let params = {
      StreamName: process.env.STREAM_NAME,
      ShardId: process.env.SHARD_ID,
      ShardIteratorType: "AT_TIMESTAMP",
      Timestamp: parseFloat(from),
    };

    const ShardIterator = await new Promise((resolve, reject) => {
      kinesis.getShardIterator(params, async (err, data) => {
        if (err) {
          reject(new CustomError(err.message, err.statusCode)); // an error occurred
        } else {
          resolve(data.ShardIterator);
        }
      });
    }).catch((err) => {
      next(err);
      return;
    });

    params = {
      ShardIterator,
    };

    const result = await new Promise((resolve, reject) => {
      kinesis.getRecords(params, (err, data) => {
        if (err) {
          reject(new CustomError(err.message, err.statusCode)); // an error occurred
        } else {
          const recordslist = filterByTimestamp(data.Records, from, to);
          if (!recordslist) {
            reject(
              new CustomError("Not found records between timestamps.", 404)
            );
          }
          const planetRecords = recordslist.filter(
            (record) => record.planet === eventType
          );
          if (!planetRecords.length) {
            reject(new CustomError("No records for requested planet.", 404));
          }

          // Succeeds to get records
          resolve({
            type: eventType,
            value:
              planetRecords.map((r) => r.mutations).reduce((a, b) => a + b, 0) /
              planetRecords.length,
            processedCount: planetRecords.length,
          });
        }
      });
    }).catch((err) => {
      next(err);
      return;
    });

    return result;
  },
  async putEventsRecords(next, planet) {
    // Generate mutations
    const data = {
      planet,
      mutations: Math.random() * 100,
    };

    const params = {
      Data: new Buffer(JSON.stringify(data)),
      PartitionKey: "1",
      StreamName: process.env.STREAM_NAME,
    };
    const res = await new Promise((resolve, reject) => {
      kinesis.putRecord(params, (err, data) => {
        if (err) {
          reject(new CustomError(err.message, err.statusCode));
        } else {
          // Succeeds to put record
          resolve(data);
        }
      });
    }).catch((err) => {
      next(err);
      return;
    });

    return res;
  },
};
