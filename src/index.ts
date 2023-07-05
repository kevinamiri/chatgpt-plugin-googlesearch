// path: src/index.ts

import express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { processResults } from './utils';


const app = express();


// // Certificate (You do not need this part, It's better to use NGINX Reverse or similar
// const certificate = fs.readFileSync('/etc/letsencrypt/live/maila.ai/fullchain.pem', 'utf8');
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/maila.ai/privkey.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/maila.ai/chain.pem', 'utf8');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// };



const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

const httpPort = 3000;
// const httpsPort = 3001;

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


httpServer.listen(httpPort, () => {
    console.log(`HTTP Server running on port ${httpPort}`);
});
