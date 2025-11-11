const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
    let existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean

    let existingUser = users.find(user => user.username == username);
    if (existingUser && existingUser.password == password) {
        return true;
    }
    return false;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const loggingUser = {
        username : req.body.username,
        password : req.body.password
    };

    if (authenticatedUser(loggingUser.username, loggingUser.password)) {
        const token = jwt.sign(
            { username: loggingUser.username , userId :1}, // payload
            "fingerprint_customer",              // secret key
            { expiresIn: 60 * 60 }               // options
        );

        req.session.token = token;
        res.status(200).send("Successful login");
    } else {  
        res.status(401).send("Bad credentials");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    let book = Object.values(books)[req.params.isbn]

    if(book !== undefined) {
        let review = {
            review : req.body.review
        };

        books[req.params.isbn].reviews = review;
        return res.status(200).send("Added review");
    } else {
        return res.status(404).send("Book not found");
    }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    let book = Object.values(books)[req.params.isbn]

    if(book !== undefined) {
        books[req.params.isbn].reviews = {};
        return res.status(200).send("Deleted review");
    } else {
        return res.status(404).send("Book not found");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
