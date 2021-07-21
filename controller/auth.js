const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;
      
        if( !emailAddress || !password ) {
          return  res.status(400).render('login', {
              message: 'Please provide an email and password.'
          })
        }//end of if checking email and password fields if empty

        let loggedUser = "";
        console.log('this is after checking email add and pwd.');

        db.query('Select * from tblcustomers where emailAddress = ?', [emailAddress], async (error, results) => {
            console.log('Password is: ' + results[0].password);
            if( !results || !(await bcrypt.compare(password, results[0].password) )) {
                res.status(401).render('login', {
                    message: 'Password is incorrect.'
                })    
            } //end of if checking password
            else {
                const loginUser = results[0].userName;
                loggedUser = results[0].userName;
                const id = results[0].customerId;
                const islogin = 1;

                console.log("This is userlogin ID: " + id);
                /* req.session.customerId = id;//results[0].customerId;
                req.session.userName = loggedUser; //results[0].userName;

                console.log(req.session.customerId);
                //console.log(req.session.User_Id);
                
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is:" + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                                                                    //hr * min * sec * ms
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions); */

                return res.status(200).render('index', {
                    
                    //message1: req.session.lastlogin, //logdate,
                    message: [loginUser]
                });
            }
        }) //end of dbquery

    }//end of try
    catch (error) {
        console.log(error);
    }//end of catch

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
