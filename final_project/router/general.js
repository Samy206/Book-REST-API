const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require('axios')
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
function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books)
    });
}

public_users.get('/',function (req, res) {
    getBooks().then(data => {
        res.json(data)
    }).catch(error => {
        res.status(500).send(error.message);
    })
});

// Get book details based on ISBN
async function getIsbn(isbn) {
    return new Promise((resolve, reject) => {
        let book = books[isbn]
        if(book !== undefined) {
            resolve(book)
          } else {
            reject("Book not found")
          }      
    });
}

public_users.get('/isbn/:isbn',async function (req, res) {
    await getIsbn(req.params.isbn)
    .then(data => {
        res.json(data)
    }).catch(error => {
        res.status(500).send(error.message);
    })
 });
  
// Get book details based on author
async function getAuthorBooks(author) {
    return new Promise((resolve, reject) => {
        let authorBooks = Object.values(books).filter(book => book.author == author)
        if(authorBooks !== undefined) {
            resolve(authorBooks)
          } else {
            reject("Author not found")
          }      
    });
};

public_users.get('/author/:author',async function (req, res) {
  await getAuthorBooks(req.params.author)
    .then(data => {
        res.json(data)
    }).catch(error => {
        res.status(500).send(error.message);
    })
});

// Get all books based on title
async function getTitleBook(title) {
    return new Promise((resolve, reject) => {
        let titleBooks = Object.values(books).filter(book => book.title == title)
        if(titleBooks !== undefined) {
            resolve(titleBooks)
          } else {
            reject("Title not found")
          }      
    });
}

public_users.get('/title/:title', async function (req, res) {
    await getTitleBook(req.params.title)
    .then(data => {
        res.json(data)
    }).catch(error => {
        res.status(500).send(error.message);
    })
})

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
