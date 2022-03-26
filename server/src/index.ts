const express = require('express');
const app = express();

require('dotenv-flow').config();
const database = require('./config/database');
import { apiRouter } from './modules/apiRouter'

console.log("apiRouter", apiRouter);

// Parse URL-encoded bodies (as sent by HTML forms)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

//parse cookies sent via http requests
//const cookieParser = require('cookie-parser');
//app.use(cookieParser())

//use cors to accept other non domain websites to access api
const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 8080;

createTablesIfNotExist();

const router = require('./router');

app.use('/api', apiRouter);
app.use(router);

app.use((err, req, res) => {
    handleError(err, res)
})

app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});

module.exports = app

function createTablesIfNotExist() {
    database.sync();
}

function handleError(err, res) {
    res.status(err.statusCode || 500).send(err.message || "Unkown error"); // TODO: remove stack when on PROD.
}