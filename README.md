# covid-19-task

**Nodejs REST-API to get records from / PUT records to AWS-Kinesis.**

API:
- Get records:
```
- GET: /api/event/{eventType}/average?from={timestamp}&to={timestamp}
```

  ```
  Response:
  {
    "type": {string},           //  one of the planets - earth / mars / neptune
    "value": {float},           //  average value of mutations count
    "processedCount": {int}     //  number of processed events
  }
  ```
- PUT record:
```
- POST: /api/event/{eventType}
```
  ```
  Response:
  {
    "ShardId": {string},        //  Shard id
    "SequenceNumber": {string}  //  Sequence number of record
  }
  ```
