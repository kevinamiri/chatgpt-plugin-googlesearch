// path: src/index.ts

import express from "express";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import axios from 'axios';
import fsPromises from 'fs/promises';
import path from 'path';
import { processResults } from './utils';


const app = express();


// Certificate
const certificate = fs.readFileSync('/etc/letsencrypt/live/maila.ai/fullchain.pem', 'utf8');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/maila.ai/privkey.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/maila.ai/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};



const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const httpPort = 3000;
const httpsPort = 3001;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');

    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.urlencoded({
    extended: true
}))


dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const cx = process.env.CX;
const rootDomain = process.env.ROOT_DOMAIN;

console.log(apiKey, cx, rootDomain);

app.get('/.well-known/ai-plugin.json', async (req, res) => {
    try {
        const data = await fsPromises.readFile('.well-known/ai-plugin.json', 'utf8');
        const jsonData = JSON.parse(data);
        jsonData['api']['url'] = `https://${rootDomain}/.well-known/openapi.yaml`;
        jsonData['logo_url'] = `https://${rootDomain}/.well-known/logo.png`;
        jsonData['contact_email'] = process.env.CONTACT_EMAIL;
        // You can personalize the json file in the same way as shown above.

        res.json(jsonData);
    } catch (error) {
        res.status(500).json({ error: 'Error reading ai-plugin.json' });
    }
});



app.get('/search', async (req, res) => {
    const query = req.query.q || '';

    // Encode query string to be used in URL
    const queryToStr = encodeURIComponent(query.toString());

    if (!query) {
        res.status(400).json({ error: 'No query provided' });
        return;
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${queryToStr}`;

    try {
        const response = await axios.get(url);
        console.log(response.data)
        const data = response.data;
        const results = data.items || [];
        const formattedResults = await processResults(results);
        res.json({ results: formattedResults });
    } catch (error) {
        console.log(error)
        res.status(error?.response?.status).json({ error: 'Error fetching search results' });
    }
});


app.get('/.well-known/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, '.well-known', filename));
});

import { pluginInfo } from './plugin-info';
import { legal } from './legal';

app.get('/plugin-info', (req, res) => {
    res.json(pluginInfo);
});

app.get('/legal', (req, res) => {

    res.send(legal.description);


});


httpServer.listen(httpPort, () => {
    console.log(`HTTP Server running on port ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS Server running on port ${httpsPort}`);
});

