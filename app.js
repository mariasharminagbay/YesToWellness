const express = require("express");
const mysql = require("mysql");

const app = express();

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'yestowellness'
})

db.connect((error) => {
    if(error) {
        console.log(error)
    }else {
        console.log("MYSQL Connected..")
    }
})

app.get("/", (req, res) => {
    res.send("<h1> Home Page </h1>")
});

app.listen(5500, () => {
    console.log("Server started on port 5500" );
})