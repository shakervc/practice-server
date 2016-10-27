// My Node/Express server serving student data

// Having problems to get PUT to work
// I can POST hardcoded data. Probably PUT hardcoded data too. Problem is getting body data for PUT and POST. PUT and
// POST work with the JSON server
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var courses = {
    "physics":   [  { "fname": "Adi", "lname": "GaL","id": 1},
                    { "fname": "Marai", "lname": "Malai","id": 2},
                    { "fname": "Iru", "lname": "AANN","id": 3},
                    { "fname": "Oru", "lname": "PeNN","id": 4} ],
    "chemistry": [  { "fname": "Matt", "lname": "Dixon","id": 1},
                    { "fname": "John", "lname": "Dean","id": 2},
                    { "fname": "Naanum", "lname": "Varen","id": 3},
                    { "fname": "Veda", "lname": "Nayagam","id": 4} ],
    "biology":   [  { "fname": "Raj", "lname": "Ars","id": 1},
                    { "fname": "Bur", "lname": "Fee","id": 2},
                    { "fname": "Naanum", "lname": "Varen","id": 3},
                    { "fname": "Veda", "lname": "Nayagam","id": 4} ]
};

var METHOD = {
    PUT: 0,
    DELETE: 1
}
function update(method, req, res) {

    for (i = 0; i < courses[req.params.subject].length; i++) {

        if (courses[req.params.subject][i].id == req.params.id) {

            if (method == METHOD.DELETE) {
                courses[req.params.subject].splice(i, 1);
            } else if (method == METHOD.PUT) {
                courses[req.params.subject][i].fname = req.body.fname;
                courses[req.params.subject][i].lname = req.body.lname;
            }
            res.end(JSON.stringify(courses[req.params.subject]));

        }

    }
}

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// GET
app.get('*', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});


app.get('/physics', function (req, res) {
    res.end (JSON.stringify(courses["physics"]));
});
app.get('/chemistry', function (req, res) {
    res.end (JSON.stringify(courses["chemistry"]));
});
app.get('/biology', function (req, res) {
    res.end (JSON.stringify(courses["biology"]));
});

app.get("*", function(request, response) {
    response.end("404!");
});
// OPTIONS
app.options('*', function (req, res, next) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, DELETE, POST" });
    next();
});
app.options('*', function (req, res) {
    res.end('Got a OPTIONS request at /physics/1');
});
// PUT
app.put('/:subject/:id', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.put('/:subject/:id', function (req, res) {
    update(METHOD.PUT, req, res);
});
// DELETE
app.delete('*', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.delete('/:subject/:id', function (req, res) {
    update(METHOD.DELETE, req, res);
});

// POST
app.post('*', function (req, res, next) {
    console.log("Reached post");
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.post('/:subject', function (req, res) {
    // Make sure that we got one of the three expected subjects. Otherwise error
    courses[req.params.subject].push({id: req.body.id, fname: req.body.fname, lname: req.body.lname});
    res.end(JSON.stringify(courses[req.params.subject]));
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});



/*
TODO:

. Deploy this server to Heroku
. Persist using a postgres database
. Improve code
. Add error handling
. Make this into a TS server (from a JS server)

NOTES

 //https://expressjs.com/en/starter/hello-world.html
 //I have initialized the server to run from /users/schandrasekhar/WebstormProjects/practice-server1 as per instructions in above link
 // Run node index.js after cd'ing to the above folder

REFERENCES

 //http://stackoverflow.com/questions/9177049/express-js-req-body-undefined
 //https://expressjs.com/en/starter/hello-world.html

 */
