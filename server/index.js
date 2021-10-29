require('dotenv').config();
const express = require('express');
const app = express();

// const bodyParser = require('body-parser');
// Parse URL-encoded bodies (as sent by HTML forms)
// app.use(bodyParser.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
// app.use(bodyParser.json());

// const cookieParser = require('cookie-parser');
//parse cookies sent via http requests
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