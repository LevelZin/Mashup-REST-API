'use strict';

const express = require('express');
const PORT = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const http = require('http');

//var headers = {'User-Agent': 'MyAPI-Test/1.2.0 ( me@example.com )'};
const app = express();

app.use(bodyParser.json());

var options = {
    url: 'localhost:8000',
    method: 'GET',
    headers:{
        'User-Agent': 'MyAPI-Test/1.2.0 (twistofmaria@gmail.com)'
    },
};

app.get('/test', function(req, res){
    var MBID = req.query.MBID;
    // 5b11f4ce-a62d-471e-81fc-a69a8278c7da
    var url = 'http://musicbrainz.org/ws/2/artist/' + MBID + '?inc=aliases&fmt=json';
    http.get(url, (httpRes) => {
        const {statusCode} = httpRes;
        const contenType = httpRes.headers['content-type'];

        let error;
        if(statusCode !== 200){
            error = new Error("Request failed. \n" + statusCode);
        }
        else if(!/^application\/json/.test(contenType)){
            error = new Error("Wrong content-type: \n" + contenType);
        }
        if(error){
            console.error(error.message);
            httpRes.resume();
        }

        httpRes.setEncoding('utf8');
        let rawData = '';
        httpRes.on('data', (chunk) => {rawData += chunk; });
        httpRes.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                res.send(parsedData);
            }
            catch (e){
                console.error(e.message);
            }
        })
    })
})

app.listen(PORT, function(){
    console.log('Listening on PORT: ' + PORT);
});

app.set("trust proxy", true);