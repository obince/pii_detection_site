const express = require('express')
const router = express.Router()
const formRouter = require("./form");

router.use("/form", formRouter);
module.exports = router;
