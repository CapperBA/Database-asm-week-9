// app.js 
const express = require("express")
const app = express()
const knex = require('./database/crud')
var request = require('request')
const axios = require('axios');


module.exports = app;

// Tell the app to look in the public directory
app.use(express.static(__dirname + '/public'));

// bodyparser instantiation
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

// session 
const session = require("express-session")

// session
app.use(session({
    secret: 'not_icecream', // super secret code
    resave: false,
    saveUninitialized: true,
    maxAge: Date.now() + 60000
    //cookie: { secure: true } // for https 
}))

/*
 * MARK: LOG IN
 *-----------------------------------------------------------------------
 */
// GET: login
app.get('/', function (req, res, err) {
    if (err) console.log(err);
    res.sendFile(__dirname + '/index');
});

// POST: login
app.post("/login-user", function (req, res) {
    knex.select('user', 'id', {
        username: req.body.username,
        password: req.body.password
    }, function (rows) {
        if (rows.length !== 0) {
            req.session.user = rows[0].id;
            console.log(req.session.user, "logged in")
            res.json({
                response: "OK",
                url: "/dashboard"
            });
        } else {
            console.log(req.body.username, "was denied access")
            res.json({
                response: "NO"
            });
        }
    })
});


/*
 * MARK: SIGN UP
 *-----------------------------------------------------------------------
 */
// POST: signup
app.post("/signup-user", function (req, res) {
    checkAddress(req.body.address, function (address) {
        newUser = {
            username: req.body.username,
            password: req.body.password,
            street: address[0].adgangsadresse.vejstykke.navn,
            number: address[0].adgangsadresse.husnr,
            floor: address[0].etage,
            door: address[0].dør,
            zipcode: address[0].adgangsadresse.postnummer.nr,
            city: address[0].adgangsadresse.postnummer.navn
        }
        knex.insert('user', newUser)
    })

    res.json({
        url: "/dashboard"
    })
});

function checkAddress(address, callback) {
    axios.get('https://dawa.aws.dk/adresser?q=' + address)
        .then((response) => {
            callback(response.data)
        })
        .catch((errorResponse) => {})
}

app.get("/check-username/:name", function (req, res) {
    knex.select('user', 'username', {
        username: req.params.name
    }, function (rows) {
        if (rows.length === 0) {
            //console.log("Username:", req.params.name, "is available")
            res.json({
                response: "OK"
            });
        } else {
            //console.log("Username:", req.params.name, "is already taken")
            res.json({
                response: "NO"
            });
        }
    })
})

// dashboard
// GET: dashboard
app.get('/dashboard', function (req, res) {
    if (req.session.user !== undefined) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect("/")
    }
});

app.get('/get-items', function (req, res) {
    knex.selectAll('item', function (rows) {
        res.json(rows)
    })
})

app.get('/get-basket', function (req, res) {
    if (req.session.user !== undefined) {
        knex.select('basket', '*', {
            user_id: req.session.user
        }, function (rows) {
            res.json({
                data: rows,
                url: ""
            })
            // for (row of rows) {
            //     console.log(`${row['id']} | ${row['user_id']} | ${row['item_id']} | ${row['quantity']}`);
            // }
        })
    } else {
        res.json({
            response: 401,
            url: "/"
        });
    }
})

app.post('/signout', function (req, res) {
    console.log(req.session.user, "logged out")
    req.session.destroy();
    res.json({
        response: "OK",
        url: "/"
    });
})