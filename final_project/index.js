const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
let users = [];

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

/**
 * users registration */
app.post("/customer/auth/register", function auth(req,res){

    // If we have data to store, we add a new user
    if(req.body.username && req.body.password) {

        let existingUser = users.find(user => user.username === req.body.username);
        if(existingUser) {
            res.status(200).send("A user with the same username exists");
        } else {
            let newUser = {
                username: req.body.username,
                password: req.body.password
            }
    
            users.push(newUser);
            console.log(users)
            res.status(200).send(`User ' ${req.body.username} ' created`);
        }

    } else {
        res.status(400).send("Invalid or missing data");
    }
});

/**
 * users login */
app.post("/customer/auth/login", function auth(req,res){
    const loggingUser = {
        username : req.body.username,
        password : req.body.password
    };

    let existingUser = users.find(user => user.username == loggingUser.username);
    if (existingUser && existingUser.password == loggingUser.password) {
        const token = jwt.sign(
            { username: existingUser.username }, // payload
            "fingerprint_customer",              // secret key
            { expiresIn: 60 * 60 }               // options
        );

        req.session.token = token;
        res.status(200).send("Successful login");
    } else {  
        res.status(401).send("Bad credentials");
    }
});

app.use("/customer/auth/*", function auth(req,res,next){
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Please log in first." });
      }
    next(); // user is logged in, proceed
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
