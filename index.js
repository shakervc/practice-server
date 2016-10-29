// My Node/Express server serving student data

var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
var app = express();

// Database

// Type of connection (i.e., type of database) is 1st postgres
// username is 2nd postgres
// password is 3rd postgres
// database name is 4th postgres

const conString = 'postgres://postgres:postgres@localhost/postgres';
const selectString = 'UPDATE classes SET fname= $1, lname = $2 WHERE course = $3 and id = $4';
const deleteString = 'DELETE from classes WHERE course = $1 and id = $2';
const insertString = 'INSERT into classes VALUES ($1, $2, $3, $4)';

var courses = {};
var p = [];
var c = [];
var b = [];

const pg = require('pg')

function update(req, res) {
    for (i = 0; i < courses[req.params.subject].length; i++) {
        if (courses[req.params.subject][i].id == req.params.id) {
            pg.connect(conString, function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err)
                }
                client.query(selectString,
                    [req.body.fname, req.body.lname, req.params.subject, req.params.id], function (err, result) {
                        done()
                        if (err) {
                            return console.error('error happened during update query', err)
                        }
                    })
            })
            courses[req.params.subject][i].fname = req.body.fname;
            courses[req.params.subject][i].lname = req.body.lname;
            res.end(JSON.stringify(courses[req.params.subject]));
        }
    }
}

function deleteData(req, res) {
    for (i = 0; i < courses[req.params.subject].length; i++) {
        if (courses[req.params.subject][i].id == req.params.id) {
            pg.connect(conString, function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err)
                }
                client.query(deleteString,
                    [req.params.subject, req.params.id], function (err, result) {
                        done()
                        if (err) {
                            return console.error('error happened during delete query', err)
                        }
                    })
            })
            courses[req.params.subject].splice(i, 1);
            res.end(JSON.stringify(courses[req.params.subject]));
        }
    }
}

function insert(req, res) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err)
        }
        client.query(insertString,
            [req.params.subject, req.body.id, req.body.fname, req.body.lname], function (err, result) {
                done()
                if (err) {
                    return console.error('error happened during insert query', err)
                }
            })
    })
    courses[req.params.subject].push({id: req.body.id, fname: req.body.fname, lname: req.body.lname});
    res.end(JSON.stringify(courses[req.params.subject]));
}

// Read once at the start.
function getData(client, done) {
    client.query('SELECT * from classes', [], function (err, result) {
        done()

        if (err) {
            return console.error('error happened during query', err)
        }
        for (i = 0; i < result.rows.length; i++) {
            var o = {};
            o.fname = result.rows[i].fname;
            o.lname = result.rows[i].lname;
            o.id = result.rows[i].id;
            if (result.rows[i].course == "physics") {
                p.push (o);
            } else if (result.rows[i].course == "chemistry") {
                c.push (o);
            } else if (result.rows[i].course == "biology") {
                b.push (o);
            }
        }
        courses.physics = p;
        courses.chemistry = c;
        courses.biology = b;
    })
}


pg.connect(conString, function (err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err)
    }
    getData(client, done);
})

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
    update(req, res);
});
// DELETE
app.delete('*', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.delete('/:subject/:id', function (req, res) {
    deleteData(req, res);
});

// POST
app.post('*', function (req, res, next) {
    res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    next();
});
app.post('/:subject', function (req, res) {
    // Make sure that we got one of the three expected subjects. Otherwise error
    insert(req, res);
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});



/*
TODO:

. Deploy this server to Heroku
. Improve code
. Add error handling
. Make this into a TS server (from a JS server)

NOTES

 //https://expressjs.com/en/starter/hello-world.html
 //I have initialized the server to run from /users/schandrasekhar/WebstormProjects/practice-server1 as per instructions in above link
 // Run node index.js after cd'ing to the above folder

REFERENCES

 http://stackoverflow.com/questions/9177049/express-js-req-body-undefined
 https://expressjs.com/en/starter/hello-world.html
 http://mherman.org/blog/2015/02/12/postgresql-and-nodejs/#.WBOQ3-ErLRY

 INSTRUCTIONS

 Go to the folder where present file is in and run node index.js

 */
