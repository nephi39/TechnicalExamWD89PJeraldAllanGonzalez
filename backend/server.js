import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createRequire } from 'node:module';
import 'dotenv/config';
const require = createRequire(import.meta.url);
const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(cors());
let host = process.env.NODE_APP_HOST;
let port = process.env.NODE_APP_PORT;
let user = process.env.NODE_APP_USER;
let password = process.env.NODE_APP_PASSWORD;
let database = process.env.NODE_APP_DATABASE;
let reactport = process.env.NODE_APP_REACTPORT;
const connection = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database
});


app.post('/userLogin', function(request, response){
    const usernameFromFrontEnd = request.body.email;
    const passwordFromFrontEnd = request.body.pwd;
    const myQuery = `SELECT id, password, isActive FROM caviteg_opcdo.tblusers
                    WHERE email = "${usernameFromFrontEnd}"`;
    connection.query(myQuery, function(err, result){
        if(err) throw err;

        if(result && result[0] && result[0].id){
            const hashedpassword = result[0].password;
             const checkIfPasswordCorrect =   bcrypt.compareSync(passwordFromFrontEnd, hashedpassword);
             if(checkIfPasswordCorrect){
                const isActive = result[0].isActive;
                if(isActive === 1){
                    const token = jwt.sign({id: result[0].id, username: usernameFromFrontEnd }, 'secretnasecret', 
                    { expiresIn: '1h' });
                     response.send({"success": true, emailAddress: usernameFromFrontEnd, token: token});
                }else{
                    response.send({"success": false, "error": "Inactive Account", "isActive": true});
                }
                
             }else{
                response.send({"success": false, "error": "Invalid Credentials", "denied": true});
             }
        }else{
            response.send({"success": false, "Error": "Invalid Credentials", "denied": true});
        }
    });
});

app.post('/register', function(request, response){
    const usernameFromFrontEnd = request.body.email;
    const passwordFromFrontEnd = request.body.pwd;
    const hash = bcrypt.hashSync(passwordFromFrontEnd, 10);
    const myQuery = `SELECT * FROM caviteg_opcdo.tblusers
                    WHERE email = "${usernameFromFrontEnd}"`;
    connection.query(myQuery, function(err, result){
        if(err) throw err;
        if(result && result[0] && result[0].id){
            console.log('Email already in use', result[0].email);
            response.send({"success": false, "error": "Email already in use", "denied": true});
            
        }else{
            // Create a function for reusable perpose
            const generateRandomString = (myLength) => {
                const chars =
                "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
                const randomArray = Array.from(
                { length: myLength },
                (v, k) => chars[Math.floor(Math.random() * chars.length)]
                );
            
                const randomString = randomArray.join("");
                return randomString;
            };
            const piv = generateRandomString(32);
            const myQuery1 = `INSERT INTO caviteg_opcdo.tblusers(email, password, roleID, isActive, isVerified, piv, registrationDate) VALUES("${usernameFromFrontEnd}", "${hash}", "3", "0", "0", "${piv}", NOW() )`;
            connection.query(myQuery1, function(err, result){
                if(err) throw err;
            });
                
            const email_message_content = 
                "Hello " + usernameFromFrontEnd  + ", <br /><br />Your account has been successfully created. To activate your account please click the link below and log-in using the following information:<br/><br/> EMAIL: " + usernameFromFrontEnd + " <br/>PASSWORD: " + passwordFromFrontEnd + "<br/> <br/> <br/>Please click the link below and activate your account to complete your registration:<br/><br/><a href='" + reactport + "/emailVerification?email=" + usernameFromFrontEnd+"&piv="+piv+"'>" + reactport + "/emailVerification?email=" + usernameFromFrontEnd+"&piv="+piv+"</a> <br/><br/>If this <a href='" + reactport + "/emailVerification?email=" + usernameFromFrontEnd+"&piv="+piv+"'>" + reactport + "/emailVerification?email=" + usernameFromFrontEnd+"&piv="+piv+"</a> is not working, copy and paste it to your browser address bar.<br/>Should you have any questions, suggestions or comments, you may call us at (046)419-0262. <br/><br/><br/>Sincerely,<br/><br/>Provincial Information and Communications Technology Office<br/>2nd Floor, Provincial Capitol Building, <br/>4109 Trece Martires City.<br/>";

            const nodemailer  = require("nodemailer");
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'eregcavite@gmail.com',
                    pass: 'lfkyiafegjpriiop'
                }
            });

            const mailOptions = {
                from: '"PGC - OPCDO" <eregcavite@gmail.com>', 
                to: usernameFromFrontEnd,
                subject: 'Account Activation',
                html: email_message_content
            };

            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });
         response.send({"success": true, "result": "success"});
        }

    });     
});

app.post('/emailVerification', function(request, response){

    const emailURL = request.body.email;
    const pivURL = request.body.piv;
    const myQuery = `SELECT * FROM caviteg_opcdo.tblusers
                    WHERE email = "${emailURL}" and piv = "${pivURL}"`;
    connection.query(myQuery, function(err, result){
        if(err) throw err;

        if(result && result[0] && result[0].id){
            const isActive = result[0].isActive;
            if(isActive == 0){
                const myUpdate = ` UPDATE caviteg_opcdo.tblusers SET isActive = 1
                    WHERE email = "${emailURL}" and piv = "${pivURL}" and  isActive = 0 `;
                    connection.query(myUpdate, function(errup, resultup){
                        if(errup) throw errup;    

                        if(resultup){
                            console.log('The Email Verified and Updated Successfully');
                            response.send({"success": true, emailAddress: emailURL});
                        }else{
                            console.log('Unable to Verify and Update the Email');
                            response.send({"success": false, "error": "Unable to update the account status", "deniedUpdate": true});
                        }
                    });
                
            }else{
                console.log('The Email was already verified');
                response.send({"success": false, "error": "The Email was already verified", "deniedActive": true});
            }
        }else{
            response.send({"success": false, "error": "Invalid Credentials", "denied":true});
        }
    });
});
connection.connect(function(error){
    if(error) throw error;

    console.log("APP IS NOW RUNNING");
    app.listen(3010);
    console.log("App is now running on port", 3010);
});