const { Router } = require("express");
const { getEvents, postEvents } = require("./events.controller");

const router = Router();

router.get("/:eventType/average", getEvents);
router.post("/:eventType", postEvents);

module.exports = router;
