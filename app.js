const express = require('express');
const app = express();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
jwt = require('jsonwebtoken');
const session = require('express-session');

secretKey = "terobauchorho";

pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "",
    database: "yatrakaha",
    supportBigNumbers: true,
    bigNumberStrings: true
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'))

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3000
    }
}));
app.use(require('flash')());

app.engine('hbs', require('exphbs'));
app.set('view engine', 'hbs');

//Bring in the routes
app.use('/', require('./routes/passengers'));
app.use('/', require('./routes/bus'));
app.use('/', require('./routes/index'));
// app.get('/bus/login')


app.listen(3000, () => {
    console.log("Listening to the port : 3000");
})