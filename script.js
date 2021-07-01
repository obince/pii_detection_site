const mysql = require('mysql');
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const db = require("./db");
const api = require("./routes/api");

var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/api', api);

app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});