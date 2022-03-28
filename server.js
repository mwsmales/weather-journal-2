/* initialize project data */
projectData = {};
projectData['data'] = []; //create a list to entries

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

// post route for writing to endpoint
app.post('/addEntry', addEntry );

function addEntry (req, res) {
    res.send(JSON.stringify('POST received'));
    console.log("data received:", req.body);
    projectData['data'].push(req.body);
    console.log("project data:",projectData);
}