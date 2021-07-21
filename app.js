const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config({ path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//parse URL-encoded bodies )as sent by HTML forms and grab the values in the form
app.use(express.urlencoded({extended: false}));
//parse JSON bodies (as sent by API clients)
app.use(express.json());


app.set('view engine', 'hbs');  //setting the view engine with hbs - handlebars

db.connect((error) => {
    if(error) {
        console.log(error)
    }else {
        console.log("MYSQL Connected..")
    }
})

//defihe routes

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));



app.listen(5500, () => {
    console.log("Server started on port 5500" );
})