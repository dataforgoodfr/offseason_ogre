require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

//parse cookies sent via http requests
// const cookieParser = require('cookie-parser');
// app.use(cookieParser()) 

//use cors to accept other non domain websites to access api
// const cors = require('cors');
// app.use(cors());

const port = process.env.PORT || 3000;

const router = require('./app/router');

app.use(router);

app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});

module.exports = app