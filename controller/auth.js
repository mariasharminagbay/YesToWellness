const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register =(req,res) => {
    console.log(req.body);
    const {emailAddress, password} = req.body;

    db.query('Select emailAddress from tblcustomers where emailAddress =?', [emailAddress], async (error, results) => {
        if(error) {
            console.log(error);
        }
    }
}

exports.register = (req, res) => {
    console.log(req.body); // showing at console whatever it gets the req of the body and get all the value

/*     const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = re.body.passwordConfirm; */

    const {firstName, lastName, userName, emailAddress, password, passwordConfirm} = req.body;  // same as above

    db.query('Select emailAddress from tblcustomers where emailAddress =?', [emailAddress], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'Email already exists'
            })
        } else if( password != passwordConfirm ) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(passwordConfirm, 8); //8 means how many rounds will it hashed the password
        console.log(hashedPassword);
                                                    //name in db: value in the body
        db.query('Insert into tblcustomers set ?', {firstName: firstName, lastName: lastName, userName: userName, emailAddress: emailAddress, password: hashedPassword, customerTypeid: 1}, (error, results) => {
            if(error) {
              console.log(error);  
            } else{
                console.log(results);
                return res.render('register', {
                    message: 'User has been registered.'
                });
            }
        })
    });

    //res.send("Form Submitted")
}
