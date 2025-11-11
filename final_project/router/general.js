const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // If we have data to store, we add a new user
    if(req.body.username && req.body.password) {

        if(!isValid(req.body.username)) {
            res.status(400).send("A user with the same username exists");
        } else {
            let newUser = {
                username: req.body.username,
                password: req.body.password
            }
            users.push(newUser);
            res.status(200).send(`User ' ${req.body.username} ' created`);
        }

    } else {
        res.status(400).send("Invalid or missing data");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  let book = books[req.params.isbn]
  if(book !== undefined) {
    return res.status(200).send(JSON.stringify(book))
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
  let authorBooks = Object.values(books).filter(book => book.author == req.params.author)
  if(authorBooks !== undefined) {
    return res.status(200).send(JSON.stringify(authorBooks))
  } else {
    return res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksTitle = Object.values(books).filter(book => book.title == req.params.title)
    if(booksTitle !== undefined) {
      return res.status(200).send(JSON.stringify(booksTitle))
    } else {
      return res.status(404).json({message: "Title not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let book = Object.values(books)[req.params.isbn-1]
    if(book !== undefined) {
        return res.status(200).send(JSON.stringify(book.reviews))
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
