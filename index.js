// My Node/Express server serving student data
//https://expressjs.com/en/starter/hello-world.html
//I have initialized teh server to run from /users/schandrasekhar/WebstormProjects/practice-server1 as per instructions in above link
//Some day I want to deploy the server to run in Heroku
//I also want to read and wriet to database
// Store this file as index.js in myapp. Run node index.js.
//http://stackoverflow.com/questions/9177049/express-js-req-body-undefined
// Having problems to get PUT to work
//var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var physics_class =
    [   { "fname": "Adi", "lname": "GaL","id": 1},
        { "fname": "Marai", "lname": "Malai","id": 2},
        { "fname": "Iru", "lname": "AANN","id": 3},
        { "fname": "Oru", "lname": "PeNN","id": 4} ] ;
var chemistry_class =
    [   { "fname": "Matt", "lname": "Dixon","id": 1},
        { "fname": "John", "lname": "Dean","id": 2},
        { "fname": "Naanum", "lname": "Varen","id": 3},
        { "fname": "Veda", "lname": "Nayagam","id": 4} ] ;
var biology_class =
    [   { "fname": "Raj", "lname": "Ars","id": 1},
        { "fname": "Bur", "lname": "Fee","id": 2},
        { "fname": "Naanum", "lname": "Varen","id": 3},
        { "fname": "Veda", "lname": "Nayagam","id": 4} ] ;
app.get('*', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.get('/physics', function (req, res) {
    res.end (JSON.stringify(physics_class));
});
app.get('/chemistry', function (req, res) {
    res.end (JSON.stringify(chemistry_class));
});
app.get('/biology', function (req, res) {
    res.end (JSON.stringify(biology_class));
});
app.get("*", function(request, response) {
    response.end("404!");
});

app.options('*', function (req, res, next) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT" });
    next();
});
app.options('*', function (req, res) {
    res.end('Got a OPTIONS request at /physics/1');
});

app.put('/:subject/:id', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.put('/:subject/:id', function (req, res) {
    // From the request obtain the path and update the corresponding array.
    res.end('Got a PUT request at /physics/1');
    console.log(req.param('subject'));
    console.log(req.param('id'));
    // I have trouble getting body value.
    console.log(req.body);
});

app.delete('*', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.delete('/physics/1', function (req, res) {
    res.end('Got a DELETE request at /physics/1');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


