const express = require('express');
const request = require('request');
const rp = require('request-promise');
const path = require('path');
const bodyparser = require('body-parser');
const api = require("./routes/api");

var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/api', api);

app.use(express.static(path.join(__dirname, 'frontend', 'build')));


app.get('/scrape/:form_id', function(req, res) {
    const scrape_url = 'http://form.jotform.com/' + req.params.form_id;
    rp(scrape_url)
        .then(function(html){
            // CARD MODE -> <form.</form>
            // CLASSIC MODE -> <body>.</body>
            const isCard = html.indexOf("window.FORM_MODE = \"cardform\";") === 1;
            res.send(html);
            console.log(html);
        })
        .catch(function(err){
            console.log(err);
        });
});

app.get('/predict/:form_id', function(req, res) {
    const predict_url = 'http://127.0.0.1:5000/predict/' + req.params.form_id;
    request(predict_url, function (error, response, body) {
        console.error('error:', error); // Print the error
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the data received
        res.send(body); //Display the response on the website
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});