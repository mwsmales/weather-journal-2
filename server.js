/* set up express to run local server and routes */
const express = require('express');
const app = express();

/* dependencies */
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// initialize server
const port = 8080;
const server = app.listen(port, listening);

function listening () {
    console.log("sever running");
    console.log(`listening on port: ${port}`);
}

// refer local server to app files
app.use(express.static('website'));