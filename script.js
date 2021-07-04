const express = require('express');
const request = require('request');
const rp = require('request-promise');
const axios = require('axios');
const path = require('path');
const bodyparser = require('body-parser');
const api = require("./routes/api");

var app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/api', api);

app.use(express.static(path.join(__dirname, 'frontend', 'build')));


app.get('/scrape/:form_id', async function(req, res) {
    const scrape_url = 'http://form.jotform.com/' + req.params.form_id;
    rp(scrape_url)
        .then(async function(html){
            // CARD MODE -> <form.</form>
            // CLASSIC MODE -> <body>.</body>
            console.log(1);
            const isCard = html.indexOf("window.FORM_MODE = \"cardform\";") !== -1;
            if(isCard){
                res.send("");
                return;
            }
            let predictResponse = await axios({
                url:"http://127.0.0.1:5000/predict/" + req.params.form_id,
                method: "GET",
            });
            console.log("Predict Response: ");
            console.log(predictResponse.data);
            console.log(2);
            console.log(3);
            const keywords = [];
            const myFunction = (obj) => {
                keywords.push(obj['substr']);
            }
            console.log(4);
            predictResponse.data.forEach(myFunction);
            const findRegex = /<form[\s\S]*<\/form>/;
            let found = html.match(findRegex)[0];
            let foundCopy = found;
            console.log(5);
            for(let keyword of keywords){
                foundCopy = foundCopy.replace(keyword, "<span style=\"background-color: yellow\">" + keyword + "</span>");
            }
            console.log(6);
            html = html.replace(found, foundCopy);
            console.log(7);
            res.send(html);
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